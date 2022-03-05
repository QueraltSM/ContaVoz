import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, BackHandler, ScrollView, Alert, SafeAreaView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import { RFPercentage } from "react-native-responsive-fontsize";

class PetitionHistoryScreen extends Component { 

    constructor(props) {
      super(props);
      this.state = {
        type: "",
        petitionType:  "",
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
      await AsyncStorage.getItem(this.state.petitionType + "").then((value) => {
        if (value != null) this.setState({ list: JSON.parse(value) })
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
        id: this.state.idempresa + "-" + this.state.userid + "-" + new Date().getTime(),
        name: this.state.type.substring(0, 1).toUpperCase()+ "_"+ this.state.idempresa+"-"+this.state.userid+"-"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)+ "-" + ("0" + (today.getHours())).slice(-2)+ ":" + ("0" + (today.getMinutes())).slice(-2) + ":" + ("0" + (today.getSeconds())).slice(-2),
        title: ("0" + (today.getDate())).slice(-2)+"/"+("0" + (today.getMonth() + 1)).slice(-2)+"/"+today.getFullYear()+"  " + ("0" + (today.getHours())).slice(-2)+ ":"+("0" + (today.getMinutes())).slice(-2),
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
      var firstEmpty = item.savedData.findIndex(obj => obj.valor == null && obj.solicitado == "S")
      var imagesContent ="darkgray"
      var microContent ="darkgray"
      if (item.images.length > 0) imagesContent = "#56A494"
      if (item.savedData.length > 0 && firstEmpty==-1) microContent = "#56A494"
      return <View style={{ flexDirection: "row", alignItems:"center", justifyContent:"center" }}><Text style={styles.registeredDocuments}>{item.title} </Text><Icon name='image' type='font-awesome' color={imagesContent} size={30} style={{ paddingRight: 15 }} /><Icon name='check' type='font-awesome' color={microContent} size={30} /></View>
    }

    setList() {
      if (this.state.list.length==0) return (<View style={styles.voiceControlView}><Text style={styles.registeredDocuments}>No hay registros</Text></View>)
      return (<View style={styles.voiceControlView}>
        <FlatList vertical showsVerticalScrollIndicator={false}
          data={ this.state.list.sort((a,b) => a.id < b.id) } 
          renderItem={({ item }) => (<TouchableOpacity onPress={() => this.openDocument(item)}>{this.setData(item)}</TouchableOpacity>)}
        />
      </View>)
    }

    setMenu() {
      return(<View style={styles.navBarHeader}>
        <Text style={styles.mainHeader}>Documentos pendientes</Text>
        <Icon name={this.state.icon} type='font-awesome' color='black' size={30} />
      </View>
      )
    }

    setFootbar() {
      return (<View style={styles.navBarBackHeader}>
        <View style={{ width: 100,textAlign:'center' }}>
        <TouchableOpacity onPress={() => this.addPetition()}>
        <Icon
          name='plus'
          type='font-awesome'
          color='#1A5276'
          size={40}
        />
        </TouchableOpacity>
        </View>
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
      if (this.state.userid.length == 0) return null
      return (
        <SafeAreaView style={{flex: 1,backgroundColor:"white"}}>
        <View style={styles.container}>
          {this.setBackButton()}
          {this.setMenu()}
          <ScrollView
            showsVerticalScrollIndicator ={false}
            showsHorizontalScrollIndicator={false}
            persistentScrollbar={false}
            style={{backgroundColor: "#FFF" }}>
            <View style={styles.voiceControlView}>
              {this.setList()}
            </View>
          </ScrollView>   
          {this.setFootbar()}
        </View>
        </SafeAreaView>
      );
    }
  }
  
  export default createAppContainer(PetitionHistoryScreen);

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
        alignSelf: "center",
      },
      registeredDocuments: {
        fontSize: RFPercentage(3),
        textAlign: "center",
        color: "#1A5276",
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
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
        backgroundColor:"#FFF"
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