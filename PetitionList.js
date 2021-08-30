import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList, BackHandler, ScrollView, Alert } from 'react-native';
import { createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements'

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
          if (value != null) {
            array.push(JSON.parse(value).length)
          } else {
            array.push(0)
          }
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
      await AsyncStorage.setItem("data", JSON.stringify(item))
      await AsyncStorage.setItem("historial", item.titulo)
      this.props.navigation.push("PetitionHistory")
    }

    setData (item, index) {
      return (<TouchableOpacity onPress={() => this.openDocument(item, index)}>
        <Text style={styles.registeredDocuments}>{this.state.lists[index]>0 && <Text style={styles.documentsCount}> {this.state.lists[index]} </Text>} {item.titulo}</Text>
        </TouchableOpacity>)
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
          <Text style={styles.mainHeader}>Seleccione tipo de documento</Text>
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
      <View style={{ width: 60,textAlign:'center' }}>
        <Icon
          name='home'
          type='font-awesome'
          color='#1A5276'
          size={35}
          onPress={() => this.props.navigation.push("Main")}
        />
        </View>
        <View style={{ width: 60,textAlign:'center' }}>
        <Icon
          name='sign-out'
          type='font-awesome'
          color='#1A5276'
          size={35}
          onPress={() => this.logout()}
        />
        </View>
    </View>)
    }

    render () {
      if (!this.state.loaded) return null
      if (this.state.config.length == 0) {
        return (<View style={{flex: 1, backgroundColor:"#FFF" }}>
          <View style={{flex: 1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
            <Text style={styles.showTitle}>No hay documentos de este tipo</Text>
            </View>
            {this.setFootbar()}
        </View>) 
      }
      return (
        <View style={{flex: 1, backgroundColor:"#FFF" }}>
          {this.setMenu()}
          <ScrollView vertical style={{backgroundColor: "#FFF" }}>
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
        </View>
      );
    }
  }
  
  export default createAppContainer(PetitionListScreen);

  const styles = StyleSheet.create({
    voiceControlView: {
        flex: 1,
        backgroundColor: "#FFF",
        paddingTop: 10,
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
        fontSize: 20,
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
        height: 60
      },
      navBarHeader: {
        flex: 1,
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center'
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