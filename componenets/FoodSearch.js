import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native"
import axios from 'axios';
import LoadingScreen from '../componenets/LoadingScreen';
export default function App() {
  const navigation = useNavigation()
  const [Alergy, setAlergy] = useState([])
  const [Food, setFood] = useState("")
  const [loader, setLoader] = useState(false)
  const [Error, setError] = useState("")
  const submitHandler = () => {
    setLoader(true)
    const Url = "https://api.nal.usda.gov/fdc/v1/foods/search?query=" + Food.trim() + "&api_key=8G7WyBMHZdVwcbCb4QACt4dyFUZdAFrtmfO0wDhf"
    axios.get(Url).then((result) => {
      const ObjInfo = result.data.foods[0].foodNutrients
      console.log(ObjInfo.length)
      navigation.navigate('Description', { ObjInfo, Alergy })
    }).catch((error) => {
      setError("No information Found try again")
      setLoader(false)

    })
  }
  useFocusEffect(useCallback(() => {
    return () => {
      setError(undefined)
      setLoader(false)
    };
  }, [])
  );
  const alergyHandler = (props) => {
    setAlergy(props.split(/[\s,]+/))
  }
  const foodHandler = (props) => {
    setFood(props)
  }
  return (
    <>
      {
        loader && Alergy.length >= 1 ? <LoadingScreen /> : <View style={styles.container}>
          <Text style={{ color: "red" }}>{Error}</Text>
          <TextInput
            style={styles.input}
            onChangeText={(Text) => alergyHandler(Text)}
            placeholder="Enter Alergy"
            keyboardType="text"
          />
          <TextInput
            style={styles.input}
            onChangeText={(Text) => foodHandler(Text)}
            placeholder="Enter Food name"
            keyboardType="text"
          />
          <TouchableOpacity style={styles.button} onPress={submitHandler}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Find</Text>
          </TouchableOpacity>
          <StatusBar style="auto" />
        </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 20
  },
  button: {
    backgroundColor: "black",
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20
  }
});
