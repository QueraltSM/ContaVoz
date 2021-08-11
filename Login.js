import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, TextInput } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';

class LoginScreen extends Component {  
    constructor(props) {
      super(props);
      this.state = { 
        company: "", 
        user: "",
        password: "",
        token: "",
        fullname: "",
        idempresa: "",
        userID: "",
        userid: "",
        hidePassword: true 
      }
      this.init()
    }
  
    async init () {
      await AsyncStorage.getItem("company").then((value) => {
        if (value != null) {
          this.setState({ company: value })
        }
      })
      await AsyncStorage.getItem("user").then((value) => {
        if (value != null) {
          this.setState({ user: value })
        }
      })
      await AsyncStorage.getItem("password").then((value) => {
        if (value != null) {
          this.setState({ password: value })
        }
      })
    }
  
    showAlert = (message) => {
      Alert.alert(
        "Error",
        message,
        [
          {
            text: "Ok",
            style: "cancel"
          },
        ],
        { cancelable: false }
      );
    }
  
    handleError = (error_code) => {
      var error = ""
      switch(error_code) {
        case "1":
          error = "Compañía incorrecta"
          break;
        case "2":
          error = "Usuario o contraseña incorrectas"
          break;
        case "3":
          error = "Este usuario se encuentra desactivado"
          break;
        case "4":
          error = "Ha habido algún problema en la comunicación"
          break;
        case "5":
          error = "No hay conexión a internet"
          break;
        default:
          error = "Error desconocido"
      }
      this.showAlert(error);
    }
  
  
    async saveUser() {
      await AsyncStorage.setItem('isUserLoggedIn', JSON.stringify(true));
      this.getConfig()
      this.goHome()
    }

    async saveConfig(i,config) {
      await AsyncStorage.setItem(i, JSON.stringify(config))
    }

    async getConfig() {
      var petition = ["ventas", "pagos", "cobros"]
      petition.forEach((i)=> {
        const requestOptions = {
          method: 'POST',
          body: JSON.stringify({ idempresa:this.state.idempresa, id: this.state.userid, tipoconfig: i })
        };
        fetch('https://app.dicloud.es/pruebaqueralt.asp', requestOptions)
        .then((response) => response.json())
        .then((responseJson) => {
          var error = JSON.parse(JSON.stringify(responseJson.error))
          if (error == "false") {
            this.saveConfig(i,JSON.stringify(responseJson.configuraciones))
          }
        }).catch((error) => {});
      })
    }
  
    async goHome() {
      await AsyncStorage.setItem('company', this.state.company);
      await AsyncStorage.setItem('user', this.state.user);
      await AsyncStorage.setItem('password', this.state.password);
      await AsyncStorage.setItem('fullname', this.state.fullname);
      await AsyncStorage.setItem('idempresa',  this.state.idempresa + "");
      await AsyncStorage.setItem('token',  this.state.token);
      await AsyncStorage.setItem('userid',  this.state.userid + "");
      this.props.navigation.push('Main')
    }
  
    login = async () => {
      if (this.state.company != undefined && this.state.user != undefined && this.state.password != undefined) {
        const requestOptions = {
          method: 'POST',
          body: JSON.stringify({aliasDb: this.state.company, user: this.state.user, password: this.state.password, appSource: "Disoft"})
        };
        fetch('https://app.dicloud.es/login.asp', requestOptions)
          .then((response) => response.json())
          .then((responseJson) => {
            let error = JSON.stringify(responseJson.error_code)
            console.log(JSON.stringify(responseJson))
            if (error == 0) {
              this.setState({fullname: JSON.parse(JSON.stringify(responseJson.fullName))})
              this.setState({token: JSON.parse(JSON.stringify(responseJson.token))})
              this.setState({idempresa: JSON.parse(JSON.stringify(responseJson.idempresa))})
              this.setState({userid: JSON.parse(JSON.stringify(responseJson.id))})
              this.saveUser()
            } else {
              this.handleError(error)
            }
          }).catch(() => {});
      } else {
        this.showAlert("Complete todos los campos")
      }
    }
  
    managePasswordVisibility = () => {
      this.setState({ hidePassword: !this.state.hidePassword });
    }
    
    render() {
      return (
        <View style={ styles.container }>
          <View style={{paddingBottom: 20}}>
          <Image
            style={{ height: 100, width: 100, margin: 10}}
            source={require('./assets/main.png')}
          />
          </View>
          <TextInput  blurOnSubmit={true} style = { styles.textBox } placeholder="Compañía"  onChangeText={(company) => this.setState({company})}  value={this.state.company} /> 
          <TextInput  blurOnSubmit={true} style = { styles.textBox } placeholder="Usuario" onChangeText={(user) => this.setState({user})}  value={this.state.user}/> 
          <View style = { styles.textBoxBtnHolder }>
            <TextInput blurOnSubmit={true} style = { styles.textBox } placeholder="Contraseña" secureTextEntry = { this.state.hidePassword } onChangeText={(password) => this.setState({password})} value={this.state.password}/>  
            <TouchableOpacity activeOpacity = { 0.8 } style = { styles.visibilityBtn } onPress = { this.managePasswordVisibility }>
              {this.state.hidePassword &&
              (<Icon
              name='eye'
              type='font-awesome'
              color='#98A406'
              size={31}
            />)}
            {!this.state.hidePassword &&
              (<Icon
              name='eye-slash'
              type='font-awesome'
              color='#98A406'
              size={31}
            />)}    
            </TouchableOpacity>   
          </View>  
          <View style={{paddingTop: 20}}>
          <TouchableOpacity onPress={this.login} style={styles.appButtonContainer}>
            <Text style={styles.appButtonText}>Entrar</Text>
          </TouchableOpacity>  
          </View>
        </View>
      );
    } 
  }

export default createAppContainer(LoginScreen);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textBox: {
      fontSize: 18,
      alignSelf: 'stretch',
      height: 45,
      paddingLeft: 8,
      color:"black",
      borderWidth: 2,
      paddingVertical: 0,
      borderColor: '#98A406',
      borderRadius: 0,
      margin: 10,
      borderRadius: 20,
      textAlign: "center"
    },
    textBoxBtnHolder:{
      position: 'relative',
      alignSelf: 'stretch',
      justifyContent: 'center'
    },
    visibilityBtn: {
      position: 'absolute',
      right: 20,
      height: 40,
      width: 35,
      padding: 2
    },
    appButtonText: {
      fontSize: 15,
      color: "#fff",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
    },
    appButtonContainer: {
      elevation: 8,
      backgroundColor: "#98A406",
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 12,
      width: 150,
      margin: 20 
    },
})
  