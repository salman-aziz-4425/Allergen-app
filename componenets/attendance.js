import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, ScrollView } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { API, Amplify, graphqlOperation } from "aws-amplify";
import { useDispatch,useSelector } from "react-redux";
import Gallery from './Camera'
import Document from './document';
import { LastComparison,comparingFaces} from "../src/graphql/queries";
import {storeImageToS3Bucket,removal,conversion} from './utils'
export default function Attendane() {
  const [images, setPhoto] = useState([]);
  const [rollNumbers,setrollNumbers]=useState([])
  const [allUsers,setallUsers]=useState([])
  const [flag, setFlag] = useState(false);
  const Token=useSelector(state=>state.userReducer.token)
  Amplify.configure({
    API: {
      graphql_headers: async () => ({
        token:Token||""
      }),
    },
  });

const PreviewImage=(image)=>{
  // console.log(image)
  console.log("image")
   console.log(image)
  setPhoto(image)
  console.log(image)
  }
const getRollnumber=(rollNumbers,userRecords)=>{
  console.log(rollNumbers)
  setrollNumbers(rollNumbers)
  console.log(userRecords)
  setallUsers(userRecords)
}

const handleSubmit = async (e) => {
  setFlag(false);
  let finalresponse = [];
  e.preventDefault();
  //Excel to array

  if (rollNumbers.length>0) {
      await new Promise(async (r, e) => {
        console.log("next promise");
        for (let i = 0; i < images.length; i++) {
          console.log(i);
          console.log(images[i])
          let imageKey = await storeImageToS3Bucket(images[i]).catch((e)=>alert('error'));
          let variables = {
            rollNumbers,
            trgImage: imageKey,
          };
          let responseComparison = await API.graphql(
            graphqlOperation(comparingFaces, variables)
          );
          console.log(responseComparison);
          await new Promise((r) => setTimeout(r, 8500));
          await API.graphql(graphqlOperation(LastComparison))
            .then((result) => {
              if (!result?.data?.receiverSqsComparison?.resp) {
                throw "Error";
              }
              console.log(result);
              console.log(
                "response1",
                result?.data?.receiverSqsComparison?.resp
              );
              conversion(
                result?.data?.receiverSqsComparison?.resp,
                rollNumbers
              ).then((result) => {
                console.log("response2", result);
                finalresponse = finalresponse.concat(result);
              });
            })
            .catch((error) => alert("error"));
        }
        r(finalresponse);
      })
        .then(async (result) => {
          console.log("response3", result.length);
          if (result.length == 0) {
            throw "Error";
          }
          //Removal of duplication
          removal(result).then((result) => {
            if (result.length < 1) {
              throw "Error";
            }
            console.log("response4 ",result);
            // setupdatedRollno(result);
            // setloading("Attendance Marked");
          });
        })
        .catch((error) => {
          console.log("error => ", error);
          // setloading("Something went Wrong");
        });
      //___________________________________________
      //ends here

  } else {
    setrollNumbers([])
  }
};

  return (
      <View style={styles.buttonContainer}>
        <Gallery PreviewImage={PreviewImage}/>
        <Document GetRoll={getRollnumber}/>
        {(images.length>0&&rollNumbers.length>1)&&
          <Button style={{flex:1}} title='Upload' onPress={handleSubmit}>Upload</Button>
}
<ScrollView horizontal>
{
allUsers.length>0&&
          allUsers&&  allUsers.map((user)=>(
            <Image source={{uri:user.image}} style={{width: 200, height: 100,marginRight:5 }} />
          ))
          
}
</ScrollView>
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignSelf:"center"
  },
  preview: {
    alignSelf: 'stretch',
  }
});