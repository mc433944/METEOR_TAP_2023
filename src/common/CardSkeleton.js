import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

const CardSkeleton = (props) => {
  const {title} = props
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.titleStyle}>{title}</Text>
      <View style={styles.innerContainerStyle}>
        {props.children}

      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 22, 
    color: '#007AFF'
  },
  innerContainerStyle: {
    height: 300, 
    width: "100%", 
    borderColor: '#007AFF', 
    borderWidth: 1, 
    backgroundColor: '#007AFF', 
    borderRadius: 10,
    justifyContent: 'center',
  },
  containerStyle: {
    marginBottom: 20
  }
})

export default CardSkeleton;