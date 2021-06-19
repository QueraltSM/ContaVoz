import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, FlatList, BackHandler} from 'react-native';
import Voice from 'react-native-voice';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Icon, withTheme } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

class ImageViewerScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      image: this.props.navigation.state.params.image,
      back: this.props.navigation.state.params.back
    }
    this.init()
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  async init() {
    await AsyncStorage.getItem("images").then((value) => {
      if (value != null) {
        this.setState({ images: JSON.parse(value) })
      }
    })
  }

  goBack = () => {
    this.props.navigation.push(this.state.back)
    return true
  }

  _update = () => {

  }

  async delete() {
    var arrayImages = []
    for (let i = 0; i < this.state.images.length; i++) {
      if (this.state.images[i].id != this.state.image.id) {
        arrayImages.push({
          id: this.state.images[i].id,
          uri: this.state.images[i].uri
        })
      } else {
        console.log("deleted was:"+this.state.images[i].id)
      }
    }
    await AsyncStorage.setItem("images", JSON.stringify([]))
    await AsyncStorage.setItem("images", JSON.stringify(arrayImages))
    this.goBack()
  }

  _delete = async() => {
    const AsyncAlert = () => new Promise((resolve) => {
      Alert.alert(
        "Eliminar imagen",
        "¿Está seguro que desea eliminar esta imagen?",
        [
          {
            text: 'Sí',
            onPress: () => {
              resolve(this.delete());
            },
          },
          {
            text: 'No',
            onPress: () => {
              resolve(resolve("No"));
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
        <View style={styles.imagesSection}>
          <Image
            source={{
              uri: this.state.image.uri.replace(/['"]+/g, '')
            }}
            resizeMode="contain"
            key={this.state.image}
            style={{ width: "100%", height: "100%" }}
          />
      </View>
        <View style={styles.footBar}>
          <Icon
              name='edit'
              type='font-awesome'
              color='#1A5276'
              size={35}
              onPress={this._update}
            />
            <Icon
              name='plus'
              type='font-awesome'
              color='#FFF'
              size={40}
            />
            <Icon
              name='trash'
              type='font-awesome'
              color='#1A5276'
              size={35}
              onPress={this._delete}
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
      id: "",
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

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  goBack = () => {
    this.props.navigation.push('Main')
    return true
  }

  async init() {
    await AsyncStorage.getItem("images").then((value) => {
      if (value != null) {
        this.setState({ images: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("id").then((value) => {
      if (value != null) {
        this.setState({ id: value })
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
        arrayImages.push({
          id: this.state.id+"_"+(this.state.images.length+1),
          uri: uri
        })
        this.setState({images: arrayImages})
        this.saveInMemory("images", JSON.stringify(arrayImages))
        this.saveInMemory("isBuyDoc", JSON.stringify(true))
      }
    })
  }

  async saveInMemory(key, value) {
    await AsyncStorage.setItem(key, value)
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
        arrayImages.push({
          id: this.state.id+"_"+(this.state.images.length+1),
          uri: uri
        })
        this.setState({images: arrayImages})
        this.saveInMemory("images", JSON.stringify(arrayImages))
        this.saveInMemory("isBuyDoc", JSON.stringify(true))
      }
    })
  }

  seeImage(image) {
    this.props.navigation.push('ImageViewer', {
      image: image,
      back: "Buy"
    })
  }

  async delete() {
    this.setState({id: ""})
    this.setState({recognized: ""})
    this.setState({started: ""})
    this.setState({results: ""})
    this.setState({is_recording: false})
    this.setState({entity: ""})
    this.setState({date: ""})
    this.setState({invoiceNumber: ""})
    this.setState({total: ""})
    this.setState({getEntity: false})
    this.setState({setEntity: false})
    this.setState({getDate: false})
    this.setState({setDate: false})
    this.setState({getInvoiceNumber: false})
    this.setState({setInvoiceNumber: false})
    this.setState({getTotal: false})
    this.setState({setTotal: false})
    this.setState({finalView: false})
    this.setState({started: false})
    this.setState({startVoice: false})
    this.setState({images: []})
    this.saveInMemory("images", JSON.stringify([]))
    this.saveInMemory("isBuyDoc", JSON.stringify(false))
    this.props.navigation.push('Main')
  }

   _delete = async () => {
    const AsyncAlert = () => new Promise((resolve) => {
    Alert.alert(
      "Eliminar documento",
      "¿Está seguro que desea eliminar permanentemente este documento?",
      [
        {
          text: 'Sí',
          onPress: () => {
            resolve(this.delete());
          },
        },
        {
          text: 'No',
          onPress: () => {
            resolve(resolve("No"));
          },
        },
      ],
      { cancelable: false },
    );
    });
    await AsyncAlert();
  }

  setMenu() {
    return(
      <View style={styles.navBar}>
      <Icon
          name='times'
          type='font-awesome'
          color='#FFFFFF'
          size={32}
          onPress={this._delete}
        />
        <Icon
          name='window-close'
          type='font-awesome'
          color='#1A5276'
          size={32}
        /> 
        <Icon
          name='window-close'
          type='font-awesome'
          color='#1A5276'
          size={32}
        />  
        <Icon
          name='window-close'
          type='font-awesome'
          color='#1A5276'
          size={32}
        />
        <Text style={styles.navBarHeader}>Compra</Text>
        <Icon
          name='window-close'
          type='font-awesome'
          color='#1A5276'
          size={32}
        /> 
        <Icon
          name='window-close'
          type='font-awesome'
          color='#1A5276'
          size={32}
        />  
        <Icon
          name='window-close'
          type='font-awesome'
          color='#1A5276'
          size={32}
        />        
        <Icon
        name='arrow-circle-right'
        type='font-awesome'
        color='#FFFFFF'
        size={32}
        onPress={this.takePhoto}
      />
      </View>
    )
  }
  render () {
    return (
      <View style={{flex: 1}}>
        {this.setMenu()}
        <View style={styles.mainView}>
        {this.state.images.length == 0 && 
          (<View style={styles.imagesSection}>
              <Text style={styles.text}>No hay imágenes adjuntadas</Text>
          </View>)
        }
        {this.state.images.length > 0 && 
        (<View style={styles.imagesSection}>
            <FlatList 
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.images}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => this.seeImage(item)}>
                  <Image
                        source={{
                          uri:item.uri.replace(/['"]+/g, ''),
                        }}
                        resizeMethod="resize"
                        key={item}
                        style={{
                          width:260,
                          height:300,
                          borderWidth:2,
                          borderColor:'#1B5E8B',
                          resizeMode:'contain',
                          margin:8
                        }}
                      />
                </TouchableOpacity>
              )}
          />
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
    this.state = {
      isBuyDoc: false
    }
    this.init()
  }

  async init() {
    await AsyncStorage.getItem("isBuyDoc").then((value) => {
      if (value != null) {
        this.setState({ isBuyDoc: JSON.parse(value) })
      }
    })
  }

  goBuyScreen = async () => {
    var today = new Date()
    var id = "C_"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)+ " " + ("0" + (today.getHours())).slice(-2)+ ":" + ("0" + (today.getMinutes())).slice(-2)
    await AsyncStorage.setItem('id', id)
    this.props.navigation.push('Buy')
  }

  goSaleScreen = async () => {
    var today = new Date()
    var id = "V_"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)+ " " + ("0" + (today.getHours())).slice(-2)+ ":" + ("0" + (today.getMinutes())).slice(-2)
    await AsyncStorage.setItem('id', id)
    this.props.navigation.push('Sale')
  }

  goPayScreen = async () => {
    var today = new Date()
    var id = "P_"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)+ " " + ("0" + (today.getHours())).slice(-2)+ ":" + ("0" + (today.getMinutes())).slice(-2)
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
        {this.state.isBuyDoc && 
          (<TouchableOpacity onPress={this.goBuyScreen}>
            <Text style={styles.buyButton}>Seguir compra</Text>
          </TouchableOpacity>)
        }
        {!this.state.isBuyDoc && 
          (<TouchableOpacity onPress={this.goBuyScreen}>
            <Text style={styles.buyButton}>Compra</Text>
          </TouchableOpacity>)
        }
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

export class DocImage {
  constructor(id, uri) {
    this.id = id;
    this.uri = uri;
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
  ImageViewer: {
    screen: ImageViewerScreen,
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