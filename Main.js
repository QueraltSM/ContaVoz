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
        userid: "",
        buyList:[],
        salesList:[],
        payList:[]
      }
      this.init()
    }
  
    async init() {
      await AsyncStorage.getItem("fullname").then((value) => {
        this.setState({ fullname: value })
      })
      await AsyncStorage.getItem("userid").then((value) => {
        this.setState({ userid: value})
      })
      await AsyncStorage.getItem(this.state.userid+".buyList").then((value) => {
        if (value != null) {
          this.setState({buyList:JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.userid+".salesList").then((value) => {
        if (value != null) {
          this.setState({salesList:JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.userid+".payList").then((value) => {
        if (value != null) {
          this.setState({payList:JSON.parse(value) })
        }
      })
    }
  
    goBuyScreen = async () => {
      this.props.navigation.push('BuyList')
    }
  
    goSaleScreen = async () => {
      alert("Ventas no se encuentra activo de momento")
      /*var today = new Date()
      var id = "V_"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)+ "-" + ("0" + (today.getHours())).slice(-2)+ ":" + ("0" + (today.getMinutes())).slice(-2)
      await AsyncStorage.setItem('id', id)
      this.props.navigation.push('Sale')*/
    }

    goChargeScreen  = async () => {
      alert("Cobros no se encuentra activo de momento")
      /*var today = new Date()
      var id = "G_"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)+ "-" + ("0" + (today.getHours())).slice(-2)+ ":" + ("0" + (today.getMinutes())).slice(-2)
      await AsyncStorage.setItem('id', id)
      this.props.navigation.push('Pay')*/
    }
  
    goPayScreen = async () => {
      alert("Gastos no se encuentra activo de momento")
      /*var today = new Date()
      var id = "G_"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)+ "-" + ("0" + (today.getHours())).slice(-2)+ ":" + ("0" + (today.getMinutes())).slice(-2)
      await AsyncStorage.setItem('id', id)
      this.props.navigation.push('Pay')*/
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
            <TouchableOpacity onPress={this.goBuyScreen}>
              <View style={styles.mainIcon}>
                <Icon
                  name='shopping-cart'
                  type='font-awesome'
                  color='#FFF'
                  size={35}/>
                </View>
              <Text style={styles.mainButton}>Compras ({this.state.buyList.length})</Text>
            </TouchableOpacity>
            </View>
              <Icon
                name='shopping-cart'
                type='font-awesome'
                color='#FFF'
                size={35}/>
              <View>
              <TouchableOpacity onPress={this.goSaleScreen}>
                <View style={styles.mainIcon}>
                  <Icon
                    name='tag'
                    type='font-awesome'
                    color='#FFF'
                    size={35}/>
                  </View>
                <Text style={styles.mainButton}>Ventas ({this.state.salesList.length})</Text>
              </TouchableOpacity>
              </View>
            </View>
            <View style={styles.twoColumnsInARow}>
            <View>
              <TouchableOpacity onPress={this.goChargeScreen}>
                <View style={styles.mainIcon}>
                  <Icon
                    name='money'
                    type='font-awesome'
                    color='#FFF'
                    size={35}/>
                  </View>
                <Text style={styles.mainButton}>Cobros ({this.state.payList.length})</Text>
              </TouchableOpacity>
              </View>
              <Icon
                name='shopping-cart'
                type='font-awesome'
                color='#FFF'
                size={35}/>
            <TouchableOpacity onPress={this.goPayScreen}>
              <View style={styles.mainIcon}>
                <Icon
                  name='shopping-basket'
                  type='font-awesome'
                  color='#FFF'
                  size={35}/>
                </View>
              <Text style={styles.mainButton}>Gastos ({this.state.payList.length})</Text>
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