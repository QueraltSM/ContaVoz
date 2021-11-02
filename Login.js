import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, TextInput, BackHandler } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { RFPercentage } from "react-native-responsive-fontsize";

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
        hidePassword: true,
        errorMessage: "",
        error: -1,
        wifi: true
      }
      this.init()
    }
  
    async init () {
      await AsyncStorage.getItem("company").then((value) => {
        if (value != null) this.setState({ company: value })
      })
      await AsyncStorage.getItem("user").then((value) => {
        if (value != null) this.setState({ user: value })
      })
      await AsyncStorage.getItem("password").then((value) => {
        if (value != null) this.setState({ password: value })
      })
      NetInfo.addEventListener(networkState => {
        this.setState({ wifi: networkState.isConnected })
      })
    }

    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }
  
    goBack = () => {
      return true
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
      this.setState({errorMessage: "Error al iniciar sesión:\n" + error })
    }
  
    async saveUser() {
      await AsyncStorage.setItem('isUserLoggedIn', JSON.stringify(true));
      this.getConfig()
    }

    async saveConfig(config) {
      await this.setState({errorMessage: "" })
      await AsyncStorage.setItem("allConfigs", JSON.stringify(config))
      this.goHome()
    }

    async getConfig() {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ company_padisoft:this.state.idempresa, idcliente: this.state.userid, tipopeticion: "seleccionar", tipo:"todo"})
      };
      fetch('https://app.dicloud.es/trataconvozapp.asp', requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        var configs=JSON.stringify(responseJson.configuraciones)
        if (configs == "null") {
          this.saveConfig(responseJson.configuraciones)
        } else {
          var error = JSON.parse(JSON.stringify(JSON.parse(configs)[0].error))
          if (error=="false") this.saveConfig(responseJson.configuraciones)
          else this.setState({errorMessage: "Algo salió mal, disculpe las molestias" })
        }
      }).catch((error) => {});
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
      await NetInfo.addEventListener(networkState => {
        if (networkState.isConnected && this.state.error<0) {
          this.setState({ error: 0 })
          if (this.state.company.length>0 && this.state.user.length>0 && this.state.password.length>0) {
            const requestOptions = {
              method: 'POST',
              body: JSON.stringify({aliasDb: this.state.company, user: this.state.user, password: this.state.password, appSource: "Disoft"})
            };
            fetch('https://app.dicloud.es/login.asp', requestOptions)
              .then((response) => response.json())
              .then((responseJson) => {
                this.setState({ error: JSON.stringify(responseJson.error_code) })
                if (this.state.error == 0) {
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
            this.setState({errorMessage: "Complete todos los campos" })
          }
        } else {
          this.setState({errorMessage: "No tiene conexión a Internet" })
        }
      })
    }
  
    managePasswordVisibility = () => {
      this.setState({ hidePassword: !this.state.hidePassword });
    }

    setFootbar(){
      return <View style={styles.footerView}>
          <View style={{paddingRight: 10}}>
            <Image
              source={require('./assets/gob-canarias.png')}
              resizeMode="contain"
              key="assets/canarias-avanza-con-europa"
              style={{ width: 100, height: 100}}/> 
          </View> 
          <View style={{paddingRight: 10}}>
            <Image
              source={require('./assets/union-europea.jpg')}
              resizeMode="contain"
              key="assets/canarias-avanza-con-europa"
              style={{ width: 100, height: 100}}/> 
          </View>
          <View style={{paddingRight: 10}}>
            <Image
              source={require('./assets/canarias-avanza-con-europa.png')}
              resizeMode="contain"
              key="assets/canarias-avanza-con-europa"
              style={{ width: 100, height: 100}}/> 
          </View> 
      </View>
    }
    
    render() {
      return (
        <View style={ styles.container }>            
          <View style={{paddingBottom: 20, alignSelf:"center"}}>
          <Image
            style={{ height: 100, width: 100, margin: 10}}
            source={require('./assets/main.png')}
          />
          </View>
          <TextInput placeholderTextColor="darkgray" blurOnSubmit={true} style = { styles.textBox } placeholder="Compañía"  onChangeText={(company) => this.setState({company})}  value={this.state.company} /> 
          <TextInput placeholderTextColor="darkgray" blurOnSubmit={true} style = { styles.textBox } placeholder="Usuario" onChangeText={(user) => this.setState({user})}  value={this.state.user}/> 
          <View style = { styles.textBoxBtnHolder }>
            <TextInput placeholderTextColor="darkgray" blurOnSubmit={true} style = { styles.textBox } placeholder="Contraseña" secureTextEntry = { this.state.hidePassword } onChangeText={(password) => this.setState({password})} value={this.state.password}/>  
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
          {this.state.wifi && <View style={{alignSelf:"center"}}>
            <TouchableOpacity onPress={() => this.login()} style={styles.appButtonContainer}>
              <Text style={styles.appButtonText}>Entrar</Text>
            </TouchableOpacity>  
          </View>}
          {!this.state.wifi && <Text style={styles.wifiText}>Para iniciar sesión debe tener Internet</Text>}
          <View style={{flex: 1, paddingTop:20}}><Text style={styles.errorText}>{this.state.errorMessage}</Text></View>
          {this.setFootbar()}
        </View>
      );
    } 
  }

export default createAppContainer(LoginScreen);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      paddingTop: 50,
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
      width:"100%",
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
      backgroundColor: "#98A406",
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 12,
      width: 150,
      margin: 20 
    },
    footerView: {
      flex: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:"white", 
      flexDirection:'row', 
    },
    errorText: {
      paddingTop: 20,
      textAlign: 'center',
      color: '#922B21',
      fontWeight: 'bold',
      fontSize: RFPercentage(2.5),
      width: "100%",
    },
    wifiText: {
      textAlign:"center",
      color: '#154360',
      fontSize: RFPercentage(2.5),
      width: "100%",
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 50,
      fontWeight: 'bold',
    }
})