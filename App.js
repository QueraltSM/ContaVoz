import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image} from 'react-native';
import Voice from 'react-native-voice';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Icon, withTheme } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

class ImagesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      images: []
    }
    //this.init(); // get images from native storage
  }

  addImage = async () => {
    const AsyncAlert = () => new Promise((resolve) => {
      Alert.alert(
        "Subir foto",
        "¿Qué desea hacer?",
        [
          {
            text: 'Cerrar',
            onPress: () => {
              resolve(resolve("No"));
            },
          },
          {
            text: 'Tomar foto',
            onPress: () => {
              resolve(this.takePhoto());
            },
          },
          {
            text: 'Ir a galería',
            onPress: () => {
              resolve(this.goGallery());
            },
          },
        ],
        { cancelable: false },
      );
    });
    await AsyncAlert();
  }

  async takePhoto() {
    let options = {
      title: 'Hacer una foto',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, (response) => {
      if (response.didCancel || response.error || response.customButton) {
        console.log('Something happened');
      } else {
        var arrayImages = this.state.images
        var uri = JSON.stringify(response.assets[0]["uri"])
        arrayImages.push(uri)
        this.setState({images: arrayImages})
      }
    })
  }

  getImages = () => {
    let imgs = []
    for (let i = 0; i < this.state.images.length; i++) {
      imgs.push(<Image
      source={{
        uri: this.state.images[i].replace(/['"]+/g, ''),
      }}
      resizeMethod="contain"
      key={this.state.images[i]}
      style={{ width: 100, height: 100,  borderWidth: 2, borderColor: '#1A5276', textAlign: "center"}}
    />)
    }
    return imgs
  }

  render () {
    return (
      <View style={styles.mainView}>
        <View style={styles.navBar}><Text style={styles.navBarHeader}>Imágenes adjuntadas</Text></View>
        {this.state.images.length == 0 && 
        (<View style={styles.section}>
        <Text style={styles.title}>No hay ninguna aún</Text>
      </View>)}
      {this.state.images.length > 0 && 
        (<View style={styles.imagesSection}>
        {this.getImages()}
      </View>)}
      <View style={styles.footBar}>
        <Icon
            name='plus'
            type='font-awesome'
            color='#1A5276'
            size={40}
            onPress={this.addImage}
          />
        </View>
      </View>
    );
  }
}

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
      total: "",
      getEntity: false,
      setEntity: false,
      getDate: false,
      setDate: false,
      getInvoiceNumber: false,
      setInvoiceNumber: false,
      getTotal: false,
      setTotal: false,
      finalView: false,
      started: false,
      startVoice: false,
      images: []
    };
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    this.init()
  }

  async init() {
    await AsyncStorage.getItem("images").then((value) => {
      if (value != null) {
        console.log("images="+JSON.parse(value))
        this.setState({ images: JSON.parse(value) })
        //this.setState({ images: [] }) //CLEAN
      }
    })
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
      this.setState({getEntity: true})
    } else {
      if (this.state.date == "") {
        this.setState({
          date: word[0],
        });
        this.setState({getDate: true})
      } else {
        if (this.state.invoiceNumber == "") {
          this.setState({
            invoiceNumber: word[0],
          });
          this.setState({getInvoiceNumber: true})
        } else {
          if (this.state.total == "") {
            this.setState({
              total: word[0],
            });
            this.setState({getTotal: true})
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
    this.props.navigation.push('Main')
    /*const AsyncAlert = () => new Promise((resolve) => {
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
    await AsyncAlert();*/
  }

  _getImages = () => {
    this.props.navigation.push('Images')
  }

  setMicrophoneIcon() {
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

  setEntity = () => {
    this.setState({setEntity: true})
  }

  setDate = () => {
    this.setState({setDate: true})
  }

  setInvoiceNumber = () => {
    this.setState({setInvoiceNumber: true})
  }

  setTotal = () => {
    this.setState({setTotal: true})
    this.setState({finalView: true})
  }

   takePhoto = async() =>{
    let options = {
      title: 'Hacer una foto',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, (response) => {
      if (response.didCancel || response.error || response.customButton) {
        console.log('Something happened');
      } else {
        var arrayImages = this.state.images
        var uri = JSON.stringify(response.assets[0]["uri"])
        arrayImages.push(uri)
        this.setState({images: arrayImages})
        this.saveInMemory("images", JSON.stringify(arrayImages))
      }
    })
  }

  async saveInMemory(key, value) {
    await AsyncStorage.setItem(key, value)
  }

  setImages = () => {
    let imgs = []
    for (let i = 0; i < this.state.images.length; i++) {
      imgs.push(<Image
      source={{
        uri: this.state.images[i].replace(/['"]+/g, ''),
      }}
      resizeMethod="resize"
      key={this.state.images[i]}
      style={{ width: '80%', height: '80%',  borderWidth: 2, borderColor: '#1A5276', textAlign: "center"}}
    />)
    }
    return imgs
  }

  goGallery = async() =>{
    let options = {
      title: 'Foto desde la galería',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.error || response.customButton) {
        console.log('Something happened');
      } else {
        var arrayImages = this.state.images
        var uri = JSON.stringify(response.assets[0]["uri"])
        arrayImages.push(uri)
        this.setState({images: arrayImages})
        this.saveInMemory("images", JSON.stringify(arrayImages))
      }
    })
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <View style={styles.navBar}><Text style={styles.navBarHeader}>Compra</Text></View>
        <View style={styles.mainView}>
        {this.state.images.length > 0 && 
        (<View style={styles.imagesSection}>
        {this.setImages()}
      </View>)}
          {this.state.startVoice && !this.state.getEntity &&
          (<View style={styles.section}>
            <Text style={styles.title}>Diga su entidad</Text>
          </View>)}
          {this.state.getEntity && !this.state.setEntity  &&
            (<View style={styles.section}>
              <Text style={styles.title}>Entidad</Text>
              <Text style={styles.text}>Texto escuchado:</Text><Text style={styles.transcript}>{this.state.entity}</Text>
              <Text style={styles.text}>Texto interpretado:</Text><TextInput style={styles.changeTranscript}>{this.state.entity} </TextInput>
              <Text style={styles.transcript}>¿Qué desea hacer ahora?</Text>
              <Icon
                name='window-close'
                type='font-awesome'
                color='#1A5276'
                size={32}
                onPress={this._cancel}
              />
              <Icon
                name='arrow-circle-right'
                type='font-awesome'
                color='#1A5276'
                size={32}
                onPress={this.setEntity}
              />
            </View>)}
            {this.state.setEntity && !this.state.getDate &&
            (<View style={styles.section}>
              <Text style={styles.title}>Diga la fecha</Text>
            </View>)}
            {this.state.getDate && !this.state.setDate  &&
              (<View style={styles.section}>
                <Text style={styles.title}>Fecha</Text>
                <Text style={styles.text}>Texto escuchado:</Text><Text style={styles.transcript}>{this.state.date}</Text>
                <Text style={styles.text}>Texto interpretado:</Text><TextInput style={styles.changeTranscript}>{this.state.date} </TextInput>
                <Text style={styles.transcript}>¿Qué desea hacer ahora?</Text>
                <Icon
                  name='window-close'
                  type='font-awesome'
                  color='#1A5276'
                  size={32}
                  onPress={this._cancel}
                />
                <Icon
                  name='arrow-circle-right'
                  type='font-awesome'
                  color='#1A5276'
                  size={32}
                  onPress={this.setDate}
                />
              </View>)} 
                {this.state.setDate && !this.state.getInvoiceNumber &&
                (<View style={styles.section}>
                  <Text style={styles.title}>Diga el número de factura</Text>
                </View>)}
                  {this.state.getInvoiceNumber && !this.state.setInvoiceNumber  &&
                  (<View style={styles.section}>
                    <Text style={styles.title}>Número de factura</Text>
                    <Text style={styles.text}>Texto escuchado:</Text><Text style={styles.transcript}>{this.state.invoiceNumber}</Text>
                    <Text style={styles.text}>Texto interpretado:</Text><TextInput style={styles.changeTranscript}>{this.state.invoiceNumber} </TextInput>
                    <Text style={styles.transcript}>¿Qué desea hacer ahora?</Text>
                    <Icon
                      name='window-close'
                      type='font-awesome'
                      color='#1A5276'
                      size={32}
                      onPress={this._cancel}
                    />
                    <Icon
                      name='arrow-circle-right'
                      type='font-awesome'
                      color='#1A5276'
                      size={32}
                      onPress={this.setInvoiceNumber}
                    />
                  </View>)} 
                  {this.state.setInvoiceNumber && !this.state.getTotal &&
                (<View style={styles.section}>
                  <Text style={styles.title}>Diga el total</Text>
                </View>)}
                  {this.state.getTotal && !this.state.setTotal  &&
                  (<View style={styles.section}>
                    <Text style={styles.title}>Total</Text>
                    <Text style={styles.text}>Texto escuchado:</Text><Text style={styles.transcript}>{this.state.invoiceNumber}</Text>
                    <Text style={styles.text}>Texto interpretado:</Text><TextInput style={styles.changeTranscript}>{this.state.invoiceNumber} </TextInput>
                    <Text style={styles.transcript}>¿Qué desea hacer ahora?</Text>
                    <Icon
                      name='window-close'
                      type='font-awesome'
                      color='#1A5276'
                      size={32}
                      onPress={this._cancel}
                    />
                    <Icon
                      name='arrow-circle-right'
                      type='font-awesome'
                      color='#1A5276'
                      size={32}
                      onPress={this.setTotal}
                    />
              </View>)} 
        </View>
        <View style={styles.footBar}>
          <Icon
            name='camera'
            type='font-awesome'
            color='#1A5276'
            size={32}
            onPress={this.takePhoto}
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
            name='image'
            type='font-awesome'
            color='#1A5276'
            size={32}
            onPress={this.goGallery}
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

  goBuyScreen = async () => {
    var today = new Date()
    var id = "C_"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)
    await AsyncStorage.setItem('id', id)
    this.props.navigation.push('Buy')
  }

  goSaleScreen = async () => {
    var today = new Date()
    var id = "V_"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)
    await AsyncStorage.setItem('id', id)
    this.props.navigation.push('Sale')
  }

  goPayScreen = async () => {
    var today = new Date()
    var id = "P_"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)
    await AsyncStorage.setItem('id', id)
    this.props.navigation.push('Pay')
  }

  goHelp = () => {
    this.props.navigation.push('Help')
  }

  render () {
    return (
      <View style={styles.mainView}>
        <View style={styles.navBar}><Text style={styles.navBarHeader}>Contabilidad</Text></View>
        <View style={styles.text}></View>
        <View style={styles.mainView}>
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
        <View style={styles.footBar}>
        <Icon
            name='question-circle'
            type='font-awesome'
            color='#1A5276'
            size={40}
            onPress={this.goHelp}
          />
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
  Images: {
    screen: ImagesScreen,
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
  changeTranscript: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
    fontStyle: 'italic'
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
    fontSize: 25
  },
  section: {
    paddingTop: 50,
    justifyContent: "center",
    textAlign: "center",
    flex: 1
  },
  imagesSection: {
    flex: 1,
    alignItems: 'center',
    textAlign: "center",
  }
});