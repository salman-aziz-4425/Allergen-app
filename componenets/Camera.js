import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform,ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { API, Amplify, graphqlOperation } from "aws-amplify";
export default function ImagePickerExample(props) {
  const [image, setImage] = useState([]);
  Amplify.configure({
    API: {
      graphql_headers: async () => ({
        token:Token,
      }),
    },
  });
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {

      setImage([...image,result.assets[0].uri]);
      props.PreviewImage([...image,result.assets[0].uri])
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent:"space-between",marginTop:'70%',padding:10 }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <ScrollView  horizontal>
      {image && image.map((img)=>(
        <Image source={{uri:img}} style={{width: 200, height: 100,marginRight:5 }} />
      ))
    }
      </ScrollView >
      
    </View>
  );
}
