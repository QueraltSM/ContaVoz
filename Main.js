import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';

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
  
    async saveData(responseJson, type) {
      var config = JSON.parse(JSON.stringify(responseJson.configuraciones))
      await AsyncStorage.setItem("config", JSON.stringify(config))
      await AsyncStorage.setItem("type", type)
      this.props.navigation.push('PetitionList')
    }

    goScreen = async (type) => {
      if (type == "compras") {
        alert("Compras está desactivada temporalmente")
      } else {
        const requestOptions = {
          method: 'POST',
          body: JSON.stringify({ idempresa:this.state.enterpriseid, id: this.state.userid, tipoconfig: type })
        };
        fetch('https://app.dicloud.es/pruebaqueralt.asp', requestOptions)
        .then((response) => response.json())
        .then((responseJson) => {
          var error = JSON.parse(JSON.stringify(responseJson.error))
          if (error == "false") {
            this.saveData(responseJson, type)
          }
        }).catch((error) => {});
      }
    }
  
    goDictionary = () => {
      this.props.navigation.push('DictionaryView')
    }
  
    saveLogout =  async (state) => {
      if (!state) {
        await AsyncStorage.setItem("saveData", JSON.stringify(false));
        await AsyncStorage.setItem("alias", "");
        await AsyncStorage.setItem("user", "");
        await AsyncStorage.setItem("pass", "");
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
  
    render () {
      return (
        <View style={styles.mainView}> 
          <View style={styles.accountingView}>
          <Icon
            name='calculator'
            type='font-awesome'
            color='#154360'
            size={35}/>
          </View>
          <Text style={styles.mainHeader}>Contabilidad</Text>
          <Text style={styles.text}>Usuario {this.state.fullname}</Text>
          <View style={styles.twoColumnsInARow}>
          <View>
            <TouchableOpacity onPress={() => this.goScreen("compras")}>
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
              <Icon
                name='shopping-cart'
                type='font-awesome'
                color='#FFF'
                size={35}/>
              <View>
              <TouchableOpacity onPress={() => this.goScreen("ventas")}>
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
            <View>
            <TouchableOpacity onPress={() => this.goScreen("cobros")}>
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
              <Icon
                name='shopping-cart'
                type='font-awesome'
                color='#FFF'
                size={35}/>
            <TouchableOpacity onPress={() => this.goScreen("pagos")}>
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
          <View style={styles.twoColumnsInARow}>
          <View>
            <TouchableOpacity onPress={this.goDictionary}>
              <View style={styles.mainIcon}>
                <Icon
                  name='book'
                  type='font-awesome'
                  color='#FFF'
                  size={35}/>
                </View>
              <Text style={styles.mainButton}>Diccionario</Text>
            </TouchableOpacity>
            </View>
            <Icon
                name='shopping-cart'
                type='font-awesome'
                color='#FFF'
                size={35}/>
            <View>
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
        </View>);
    }
  }

  export default createAppContainer(MainScreen);
  
  const styles = StyleSheet.create({
    mainView: {
      flex: 1,
      backgroundColor:"#FFF",
      paddingTop: 30,
    },
    accountingView: {
      flexDirection: 'row',
      textAlign: "center",
      alignSelf: "center",
      paddingTop: 50,
      paddingBottom: 15
    },
    text: {
      fontSize: 17,
      textAlign: "center",
      paddingTop: 20,
      paddingBottom: 20,
      color: "#000",
    },
    twoColumnsInARow: {
      paddingTop: 30,
      paddingBottom: 20,
      flexDirection: 'row',
      alignSelf: "center",
    },
    mainButton: {
      fontSize: 17,
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
      paddingTop: 20,
      alignItems: 'center',
      textAlign: "center",
      fontWeight: "bold",
      color: "#000",
      fontSize: 25,
    },
  });