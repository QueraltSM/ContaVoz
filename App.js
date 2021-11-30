import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    await AsyncStorage.getItem("idempresa").then((value) => {
      this.setState({ idempresa: JSON.parse(value) })
    })
    await AsyncStorage.getItem("userid").then((value) => {
      this.setState({ userid: JSON.parse(value) })
    })
    await AsyncStorage.getItem("isUserLoggedIn").then((value) => {
      if (value != null) this.setState({ isUserLoggedIn: JSON.parse(value) })
    })
    var page = "Login"
    if (JSON.parse(this.state.isUserLoggedIn)) page = "Main"
    this.props.navigation.push(page)
  }

  render() {
    return(
    <View style={styles.mainView}>
      <Image source={require('./assets/main.png')} style={{ width: 80, height: 80, alignSelf: "center", marginBottom:20 }}/>
      <Text style={styles.mainHeader}>ContaVoz</Text>
    </View>)
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
      animationEnabled: false // quitar para ios
    }
  },
  PetitionList: {
    screen: PetitionListScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false // quitar para ios
    }
  },
  PetitionHistory: {
    screen: PetitionHistoryScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false // quitar para ios
    }
  },
  ImageViewer: {
    screen: ImageViewerScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false // quitar para ios
    }
  },
  ResumeView: {    
    screen: ResumeViewScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false // quitar para ios
    }
  },
  DictionaryView: {    
    screen: DictionaryViewScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false // quitar para ios
    }
  },
});

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#1A5276",
  },
  mainHeader: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 25,
    alignSelf: "center",
    paddingBottom: 20
  },
  mainSubHeader: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: "center"
  },
  mainView: {
    backgroundColor:"#154360",
    flex: 1,
    justifyContent: 'center',
    textAlign: "center"
  },
});