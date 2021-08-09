import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList, BackHandler, ScrollView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';

class PetitionHistoryScreen extends Component { 

    constructor(props) {
      super(props);
      this.state = {
        type: "",
        petitionType:  "",
        config: "",
        idempresa: "",
        userid: "",
        list: [],
        history: ""
      }
      this.init()
    }
  
    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }
  
    goBack = () => {
      this.props.navigation.push("PetitionList")
      return true
    }
  
    async init() {
        await AsyncStorage.getItem("type").then((value) => {
          this.setState({ type: value })
        })
        await AsyncStorage.getItem("petitionType").then((value) => {
          this.setState({ petitionType: value })
        })
        await AsyncStorage.getItem("historial").then((value) => {
          this.setState({ history: value.toLowerCase() })
        })
        await AsyncStorage.getItem(this.state.petitionType).then((value) => {
            if (value != null) {
                this.setState({ list: JSON.parse(value) })
            }
        })
        await AsyncStorage.getItem("idempresa").then((value) => {
          this.setState({ idempresa: value })
        })
        await AsyncStorage.getItem("userid").then((value) => {
          this.setState({ userid: value })
        })
    }
  
    addPetition = async () => {
      var array = this.state.list
      var today = new Date()
      var document = {
        id: this.state.type + "_"+ this.state.idempresa+"-"+this.state.userid+"-"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)+ "-" + ("0" + (today.getHours())).slice(-2)+ ":" + ("0" + (today.getMinutes())).slice(-2) + ":" + ("0" + (today.getSeconds())).slice(-2),
        name: ("0" + (today.getDate())).slice(-2)+"/"+("0" + (today.getMonth() + 1)).slice(-2)+"/"+today.getFullYear()+" a las " + ("0" + (today.getHours())).slice(-2)+ ":"+("0" + (today.getMinutes())).slice(-2)+ ":" + ("0" + (today.getSeconds())).slice(-2),
        time: new Date().getTime()
      }
      array.push(document)
      await AsyncStorage.setItem(this.state.petitionType, JSON.stringify(array))
      this.openDocument(document)
    }
  
    async openDocument(item) {
      await AsyncStorage.setItem("petitionID", JSON.stringify(item))
      this.props.navigation.push("Petition")
   
    }
  
    setList() {
      if (this.state.list.length > 0) {
        return (
          <View style={styles.voiceControlView}>
            <FlatList 
              vertical
              showsVerticalScrollIndicator={false}
              data={ this.state.list.sort((a,b) => a.time < b.time) } 
              renderItem={({ item }) => (
                (<TouchableOpacity onPress={() => this.openDocument(item)}>
                    <Text style={styles.registeredDocuments}>{item.name}</Text>
                  </TouchableOpacity>
                ) 
              )}
          />
        </View>)
      }
      return (<View style={styles.voiceControlView}><Text style={styles.registeredDocuments}>No hay registros</Text></View>)
    }
  
    render () {
      return (
        <View style={{flex: 1, backgroundColor:"#FFF" }}>
          <View style={styles.navBarBackHeader}>
          <View style={{ width: 70, textAlign:'center' }}>
              <Icon
                name='trash'
                type='font-awesome'
                color='#1A5276'
                size={30}
              />
            </View>
            <Text style={styles.navBarHeader}>Todos los {this.state.history}</Text>
            <View style={{ width: 70,textAlign:'center' }}>
              <Icon
                name='plus'
                type='font-awesome'
                color='#FFF'
                size={30}
                onPress={this.addPetition}
              />
            </View>
          </View>
          <ScrollView style={{backgroundColor: "#FFF" }}>
          <View style={styles.sections}>
            {this.setList()}
          </View>
          </ScrollView>   
        </View>
      );
    }
  }
  
  export default createAppContainer(PetitionHistoryScreen);

  const styles = StyleSheet.create({
    voiceControlView: {
        flex: 1,
        backgroundColor: "#FFF",
        paddingTop: 40,
        alignContent: "center",
        alignSelf: "center",
        width: "90%",
      },
      registeredDocuments: {
        fontSize: 19,
        textAlign: "center",
        paddingTop: 20,
        color: "#1A5276",
        fontWeight: 'bold',
        paddingBottom: 15
      },
      showTitle:{
        textAlign: 'center',
        color: '#154360',
        fontWeight: 'bold',
        fontSize: 18,
        width: "90%",
        paddingBottom: 20,
      },
      navBarBackHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#1A5276", 
        flexDirection:'row', 
        textAlignVertical: 'center',
        padding: 10
      },
      navBarHeader: {
        flex: 1,
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
      },
      sections: {
        flex: 1,
        backgroundColor:"#FFF",
      },
      resumeView: {
        paddingTop: 30,
        paddingLeft: 40,
        backgroundColor: "#FFF",
        paddingBottom: 100
      },
})