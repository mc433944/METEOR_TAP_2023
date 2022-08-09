import React, { useState, useEffect } from 'react';
import InputBox from './common/InputBox';
import axios from 'axios';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const HomeScreen = (props) => {

  const [date, setDate] = useState("");
  const [dateMode, setDateMode] = useState('date');
  const [showDialogBox, setShowDialogBox] = useState(false);

  const [trafficData, setTrafficData] = useState({});
  const [weatherData, setWeatherData] = useState({});

  const [selectedCamera, setSelectedCamera] = useState({});

  const baseUrl = "https://api.data.gov.sg/v1";
  // const date = "2022-08-07";
  const dateTime = "2021-12-08T14:12:12"
  // useEffect(() => {
  //   axios({
  //     method: 'get',
  //     url: `${baseUrl}/transport/traffic-images?date_time=${dateTime}` 
  //     url: `${baseUrl}/environment/2-hour-weather-forecast?date_time=${dateTime}`
  //     // url: `${baseUrl}/environment/2-hour-weather-forecast?date=${date}`
  //   }).then(response => {
  //     console.log(response.data);
  //   })
  // },[]);

  useEffect(() => {
    console.log("UseEffect - ", date);
    if(date === "") {
      onDateChange(new Date());
    } else {
      retrieveDataFromAPI();
    }
  },[date]);


  const retrieveDataFromAPI = async () => {
    // props.navigation.navigate("Location");
    const trafficApiResults = async () => {
      console.log("TrafficAPI - ", date);
      const data = await axios({
        method: 'get',
        url: `${baseUrl}/transport/traffic-images?date_time=${date}`,
      }).then(response => {

        return response.data;
      })

      return data;
    }

    const weatherApiResults = async () => {
      console.log("WeatherAPI - ", date);
      const data = await axios({
        method: 'get',
        url: `${baseUrl}/environment/2-hour-weather-forecast?date_time=${date}`,
      }).then(response => {
        return response.data;
      })

      return data;
    }


    // add locationData forEach cameras[i] object in trafficVar.items[0].cameras
    // in the nested for loop, find the closest location in readLocationArr
    // nearestLocation found
    trafficApiResults().then(trafficApiData => {

      weatherApiResults().then(weatherApiData => {
        let weatherVar = { ...weatherApiData };
        let trafficVar = { ...trafficApiData };

        let readLocationArr = [];

        if (Object.keys(weatherVar).length !== 0 && Object.keys(trafficVar).length !== 0) {
          for (var metadata of weatherVar.area_metadata) {
            const currData = {
              location: metadata.name,
              longitude: metadata.label_location.longitude,
              latitude: metadata.label_location.latitude,
              forecastInfo: weatherVar.items[0].forecasts.filter((item) => item.area === metadata.name),
            }

            readLocationArr.push(currData);
          }

          for (var camera of trafficVar.items[0].cameras) {
            let closestProximityValue = Number.MAX_SAFE_INTEGER;
            let nearestLocation = null

            for (var locationObj of readLocationArr) {
              const proximityValue = Math.pow((camera.location.latitude - locationObj.latitude), 2) + Math.pow((camera.location.longitude - locationObj.longitude), 2);

              if (proximityValue < closestProximityValue) {
                closestProximityValue = proximityValue;
                nearestLocation = { ...locationObj };
              }
            }

            if (nearestLocation !== null) {
              const updatedCamera = {
                ...camera,
                location: {
                  ...camera.location,
                  area: nearestLocation.location,
                  forecastInfo: nearestLocation.forecastInfo
                }
              }

              trafficVar = {
                ...trafficVar,
                items: [{
                  ...trafficVar.items[0],
                  cameras: [
                    ...trafficVar.items[0].cameras.map((item) => (
                      (item.location.latitude === updatedCamera.location.latitude)
                      && (item.location.longitude === updatedCamera.location.longitude)
                    ) ? updatedCamera : item)
                  ]
                }]

              };
            } else {
              console.log("Not working properly! check nearestLocation");
            }

          }
        }

        setWeatherData(weatherVar);
        setTrafficData(trafficVar);
      }).catch(err => {
        console.log("ERR:", err);
      })
    })

  }

  const onDateChange = (dateChanged) => {
    // let currDate = (dateChanged === "") ? new Date() : new Date(dateChanged);
    let currDate = new Date(dateChanged);
    console.log("onDateChanged:", currDate);
    // console.log("onDateChanged:", currDate.splice(0, currDate.toString().indexOf('.')));
    // let formatDate = currDate.getDate() + "-" + currDate.getMonth() + "-" + currDate.getFullYear();

    let formatDate = formatDateUnits(currDate.getFullYear()) +  "-" + formatDateUnits(currDate.getMonth()+1) + "-" + formatDateUnits(currDate.getDate());
    let formatTime = formatDateUnits(currDate.getHours()) + ":" + formatDateUnits(currDate.getMinutes()) + ":00" ;
    const formattedDate = formatDate + 'T' + formatTime;
    // setShowDialogBox(Platform.OS === 'ios');
    setShowDialogBox(false);
    setDate(formattedDate);
    // setPickerDate(currDate);
    // return formattedDate;
  }

  const formatDateUnits = (dateUnit) => {
    if(dateUnit < 10) {
      return "0" + dateUnit;
    }
    return dateUnit;
  }

  const retrieveCamAndWeather = (item) => {
    console.log(item);
    setSelectedCamera(item);
  }

  const updateDateMode = (dateMode) => {
    setShowDialogBox(true);
    setDateMode(dateMode);
  }
  
  const closeDialogBox = () => {
    setShowDialogBox(false);
  }

  return (
    <View>
      <ScrollView>
        <Text>
          HomeScreen
        </Text>
        <Text>Pick Date</Text>
        <Text>Pick Time</Text>
        <Text>{date.slice(0,date.indexOf('T'))}</Text>
        <Text>{date.slice(date.indexOf('T')+1, date.length)}</Text>

        <InputBox title="Pick Date" updateDateMode={() => updateDateMode('date')} />

        <InputBox title="Pick Time" updateDateMode={() => updateDateMode('time')} />

        
         {showDialogBox && (
           <DateTimePickerModal
           date={(new Date(date))}
           isVisible={showDialogBox}
           mode={dateMode}
           onConfirm={onDateChange}
           onCancel={closeDialogBox}
         />
         )}
        
        <TouchableOpacity style={styles.btnStyle} onPress={() => onDateChange("2022-12-08T14:12:00")}>
          <Text>SUBMIT</Text>
        </TouchableOpacity>

        {Object.keys(weatherData).length !== 0 ?
          <FlatList
            data={weatherData.area_metadata}
            keyExtractor={(result) => result.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              // <Image style={styles.activityImageStyle} source={{ uri: item }} />
              <Text>{item.name}</Text>
            )}
          />

          : null
        }

        {/* display location.area camera_id */}
        <View style={{ maxHeight: 500, width: "100%", borderColor: "red", borderWidth: 1 }}>
          {(Object.keys(trafficData).length !== 0) ?
            <FlatList
              data={trafficData.items[0].cameras}
              keyExtractor={(result) => result.image}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.btnStyle} onPress={() => retrieveCamAndWeather(item)}>
                  <Image style={styles.trafficImageStyle} source={{ uri: item.image }} />
                </TouchableOpacity>
              )}
            />
            : null
          }

        </View>

        <View>
          {(Object.keys(selectedCamera).length !== 0) ?
            <View>
              <Text>{selectedCamera.location.area}</Text>
              <Text>{selectedCamera.location.forecastInfo[0].forecast}</Text>

              <Image style={styles.trafficImageStyle} source={{ uri: selectedCamera.image }} />
            </View> 
            : null
          }
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  btnStyle: {
    width: 200,
    height: 30,
    marginVertical: 10,
    marginHorizontal: 10,
    borderColor: "red",
    borderWidth: 1,
  },
  trafficImageStyle: {
    width: "90%",
    height: 15,
    marginHorizontal: "5%",
    marginVertical: "5%",
    borderRadius: 10
  },
})

export default HomeScreen;