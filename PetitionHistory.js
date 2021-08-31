import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, BackHandler, ScrollView } from 'react-native';
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
        icon: ""
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
      await AsyncStorage.getItem("icon").then((value) => {
        this.setState({ icon: value })
      })
      await AsyncStorage.getItem("type").then((value) => {
        this.setState({ type: value })
      })
      await AsyncStorage.getItem("petitionType").then((value) => {
        this.setState({ petitionType: value })
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
        id: new Date().getTime(),
        name: this.state.type.substring(0, 1).toUpperCase()+ "_"+ this.state.idempresa+"-"+this.state.userid+"-"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)+ "-" + ("0" + (today.getHours())).slice(-2)+ ":" + ("0" + (today.getMinutes())).slice(-2) + ":" + ("0" + (today.getSeconds())).slice(-2),
        title: ("0" + (today.getDate())).slice(-2)+"/"+("0" + (today.getMonth() + 1)).slice(-2)+"/"+today.getFullYear()+"  " + ("0" + (today.getHours())).slice(-2)+ ":"+("0" + (today.getMinutes())).slice(-2) + "  ",
        images: [],
        savedData: []
      }
      array.push(document)
      await AsyncStorage.setItem(this.state.petitionType, JSON.stringify(array))
      this.openDocument(document)
    }
  
    async openDocument(item) {
      await AsyncStorage.setItem("petitionID", JSON.stringify(item))
      this.props.navigation.push("Petition")
    }

    setData (item) {
      var lastSaved = item.savedData.findIndex(obj => obj.valor == null)
      var imagesContent ="lightgray"
      var microContent ="lightgray"
      if (item.images.length > 0) {
        imagesContent = "#56A494"
      }
      if (item.savedData.length > 0 && lastSaved==-1) {
        microContent = "#56A494"
      }
      return <View style={{ flexDirection: "row", alignItems:"center", justifyContent:"center" }}><Text style={styles.registeredDocuments}>{item.title} </Text><Icon name='image' type='font-awesome' color={imagesContent} size={25} style={{ paddingRight: 15 }} /><Icon name='check' type='font-awesome' color={microContent} size={25} /></View>
    }

    setList() {
      if (this.state.list.length > 0) {
        return (
          <View style={styles.voiceControlView}>
            <FlatList 
              vertical
              showsVerticalScrollIndicator={false}
              data={ this.state.list.sort((a,b) => a.id < b.id) } 
              renderItem={({ item }) => 
              (<TouchableOpacity onPress={() => this.openDocument(item)}>{this.setData(item)}</TouchableOpacity>)}
            />
          </View>)
        }
      return (<View style={styles.voiceControlView}><Text style={styles.registeredDocuments}>No ha registrado documentos</Text></View>)
    }
  
    setMenu() {
      return(
        <View style={{backgroundColor:"#FFF"}}>
          <View style={styles.accountingViewShow}>
          <Icon
              name={this.state.icon}
              type='font-awesome'
              color='#000'
              size={45}
            />
            </View>
          <Text style={styles.mainHeader}>Documentos pendientes</Text>
        </View>)
    }

    setFootbar() {
      return (<View style={styles.navBarBackHeader}>
        <View style={{ width: 60,textAlign:'center' }}>
        <TouchableOpacity onPress={() => this.addPetition()}>
        <Icon
          name='plus'
          type='font-awesome'
          color='#1A5276'
          size={35}
        />
        </TouchableOpacity>
        </View>
      <View style={{ width: 60,textAlign:'center' }}>
      <TouchableOpacity onPress={() => this.props.navigation.push("Main")}>
        <Icon
          name='home'
          type='font-awesome'
          color='#1A5276'
          size={35}
        />
        </TouchableOpacity>
        </View>
        <View style={{ width: 60,textAlign:'center' }}>
        <TouchableOpacity onPress={() => this.logout()}>
        <Icon
          name='sign-out'
          type='font-awesome'
          color='#1A5276'
          size={35}
        />
        </TouchableOpacity>
        </View>
    </View>)
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
    
    render () {
      if (this.state.userid.length == 0) return null
      return (
        <View style={{flex: 1, backgroundColor:"#FFF" }}>
          {this.setMenu()}
          <ScrollView style={{backgroundColor: "#FFF" }}>
          <View style={styles.sections}>
            {this.setList()}
          </View>
          </ScrollView>   
          {this.setFootbar()}
        </View>
      );
    }
  }
  
  export default createAppContainer(PetitionHistoryScreen);

  const styles = StyleSheet.create({
      voiceControlView: {
        flex: 1,
        backgroundColor: "#FFF",
        alignContent: "center",
        alignSelf: "center",
        width: "100%",
      },
      registeredDocuments: {
        fontSize: 20,
        textAlign: "center",
        paddingTop: 20,
        color: "#1A5276",
        fontWeight: 'bold',
        paddingBottom: 15,
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
        backgroundColor:"white", 
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
        backgroundColor:"#FFF"
      },
      resumeView: {
        paddingTop: 30,
        paddingLeft: 40,
        backgroundColor: "#FFF",
        paddingBottom: 100
      },
      accountingViewShow: {
        flexDirection: 'row',
        textAlign: "center",
        alignSelf: "center",
        paddingTop: 30,
      },
      mainHeader: {
        paddingTop: 20,
        alignItems: 'center',
        textAlign: "center",
        fontWeight: "bold",
        color: "#000",
        fontSize: 20,
        paddingBottom: 20
      },
})