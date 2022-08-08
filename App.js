import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { OverflowMenuProvider } from 'react-navigation-header-buttons';
import HomeScreen from './src/HomeScreen';
import LocationScreen from './src/LocationScreen';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


export default class App extends React.Component {
  render() {
    const navigator = createStackNavigator(
      {
        Home: HomeScreen,
        Location: LocationScreen,
      },
      {
        initialRouteName: "Home",
        defaultNavigationOptions: {
          title: "App",
        },
      }
    );

    const Navigation = createAppContainer(navigator)

    return (
      <Navigation>
        <OverflowMenuProvider />
      </Navigation>
    );
  }


};

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
