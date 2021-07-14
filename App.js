import React, {Component} from 'react';
import {StyleSheet, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AsyncStorage from '@react-native-community/async-storage';
import MainScreen from "./Main"
import LoginScreen from "./Login"
import BuyListScreen from "./BuyList"
import DictionaryViewScreen from "./DictionaryView"
import ImageViewerScreen from "./ImageViewer"
import BuyScreen from "./Buy.js"

class LaunchScreen extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      saveData: false
    }
    this.init()
  }

  async init(){
    await AsyncStorage.getItem("saveData").then((value) => {
      if (value != null) {
         this.setState({ saveData: JSON.parse(value) })
      }
    })
    var page = "Login"
    if (JSON.parse(this.state.saveData)) {
      page = "Main"
    }
    this.props.navigation.push(page)
  }
  render() {return (<View style={ styles.container }></View>)}
}

export class DocImage {
  constructor(id, uri) {
    this.id = id;
    this.uri = uri;
  }
}

export class Dictionary {
  constructor(key, value, time) {
    this.key = key;
    this.value = value;
    this.time = time;
  }
}

const AppNavigator = createStackNavigator({
  Launch: {
    screen: LaunchScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  Main: {
    screen: MainScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  Buy: {
    screen: BuyScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  BuyList: {
    screen: BuyListScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  ImageViewer: {
    screen: ImageViewerScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  DictionaryView: {    
    screen: DictionaryViewScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
});
export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});