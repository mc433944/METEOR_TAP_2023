import React from "react";
import { StyleSheet, Image } from "react-native";

const TrafficImageCard = (props) => {
  const {selectedCamera} = props;

  return <Image resizeMode='cover' style={styles.imgStyle} source={{ uri: selectedCamera.image }} />
}

const styles = StyleSheet.create({
  imgStyle: {
    width: "100%",
    height: 300
  }
})

export default TrafficImageCard