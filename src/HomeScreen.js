import React, { useState, useEffect } from 'react';
import DateButton from './common/DateButton';
import axios from 'axios';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CardSkeleton from './common/CardSkeleton';
import WeatherInfoCard from './common/WeatherInfoCard';
import TrafficImageCard from './common/TrafficImageCard';
import LocationCard from './common/LocationCard';
import DateAndTime from './common/DateAndTime';

const HomeScreen = (props) => {

  const [date, setDate] = useState("");
  const [dateMode, setDateMode] = useState('date');
  const [showDialogBox, setShowDialogBox] = useState(false);

  const [trafficData, setTrafficData] = useState({});
  const [weatherData, setWeatherData] = useState({});

  const [selectedCamera, setSelectedCamera] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  const baseUrl = "https://api.data.gov.sg/v1";

  useEffect(() => {
    if (date === "") {
      onDateChange(new Date());
    } else {
      retrieveAllData();
    }
  }, [date]);

  const getResultsFromAPI = async (urlString) => {
    const data = await axios({
      method: 'get',
      url: `${baseUrl}${urlString}${date}`,
    }).then(response => {
      return response.data;
    })

    return data;
  }

  const populateReadLocationData = (readLocationArr, weatherVar) => {
    for (var metadata of weatherVar.area_metadata) {
      const currData = {
        location: metadata.name,
        longitude: metadata.label_location.longitude,
        latitude: metadata.label_location.latitude,
        forecastInfo: weatherVar.items[0].forecasts.filter((item) => item.area === metadata.name),
      }

      readLocationArr.push(currData);
    }
    return readLocationArr;
  }

  const getNearestLocation = (camera, readLocationArr) => {
    let closestProximityValue = Number.MAX_SAFE_INTEGER;
    let nearestLocation = null

    for (var locationObj of readLocationArr) {
      const proximityValue = Math.pow((camera.location.latitude - locationObj.latitude), 2)
        + Math.pow((camera.location.longitude - locationObj.longitude), 2);

      if (proximityValue < closestProximityValue) {
        closestProximityValue = proximityValue;
        nearestLocation = { ...locationObj };
      }
    }
    return nearestLocation;
  }

  const updateTrafficLocation = (nearestLocation, camera, trafficVar) => {

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
      return trafficVar;
    }

  }

  const retrieveAllData = async () => {

    getResultsFromAPI("/transport/traffic-images?date_time=").then(trafficApiData => {

      getResultsFromAPI("/environment/2-hour-weather-forecast?date_time=").then(weatherApiData => {
        let weatherVar = { ...weatherApiData };
        let trafficVar = { ...trafficApiData };

        let readLocationArr = [];

        if (Object.keys(weatherVar).length !== 0 && Object.keys(trafficVar).length !== 0) {

          readLocationArr = populateReadLocationData(readLocationArr, weatherVar);

          for (var camera of trafficVar.items[0].cameras) {
            let nearestLocation = getNearestLocation(camera, readLocationArr);
            trafficVar = updateTrafficLocation(nearestLocation, camera, trafficVar);
          }

          setErrorMsg("");
          setWeatherData(weatherVar);
          setTrafficData(trafficVar);
          setSelectedCamera({});
        }

      }).catch(err => {
        setErrorMsg("Failed to retrieve information for the requested date and time.")
        setWeatherData({});
        setTrafficData({});
        setSelectedCamera({});
      })
    }).catch(err => {
      setErrorMsg("Failed to retrieve information for the requested date and time.")
      setWeatherData({});
      setTrafficData({});
      setSelectedCamera({});
    })

  }

  const onDateChange = (dateChanged) => {
    let currDate = new Date(dateChanged);

    let formatDate = formatDateUnits(currDate.getFullYear())
      + "-" + formatDateUnits(currDate.getMonth() + 1)
      + "-" + formatDateUnits(currDate.getDate());

    let formatTime = formatDateUnits(currDate.getHours())
      + ":" + formatDateUnits(currDate.getMinutes())
      + ":00";

    const formattedDate = formatDate + 'T' + formatTime;
    closeDialogBox();
    setDate(formattedDate);
  }

  const formatDateUnits = (dateUnit) => {
    if (dateUnit < 10) {
      return "0" + dateUnit;
    }
    return dateUnit;
  }

  const updateSelectedCamera = (camera) => {
    setSelectedCamera(camera);
  }

  const updateDateMode = (dateMode) => {
    setShowDialogBox(true);
    setDateMode(dateMode);
  }

  const closeDialogBox = () => {
    setShowDialogBox(false);
  }

  return (
    <View style={styles.containerStyle}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {!!errorMsg ? <Text style={styles.errorMsgStyle}>{errorMsg}</Text> : null}

        <View style={styles.dateContainerStyle}>
          <DateButton title="Pick Date" updateDateMode={() => updateDateMode('date')} />
          <DateButton title="Pick Time" updateDateMode={() => updateDateMode('time')} />
        </View>


        <DateAndTime
          dateInfo={`Selected Date: ${date.slice(0, date.indexOf('T'))}`}
          timeInfo={`Selected Time: ${date.slice(date.indexOf('T') + 1, date.length)}`}
        />


        {(Object.keys(trafficData).length !== 0) ?
          <CardSkeleton title="Locations">
            <LocationCard cameras={trafficData.items[0].cameras} updateSelectedCamera={updateSelectedCamera} />
          </CardSkeleton>
          : null
        }



        {(Object.keys(selectedCamera).length !== 0) ?
          <View>
            <CardSkeleton title="Weather Information">
              <WeatherInfoCard selectedCamera={selectedCamera} />
            </CardSkeleton>

            <CardSkeleton title="Traffic Cam Photo">
              <TrafficImageCard selectedCamera={selectedCamera} />
            </CardSkeleton>
          </View>
          : null
        }

        {showDialogBox && (
          <DateTimePickerModal
            date={(new Date(date))}
            isVisible={showDialogBox}
            mode={dateMode}
            onConfirm={onDateChange}
            onCancel={closeDialogBox}
          />
        )}

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    marginHorizontal: 10,
    marginVertical: 10
  },
  errorMsgStyle: {
    color: 'red'
  },
  dateContainerStyle: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginVertical: 10
  }
})

export default HomeScreen;