import React from "react";
import { View, StyleSheet, Text } from "react-native";

const WeatherInfoCard = (props) => {
  const {selectedCamera} = props
  return (
    <View style={styles.outerContainerStyle}>
      <Text style={styles.textStyle}>{selectedCamera.location.area}:</Text>
      <Text style={styles.textStyle}>{selectedCamera.location.forecastInfo[0].forecast}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainerStyle: {
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  }
})

export default WeatherInfoCard