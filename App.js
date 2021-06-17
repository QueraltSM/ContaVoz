import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert, TextInput} from 'react-native';
import Voice from 'react-native-voice';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Icon, withTheme } from 'react-native-elements'

class BuyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      started: '',
      results: [],
      is_recording: false,
      entity: "",
      date: "",
      invoiceNumber: "",
      total: ""
    };
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart(e) {
      this.setState({
        started: '√',
      });
    };

  onSpeechRecognized(e) {
      this.setState({
        recognized: '√',
      });
    };

  onSpeechResults(e) {
    var res = e.value + ""
    var word = res.split(",")
    if (this.state.entity == "") {
      this.setState({
        entity: word[0],
      });
    } else {
      if (this.state.date == "") {
        this.setState({
          date: word[0],
        });
      } else {
        if (this.state.invoiceNumber == "") {
          this.setState({
            invoiceNumber: word[0],
          });
        } else {
          if (this.state.total == "") {
            this.setState({
              total: word[0],
            });
          }
        }
      } 
    }
  }

  async _startRecognition(e) {
    console.log("_startRecognition")
    this.setState({is_recording: !this.state.is_recording})
    this.setState({
      recognized: '',
      started: '',
      results: [],
    });
    try {
      await Voice.start('es');
    } catch (e) {
      console.error(e);
    }
  }

  async _stopRecognition(e) {
    console.log("_stopRecognition")
    this.setState({is_recording: !this.state.is_recording})
    try {
      await Voice.stop()
    } catch (e) {
      console.error(e);
    }
  }

  _exit() {
    this.props.navigation.push('Main')
  }

  async _continue() {
    console.log("_continue")
  }

  _cancel = async() => {
    const AsyncAlert = () => new Promise((resolve) => {
      Alert.alert(
        "Cancelar",
        "¿Está seguro que desea perder el documento?",
        [
          {
            text: 'Sí',
            onPress: () => {
              resolve(this._exit());
            },
          },
          {
            text: 'No',
            onPress: () => {
              resolve("No");
            },
          },
        ],
        { cancelable: false },
      );
    });
    await AsyncAlert();
  }

  _getImages() {
    console.log("_getImages")
  }

  setMicrophoneIcon() {
    console.log(!this.state.is_recording)
    if (this.state.is_recording) {
      return <Icon
        name='microphone-slash'
        type='font-awesome'
        color='#1A5276'
        size={32}
        onPress={this._stopRecognition.bind(this)}
      />
    }
    return <Icon
      name='microphone'
      type='font-awesome'
      color='#1A5276'
      size={32}
      onPress={this._startRecognition.bind(this)}
    />
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <View style={styles.navBar}><Text style={styles.navBarHeader}>Compra</Text></View>
        <View style={styles.mainView}>
          {this.state.entity == "" &&
          (<View style={styles.section}>
            <Text style={styles.transcript}>Diga su entidad</Text>
          </View>)}
          {this.state.entity != "" &&
            (<View style={styles.section}>
              <Text style={styles.title}>Entidad:</Text>
              <TextInput style={styles.transcript}>{this.state.entity} </TextInput>
            </View>)}
            {this.state.entity != "" && this.state.date == "" &&
          (<View style={styles.section}>
            <Text style={styles.transcript}>Diga la fecha</Text>
          </View>)}
          {this.state.date != "" &&
            (<View style={styles.section}>
              <Text style={styles.title}>Fecha:</Text>
              <TextInput style={styles.transcript}>{this.state.date} </TextInput>
            </View>)}   
            {this.state.date != "" && this.state.invoiceNumber == "" &&
          (<View style={styles.section}>
            <Text style={styles.transcript}>Diga el número de factura</Text>
          </View>)}
          {this.state.invoiceNumber != "" &&
            (<View style={styles.section}>
              <Text style={styles.title}>Número de factura:</Text>
              <TextInput style={styles.transcript}>{this.state.invoiceNumber} </TextInput>
            </View>)} 
            {this.state.invoiceNumber != "" && this.state.total == "" &&
          (<View style={styles.section}>
            <Text style={styles.transcript}>Diga el total</Text>
          </View>)}
          {this.state.total != "" &&
            (<View style={styles.section}>
              <Text style={styles.title}>Total:</Text>
              <TextInput style={styles.transcript}>{this.state.total} </TextInput>
            </View>)} 
        </View>
        <View style={styles.footBar}>
        <Icon
            name='window-close'
            type='font-awesome'
            color='#1A5276'
            size={32}
            onPress={this._cancel}
          />
          <Icon
            name='window-close'
            type='font-awesome'
            color='#FFFFFF'
            size={32}
          />
          <Icon
            name='window-close'
            type='font-awesome'
            color='#FFFFFF'
            size={32}
          />
          {this.setMicrophoneIcon()}
          <Icon
            name='window-close'
            type='font-awesome'
            color='#FFFFFF'
            size={32}
          />
          <Icon
            name='window-close'
            type='font-awesome'
            color='#FFFFFF'
            size={32}
          />
          <Icon
            name='camera'
            type='font-awesome'
            color='#1A5276'
            size={32}
            onPress={this._getImages}
          />
          <Icon
            name='window-close'
            type='font-awesome'
            color='#FFFFFF'
            size={32}
          />
          <Icon
            name='window-close'
            type='font-awesome'
            color='#FFFFFF'
            size={32}
          />
          <Icon
            name='chevron-circle-right'
            type='font-awesome'
            color='#1A5276'
            size={32}
            onPress={this._continue.bind(this)}
          />
        </View>
      </View>
    );
  }
}

class MainScreen extends Component {
  constructor(props) {
    super(props);
  }

  goBuyScreen = () => {
    this.props.navigation.push('Buy')
  }

  goSaleScreen = () => {
    this.props.navigation.push('Sale')
  }

  goPayScreen = () => {
    this.props.navigation.push('Pay')
  }

  render () {
    return (
      <View style={styles.mainView}>
        <View style={styles.navBar}><Text style={styles.navBarHeader}>Contabilidad</Text></View>
        <View style={styles.text}></View>
        <Text style={styles.text}>Seleccione una opción</Text>
        <View style={styles.text}></View>
        <View style={styles.text}> 
        <TouchableOpacity onPress={this.goBuyScreen}>
            <Text style={styles.buyButton}>Compra</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.text}> 
        <TouchableOpacity onPress={this.goSaleScreen}>
            <Text style={styles.saleButton}>Venta</Text>
        </TouchableOpacity> 
        </View>
        <View style={styles.text}>
        <TouchableOpacity onPress={this.goPayScreen}>
            <Text style={styles.payButton}>Pago</Text>
        </TouchableOpacity>  
        </View>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator({
  Main: {
    screen: MainScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  Buy: {
    screen: BuyScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
});
export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  transcript: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20
  },
  navBar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#1A5276", 
    flexDirection:'row', 
    textAlignVertical: 'center',
    height: 50
  },
  mainView: {
    flex: 1,
    backgroundColor:"#fff", 
  },
  footBar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#fff", 
    flexDirection:'row', 
    textAlignVertical: 'center',
    height: 50
  },
  navBarHeader: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20
  },
  playButton: {
    fontSize: 20,
    color: "#1A5276",
    fontWeight: "bold",
    alignSelf: "center",
    paddingTop: 13,
    paddingBottom: 2,
    textTransform: "uppercase"
  },
  stopButton: {
    fontSize: 20,
    color: "#922B21",
    fontWeight: "bold",
    alignSelf: "center",
    paddingTop: 13,
    paddingBottom: 2,
    textTransform: "uppercase"
  },
  text: {
    fontSize: 17,
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 20,
    color: "#000",
  },
  buyButton: {
    fontSize: 17,
    backgroundColor: "#186A3B",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#fff",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    textAlign: "center",
    width: "50%",
    alignSelf: "center",
    borderRadius: 20
  },
  saleButton: {
    fontSize: 17,
    backgroundColor: "#2E86C1",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#fff",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    textAlign: "center",
    width: "50%",
    alignSelf: "center",
    borderRadius: 20
  },
  payButton: {
    fontSize: 17,
    backgroundColor: "#922B21",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#fff",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    textAlign: "center",
    width: "50%",
    alignSelf: "center",
    borderRadius: 20
  },
  title: {
    textAlign: 'center',
    color: '#1B5E8B',
    fontWeight: 'bold',
    fontSize: 20
  },
  section: {
    flexDirection:'row',
    paddingTop: 50,
    justifyContent: "center",
    textAlign: "center"
  }
});