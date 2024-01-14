import { React, useEffect, useMemo } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import * as Animatable from 'react-native-animatable';
export default function LoadingScreen() {
  return (
    <SafeAreaView style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Animatable.Image
        source={require('/home/dev/Desktop/Salman_playground/Allergen-app/assets/animation-loader.gif')}
        delay={0}
        style={{ height: 50, width: 50, backgroundColor: "white" }}
      >
      </Animatable.Image>
    </SafeAreaView>
  );
}
