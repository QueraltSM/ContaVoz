import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Linking } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import { RFPercentage } from "react-native-responsive-fontsize";

class MainScreen extends Component {

    constructor(props) {
      super(props);
      this.state = {
        fullname: "",
        enterpriseid: "",
        userid: "",
      }
      this.init()
    }
  
    async init() {
      await AsyncStorage.getItem("fullname").then((value) => {
        this.setState({ fullname: value })
      })
      await AsyncStorage.getItem("idempresa").then((value) => {
        this.setState({ enterpriseid: value})
      })
      await AsyncStorage.getItem("userid").then((value) => {
        this.setState({ userid: value})
      })
    }

    async nextSegue(icon, allTypeConfigs, type) {
      await AsyncStorage.setItem("icon", icon)
      await AsyncStorage.setItem("config", JSON.stringify(allTypeConfigs))
      await AsyncStorage.setItem("type", type)
      this.props.navigation.push('PetitionList')
    }

    goScreen = async (type, icon) => {
      var config = ""
      var allTypeConfigs = []
      await AsyncStorage.getItem("allConfigs").then((value) => {
        config = JSON.parse(JSON.stringify(value))
      })
      if (config != "null") {
        var array = JSON.parse(config)
        array.forEach(i => {
          if (i.tipo == type) allTypeConfigs.push(i)
        });
        if (allTypeConfigs.length==0) await this.showAlert("Atención", "No hay configuraciones existentes para " + type)
        else this.nextSegue(icon, allTypeConfigs, type)
      } else {
        allTypeConfigs = []
        await this.showAlert("Atención", "No hay configuraciones existentes para " + type)
      }
    }

      
    async showAlert (title, message) {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          title,
          message,
          [
            {
              text: 'Ok',
              onPress: () => {
                resolve();
              },
            },
          ],
          { cancelable: false },
        );
        });
      await AsyncAlert();
    }
  
    async goDictionary() {
      var config="null"
      await AsyncStorage.getItem("allConfigs").then((value) => {
        config = JSON.parse(JSON.stringify(value))
      })
      if (config == "null") {
        this.showAlert("Error", "Contacte con el departamento contable para que crearle una configuración y vuelva a iniciar sesión")
      } else {
        this.props.navigation.push('DictionaryView')
      }
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
  
    logout = async () => {
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

    setOptions() {
      return (<View style={{ flex:1, paddingTop: 10 }}>
        <View style={styles.twoColumnsInARow}>
        <View style={styles.oneRow}>
          <TouchableOpacity onPress={() => this.goScreen("compra", "shopping-cart")}>
            <View style={styles.mainIcon}>
              <Icon
                name='shopping-cart'
                type='font-awesome'
                color='#FFF'
                size={35}/>
              </View>
            <Text style={styles.mainButton}>Compras</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.oneRow}>
            <TouchableOpacity onPress={() => this.goScreen("venta", "tag")}>
              <View style={styles.mainIcon}>
                <Icon
                  name='tag'
                  type='font-awesome'
                  color='#FFF'
                  size={35}/>
                </View>
              <Text style={styles.mainButton}>Ventas</Text>
            </TouchableOpacity>
            </View>
          </View>
          <View style={styles.twoColumnsInARow}>
          <View style={styles.oneRow}>
          <TouchableOpacity onPress={() => this.goScreen("pago", "money")}>
            <View style={styles.mainIcon}>
              <Icon
                name='money'
                type='font-awesome'
                color='#FFF'
                size={35}/>
              </View>
            <Text style={styles.mainButton}>Pagos</Text>
          </TouchableOpacity>
        </View>
          <View style={styles.oneRow}>
          <TouchableOpacity onPress={() => this.goScreen("cobro", "shopping-basket")}>
              <View style={styles.mainIcon}>
                <Icon
                  name='shopping-basket'
                  type='font-awesome'
                  color='#FFF'
                  size={35}/>
                </View>
              <Text style={styles.mainButton}>Cobros</Text>
            </TouchableOpacity>
            </View>
        </View>
        <View style={styles.twoColumnsInARow}>
        <View style={styles.oneRow}>
          <TouchableOpacity onPress={() => this.goDictionary()}>
            <View style={styles.mainIcon}>
              <Icon
                name='list'
                type='font-awesome'
                color='#FFF'
                size={35}/>
              </View>
            <Text style={styles.mainButton}>Entidades</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.oneRow}>
          <TouchableOpacity onPress={this.logout}>
            <View style={styles.mainIcon}>
              <Icon
                name='sign-out'
                type='font-awesome'
                color='#FFF'
                size={35}/>
              </View>
            <Text style={styles.mainButton}>Salir</Text>
          </TouchableOpacity>
          </View>
        </View>
        </View>)
    }
  
    async openDisoftWeb() {
      await Linking.openURL("https://disoft.es")
    }

    render () {
      if (this.state.fullname.length == 0) return null
      return (
        <View style={styles.container}>
        <View style={styles.mainView}> 
          <View style={styles.accountingView}>
          <Icon
            name='calculator'
            type='font-awesome'
            color='black'
            size={35}/>
          </View>
          <Text style={styles.mainHeader}>Contabilizando a</Text>
          <Text style={styles.mainHeader}>{this.state.fullname}</Text>
          {this.setOptions()}
          <TouchableOpacity onPress={() => this.openDisoftWeb()}>
            <Text style={styles.mainSubHeader}>© Disoft Servicios Informáticos S.L. {new Date().getFullYear()}</Text>
          </TouchableOpacity>
        </View></View>);
    }
  }

  export default createAppContainer(MainScreen);
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop:"15%",
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mainView: {
      flex: 1,
      backgroundColor:"#FFF",
      alignContent:"center",
    },
    accountingView: {
      flexDirection: 'row',
      textAlign: "center",
      alignSelf: "center",
    },
    twoColumnsInARow: {
      paddingTop: 20,
      flexDirection: 'row',
      alignSelf: "center",
    },
    oneRow: {
      width:"40%"
    },
    mainButton: {
      fontSize: RFPercentage(2.5),
      textAlign: "center",
      color: "#000",
      paddingTop: 10,
      paddingBottom: 10,
      fontWeight: 'bold',
    },
    mainIcon: {
      backgroundColor: "#1A5276",
      alignSelf: "center",
      paddingTop: 10,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 10,
      borderRadius: 10
    },
    mainHeader: {
      paddingTop: 10,
      alignItems: 'center',
      textAlign: "center",
      fontWeight: "bold",
      color: "#000",
      fontSize: RFPercentage(4),
    },
    mainSubHeader: {
      paddingBottom: 20,
      alignItems: 'center',
      textAlign: "center",
      fontWeight: "bold",
      color: "#1A5276",
      fontSize: RFPercentage(2)
    }
  });