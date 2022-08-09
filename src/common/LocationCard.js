import React from "react";
import { StyleSheet, FlatList, View, Text, TouchableOpacity } from "react-native";
import DateAndTime from './DateAndTime';

const LocationCard = (props) => {
  const { cameras, updateSelectedCamera } = props;

  return (
    <FlatList
      data={cameras}
      keyExtractor={(camera) => camera.camera_id}
      showsHorizontalScrollIndicator={false}
      horizontal
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.btnStyle} onPress={() => updateSelectedCamera(item)}>
          <Text style={styles.cardTitleStyle}>{item.location.area}</Text>
          <DateAndTime 
            dateInfo={`Date Retrieved: ${item.timestamp.slice(0, item.timestamp.indexOf('T'))}`} 
            timeInfo={`Time Retrieved: ${item.timestamp.slice(item.timestamp.indexOf('T') + 1, item.timestamp.indexOf('+'))}`}
            />
        </TouchableOpacity>
      )}
    />
  )
}

const styles = StyleSheet.create({
  btnStyle: {
    borderColor: '#001124',
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: "white",
    width: 300,
    height: "97%",
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardTitleStyle: {
    fontSize: 18,
    fontWeight: "bold"
  }
})

export default LocationCard