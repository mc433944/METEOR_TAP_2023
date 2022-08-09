import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { OverflowMenuProvider } from 'react-navigation-header-buttons';
import HomeScreen from './src/HomeScreen';


export default class App extends React.Component {
  render() {
    const navigator = createStackNavigator(
      {
        Home: HomeScreen,
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
