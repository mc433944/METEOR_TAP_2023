import React from "react";
import { StyleSheet, View, Text } from "react-native";

const DateAndTime = (props) => {
  const { dateInfo, timeInfo } = props;

  return (
    <View style={styles.containerStyle}>
      <Text>{dateInfo}</Text>
      <Text>{timeInfo}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    marginVertical: 10
  }
})

export default DateAndTime