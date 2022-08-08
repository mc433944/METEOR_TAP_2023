import React, { useState, useEffect } from 'react';
import InputBox from './common/InputBox';
import axios from 'axios';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';

const HomeScreen = (props) => {

  const [trafficData, setTrafficData] = useState({});
  const [weatherData, setWeatherData] = useState({});

  const [locationData, setLocationData] = useState([]);

  const baseUrl = "https://api.data.gov.sg/v1";
  const date = "2022-08-07";
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



  const testNavigation = async () => {
    // props.navigation.navigate("Location");
    const trafficApiResults = async () => {
      const data = await axios({
        method: 'get',
        url: `${baseUrl}/transport/traffic-images?date_time=${dateTime}`,
      }).then(response => {

        return response.data;
      })

      return data;
    }

    const weatherApiResults = async () => {
      const data = await axios({
        method: 'get',
        url: `${baseUrl}/environment/2-hour-weather-forecast?date_time=${dateTime}`,
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
        let weatherVar = {...weatherApiData};
        let trafficVar = {...trafficApiData};

        console.log(trafficVar);
        // console.log("weatherVar:", weatherVar)
        let readLocationArr = [];
        
        if(Object.keys(weatherVar).length !== 0 && Object.keys(trafficVar).length !== 0) {
          for(var metadata of weatherVar.area_metadata) {
            const currData = {
              location: metadata.name,
              longitude: metadata.label_location.longitude,
              latitude: metadata.label_location.latitude,
              forecastInfo: weatherVar.items[0].forecasts.filter((item) => item.area === metadata.name),
            }
            
            readLocationArr.push(currData);
          }
          
          for(var camera of trafficVar.items[0].cameras){
            let closestProximityValue = Number.MAX_SAFE_INTEGER;
            let nearestLocation = null
            
            for(var locationObj of readLocationArr){ 
              const proximityValue = Math.pow((camera.location.latitude - locationObj.latitude),2) + Math.pow((camera.location.longitude - locationObj.longitude),2);
              
              if(proximityValue < closestProximityValue){
                closestProximityValue = proximityValue;
                nearestLocation = {...locationObj};
              }
            }

            if(nearestLocation !== null) {
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
                // ...trafficVar.items[0].cameras.map((item) => (
                //   (item.location.latitude === updatedCamera.location.latitude) 
                //   && (item.location.longitude === updatedCamera.location.longitude)
                // ) ? updatedCamera : item)
              };
            } else {
              console.log("Not working properly! check nearestLocation");
            }
            
          }
        }
        
        console.log("lengthOfReadLocation:", readLocationArr.length); //47 entry
        console.log("updatedTrafficVar:", trafficVar.items[0].cameras);


        setWeatherData(weatherVar);
        setTrafficData(trafficVar);
      }).catch(err => {
        console.log("ERR:", err);
      })
    })

    // trafficApiResults().then(trafficApiData => {

    //   weatherApiResults().then(weatherApiData => {
    //     let weatherVar = {...weatherApiData};
    //     let trafficVar = {...trafficApiData};

    //     // console.log("weatherVar:", weatherVar)
    //     let readLocationArr = [];
        
    //     if(Object.keys(weatherVar).length !== 0 && Object.keys(trafficVar).length !== 0) {
    //       for(var metadata of weatherVar.area_metadata) {
    //         const name = metadata.name
    //         // let currData = {};
    //         const currData = {
    //           location: metadata.name,
    //           // cameras: {},
    //           // cameraProximity: Number.MAX_SAFE_INTEGER,
    //           // longitude: metadata.label_location.longitude,
    //           // latitude: metadata.label_location.latitude,
    //           forecastInfo: weatherVar.items[0].forecasts.filter((item) => item.area === name),
    //         }
            
    //         readLocationArr.push(currData);
    //       }

    //       let tempLocationArr = [...readLocationArr];
    //       console.log("Total Cameras:", trafficVar.items[0].cameras.length); //total cameras: 87
    //       for(var camera of trafficVar.items[0].cameras){
    //         let closestProximityValue = Number.MAX_SAFE_INTEGER;
    //         let nearestLocation = null
    //         console.log("Called 1");
    //         for(var locationObj of readLocationArr){ //change readLocationArr to tempLocationArr
    //           const proximityValue = Math.pow((camera.location.latitude - locationObj.latitude),2) + Math.pow((camera.location.longitude - locationObj.longitude),2);
    //           // const proximityValue = Math.pow((camera.location.latitude - locationObj.forecastInfo[0].area.latitude),2) + Math.pow((camera.location.longitude - locationObj.longitude),2);
    //           if(proximityValue < closestProximityValue){
    //             closestProximityValue = proximityValue;
    //             nearestLocation = {...locationObj};
    //           }
    //         }





    //         const updatedCamera = {...camera, location: {...camera.location, area: nearestLocation.location, forecastInfo: nearestLocation.forecastInfo}}
            
    //         readLocationArr = [...trafficVar.items[0].cameras.map((item) => ((item.location.latitude === updatedCamera.location.latitude) && (item.location.longitude === updatedCamera.location.longitude)) ? updatedCamera : item)];
    //         //after finding smallest proximity, 
    //         //check nearestLocation.cameraProximity > closestProximityValue, then add to the currData
    //         if(nearestLocation.cameraProximity > closestProximityValue){
    //           console.log("Called 2");
    //           nearestLocation.cameraProximity = closestProximityValue;
    //           nearestLocation.cameras = {...camera};
    //           // console.log("check read location arr syntax:",[...tempLocationArr.map((item) => item.location === nearestLocation.location ? nearestLocation : item)]);
    //           // console.log("check", nearestLocation.cameras);
    //           readLocationArr = [...readLocationArr.map((item) => item.location === nearestLocation.location ? nearestLocation : item)];
    //         } else {
    //           console.log("Called 3:", nearestLocation);
    //         }
    //       }
    //     }
    //     // console.log("locationArr:",readLocationArr);
    //     console.log("length:", readLocationArr.length); //47 entry

    //     //const diff = (longitude1 - logitude2)^2 + (latitude1 - latitude2)^2


    //     setWeatherData(weatherVar);
    //     setTrafficData(trafficVar);
    //   }).catch(err => {
    //     console.log("ERR:", err);
    //   })
    // })
  }

  const retrieveCamAndWeather = (item) => {
    console.log(item);
  }

  return (
    <View>
      <ScrollView>
        <Text>
          HomeScreen
        </Text>

        <InputBox />
        <TouchableOpacity style={styles.btnStyle} onPress={() => testNavigation()}>
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