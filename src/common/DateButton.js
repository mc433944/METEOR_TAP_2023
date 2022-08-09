import React, {useState} from "react";
import { View, StyleSheet, TouchableOpacity, Text} from "react-native";


const DateButton = (props) => {
  const { title, updateDateMode } = props;

  return (
    <TouchableOpacity style={styles.containerStyle} onPress={() => updateDateMode()}>
        <Text style={styles.textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 22,
    color: '#007AFF'
  },
  containerStyle: {
    flexDirection: "row",
    borderColor: '#65AFFF',
    borderRadius: 20,
    borderWidth: 2,
    height: 50,
    width: "45%",
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
})

export default DateButton;