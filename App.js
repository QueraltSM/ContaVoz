import React, {Component} from 'react';
import {StyleSheet, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AsyncStorage from '@react-native-community/async-storage';
import MainScreen from "./Main"
import LoginScreen from "./Login"
import PetitionListScreen from "./PetitionList"
import DictionaryViewScreen from "./DictionaryView"
import ImageViewerScreen from "./ImageViewer"
import PetitionScreen from "./Petition.js"
import ResumeViewScreen from './ResumeView'
import PetitionHistoryScreen from "./PetitionHistory"

class LaunchScreen extends Component {  

  constructor(props) {
    super(props);
    this.state = {
      isUserLoggedIn: false,
      idempresa: "",
      userid: ""
    }
    this.init()
  }

  async init() {
    await AsyncStorage.getItem("idempresa").then((value) => {
      this.setState({ idempresa: JSON.parse(value) })
    })
    await AsyncStorage.getItem("userid").then((value) => {
        this.setState({ userid: JSON.parse(value) })
    })
    await AsyncStorage.getItem("isUserLoggedIn").then((value) => {
      if (value != null) {
         this.setState({ isUserLoggedIn: JSON.parse(value) })
      }
    })
    var page = "Login"
    if (JSON.parse(this.state.isUserLoggedIn)) {
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
  Petition: {
    screen: PetitionScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  PetitionList: {
    screen: PetitionListScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  PetitionHistory: {
    screen: PetitionHistoryScreen,
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
  ResumeView: {    
    screen: ResumeViewScreen,
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