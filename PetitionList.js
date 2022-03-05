import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList, BackHandler, ScrollView, Alert, SafeAreaView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements'
import { RFPercentage } from "react-native-responsive-fontsize";

class PetitionListScreen extends Component { 

    constructor(props) {
      super(props);
      this.state = {
        config: "",
        lists: [],
        type: "",
        loaded: false,
        icon:""
      }
      this.init()
    }

    async init() {
      await AsyncStorage.getItem("icon").then((value) => {
        this.setState({ icon: value })
      })
      await AsyncStorage.getItem("config").then((value) => {
        this.setState({ config: JSON.parse(value) })
      })
      if (this.state.config.length==0) {
        this.setState({ loaded: true })
      }
      await AsyncStorage.getItem("type").then((value) => {
        this.setState({ type: value })
      })
      var array = []
      for (let i = 0; i < this.state.config.length; i++) {
        await AsyncStorage.getItem(this.state.type+"."+i).then((value) => {
          if (value != null) array.push(JSON.parse(value).length)
          else array.push(0)
          this.setState({loaded:true})
        })
      }
      this.setState({ lists: array })
    }
  
    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }
  
    goBack = () => {
      this.props.navigation.push("Main")
      return true
    }
  
    openDocument = async (item, index) => {
      await AsyncStorage.setItem("petitionType", this.state.type+"."+index)
      await AsyncStorage.setItem("historial", item.titulo)
      await AsyncStorage.setItem("data", JSON.stringify(item))
      this.props.navigation.push("PetitionHistory")
    }

    setData (item, index) {
      return (<TouchableOpacity onPress={() => this.openDocument(item, index)}>
        <Text style={styles.registeredDocuments}>{this.state.lists[index]>0 && <Text style={styles.documentsCount}> {this.state.lists[index]} </Text>} {item.titulo} </Text>
        </TouchableOpacity>)
    }

    setMenu() {
      return(<View style={styles.navBarHeader}>
        <Text style={styles.mainHeader}>Seleccione documento</Text>
        <Icon name={this.state.icon} type='font-awesome' color='black' size={30} />
      </View>
      )
    }

    saveLogout =  async (state) => {
      if (!state) {
        await AsyncStorage.setItem("isUserLoggedIn", JSON.stringify(false));
        await AsyncStorage.setItem("company", "");
        await AsyncStorage.setItem("user", "");
        await AsyncStorage.setItem("password", "");
      }
      this.props.navigation.push("Login")
    }
  
    async logout () {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "Procedo a desconectar",
          "¿Debo mantener su identificación actual?",
          [
            {
              text: 'Sí',
              onPress: () => {
                resolve(this.saveLogout(true));
              },
            },
            {
              text: 'No',
              onPress: () => {
                resolve(this.saveLogout(false));
              },
            },
            {
              text: 'Cancelar',
              onPress: () => {
                resolve('Cancel');
              },
            },
          ],
          { cancelable: false },
        );
      });
      await AsyncAlert();
    }

    setFootbar() {
      return (<View style={styles.navBarBackHeader}>
      <View style={{ width: 100,textAlign:'center' }}>
      <TouchableOpacity onPress={() => this.props.navigation.push("Main")}>
        <Icon
          name='home'
          type='font-awesome'
          color='#1A5276'
          size={40}
        />
        </TouchableOpacity>
        </View>
        <View style={{ width: 100,textAlign:'center' }}>
        <TouchableOpacity onPress={() => this.logout()}>
        <Icon
          name='sign-out'
          type='font-awesome'
          color='#1A5276'
          size={40}
        />
        </TouchableOpacity>
        </View>
    </View>)
    }

    setBackButton() {
      if (Platform.OS !== 'ios') return null
      return <View style={{alignSelf: 'flex-start', left: 20}}>
      <TouchableOpacity onPress={() => this.goBack()} >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#1A5276'
            size={30}
          />
          </TouchableOpacity>
      </View>
    }

    render () {
      if (!this.state.loaded) return null
      return (
        <SafeAreaView style={{flex: 1,backgroundColor:"white"}}>
        <View style={styles.container}>
          {this.setBackButton()}
          {this.setMenu()}
          <ScrollView 
            vertical 
            showsVerticalScrollIndicator ={false}
            showsHorizontalScrollIndicator={false}
            persistentScrollbar={false}
            style={{backgroundColor: "#FFF" }}
          >
          <View style={styles.voiceControlView}>
            <FlatList 
              vertical
              showsVerticalScrollIndicator={false}
              data={ this.state.config } 
              renderItem={({ item, index }) => (
              (<View>
                {this.setData(item, index)}
              </View>))}
            />
          </View>
          </ScrollView>   
        {this.setFootbar()}
      </View></SafeAreaView>);
    }
  }
  
  export default createAppContainer(PetitionListScreen);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    navBarHeader: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:"white", 
      flexDirection:'row',
      textAlign: 'center',
      width: "100%",
      paddingLeft:10,
      paddingRight:10
    },
    voiceControlView: {
        flex: 1,
        backgroundColor: "#FFF",
        paddingTop: 10,
        alignContent: "center",
        alignSelf: "center"
      },
      registeredDocuments: {
        fontSize: RFPercentage(3),
        textAlign: "left",
        color: "#1A5276",
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
      },
      showTitle:{
        textAlign: 'center',
        color: '#154360',
        fontWeight: 'bold',
        fontSize: RFPercentage(3),
        width: "100%",
        alignSelf:"center",
        paddingBottom: 20,
      },
      navBarBackHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"white", 
        flexDirection:'row', 
        textAlignVertical: 'center',
        height: 65
      },
      sections: {
        flex: 1,
        backgroundColor:"#FFF",
      },
      resumeView: {
        flex:1,
      },
      documentsCount: {
        backgroundColor: "#1A5276",
        borderRadius: 20,
        color: "white"
      },
      accountingViewShow: {
        flexDirection: 'row',
        textAlign: "center",
        alignSelf: "center",
      },
      mainHeader: {
        padding: 10,
        alignItems: 'center',
        textAlign: "center",
        fontWeight: "bold",
        color: "black",
        fontSize: RFPercentage(3),
        paddingTop: 20
      },
})