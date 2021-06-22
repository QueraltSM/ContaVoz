import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, FlatList, BackHandler, ScrollView} from 'react-native';
import Voice from 'react-native-voice';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Icon, withTheme } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

class ResumeViewScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: "",
      entity: "",
      date: "",
      invoiceNumber: "",
      total: "",
      continue: true,
      images: [],
      type: this.props.navigation.state.params.type,
      back: this.props.navigation.state.params.back,
    };
    this.init()
  }

  async init() {
    await AsyncStorage.getItem("entity").then((value) => {
      if (value != null) {
        this.setState({ entity: value })
      }
    })
    await AsyncStorage.getItem("date").then((value) => {
      if (value != null) {
        this.setState({ date: value })
      }
    })
    await AsyncStorage.getItem("invoiceNumber").then((value) => {
      if (value != null) {
        this.setState({ invoiceNumber: value })
      }
    })
    await AsyncStorage.getItem("total").then((value) => {
      if (value != null) {
        this.setState({ total: value })
      }
    })
    await AsyncStorage.getItem("images").then((value) => {
      if (value != null) {
        this.setState({ images: JSON.parse(value) })
      }
    })
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  goBack = () => {
    this.props.navigation.push(this.state.back)
    return true
  }

  setMenu() {
    return(
      <View style={styles.menuView}>
        <Text style={styles.mainHeader}>Resumen de la {this.state.type}</Text>
      </View>
    )
  }

  setImages() {
    if (this.state.images.length > 0) {
      return (
        <View style={styles.imagesSection}>
          <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            data={this.state.images}
            renderItem={({ item }) => (
              <Image
                source={{uri:item.uri.replace(/['"]+/g, '')}}
                key={item}
                style={{width:300,height:400}}
              />
          )}
        />
        </View>
      )
    }
    return null
  }

  sendDocument() {

  }

  setControlVoice(){
    if (this.state.entity.length>0) {
      return(
        <View style={styles.resumeView}>
          <Text style={styles.mainButtonText}>Edite el documento si lo desea</Text>
          <Text style={styles.resumeText}>Entidad</Text>
          <TextInput multiline={true} style={styles.changeTranscript}>{this.state.entity}</TextInput>
          <Text style={styles.resumeText}>Fecha</Text>
          <TextInput multiline={true} style={styles.changeTranscript}>{this.state.date}</TextInput>
          <Text style={styles.resumeText}>Número de factura</Text>
          <TextInput multiline={true} style={styles.changeTranscript}>{this.state.invoiceNumber}</TextInput>
          <Text style={styles.resumeText}>Total</Text>
          <TextInput multiline={true} style={styles.changeTranscript}>{this.state.total}</TextInput>
        </View>
      )
    } 
    return null
  }

  render () {
    return (
      <View style={{flex: 1}}>
        {this.setMenu()}
        <ScrollView>
        <View style={styles.sections}>
        {this.setImages()}
        {this.setControlVoice()}
        </View>
        </ScrollView>
        <View style={styles.sendBar}>
          <TouchableOpacity onPress={this.sendDocument}><Text style={styles.saveText}>Enviar documento</Text></TouchableOpacity>
        </View>
      </View>
    );
  }
}

class ImageViewerScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      image: this.props.navigation.state.params.image,
      back: this.props.navigation.state.params.back,
      id: ""
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
    await AsyncStorage.getItem("id").then((value) => {
      if (value != null) {
        this.setState({ id: value })
      }
    })
  }

  goBack = () => {
    this.props.navigation.push(this.state.back)
    return true
  }

  async saveInMemory(key, value) {
    await AsyncStorage.setItem(key, value)
  }

  updateImage = async(uri) => {
    var arrayImages = []
    for (let i = 0; i < this.state.images.length; i++) {
      if (this.state.images[i].id != this.state.image.id) {
        arrayImages.push({
          id: this.state.images[i].id,
          uri: this.state.images[i].uri
        })
      } else {
        var newImage = {
          id: this.state.image.id,
          uri: uri
        }
        arrayImages.push(newImage)
        this.setState({image: newImage})
      }
    }
    this.setState({images: arrayImages})
    await AsyncStorage.setItem("images", JSON.stringify([]))
    await AsyncStorage.setItem("images", JSON.stringify(arrayImages))
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
        var uri = JSON.stringify(response.assets[0]["uri"])
        this.updateImage(uri)
      }
    })
  }

  goGallery = async () => {
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
        var uri = JSON.stringify(response.assets[0]["uri"])
        this.updateImage(uri)
      }
    })
  }

  async delete() {
    var arrayImages = []
    for (let i = 0; i < this.state.images.length; i++) {
      if (this.state.images[i].id != this.state.image.id) {
        arrayImages.push({
          id: this.state.id + "_" + parseInt(this.state.images.length - 1),
          uri: this.state.images[i].uri
        })
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
      <View style={styles.imageView}>
        <View style={styles.selectedImageView}>
          <Image
            source={{
              uri: this.state.image.uri.replace(/['"]+/g, '')
            }}
            resizeMode="center"
            key={this.state.image}
            style={{ width: "100%", height: "100%" }}
          />
      </View>
        <View style={styles.darkFootBar}>
          <Icon
              name='camera'
              type='font-awesome'
              color='#FFF'
              size={32}
              onPress={this.takePhoto}
            />
            <Icon
              name='plus'
              type='font-awesome'
              color='#000'
              size={40}
            />
            <Icon
              name='plus'
              type='font-awesome'
              color='#000'
              size={40}
            />
            <Icon
              name='image'
              type='font-awesome'
              color='#FFF'
              size={35}
              onPress={this.goGallery}
            />
            <Icon
              name='plus'
              type='font-awesome'
              color='#000'
              size={40}
            />
            <Icon
              name='plus'
              type='font-awesome'
              color='#000'
              size={40}
            />
            <Icon
              name='trash'
              type='font-awesome'
              color='#FFF'
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
      started: false,
      startVoice: false,
      continue: true,
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
    await AsyncStorage.getItem("entity").then((value) => {
      if (value != null) {
        this.setState({ entity: value })
      }
    })
    await AsyncStorage.getItem("date").then((value) => {
      if (value != null) {
        this.setState({ date: value })
      }
    })
    await AsyncStorage.getItem("invoiceNumber").then((value) => {
      if (value != null) {
        this.setState({ invoiceNumber: value })
      }
    })
    await AsyncStorage.getItem("total").then((value) => {
      if (value != null) {
        this.setState({ total: value })
      }
    })
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
    this.setState({continue: false})
  }

  async _startRecognition(e) {
    this.setState({is_recording: JSON.stringify(true)})
    this.setState({startVoice: JSON.stringify(true)})
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
    this.setState({is_recording: JSON.stringify(false)})
    this.setState({continue: JSON.stringify(false)})
    try {
      await Voice.stop()
    } catch (e) {
      console.error(e);
    }
  }

  _exit() {
    this.props.navigation.push('Main')
  }

  _continue = () => {
    this.setState({continue: JSON.stringify(true)})
  }

  _cancel = async() => {
    this.props.navigation.push('Main')
  }

  _getImages = () => {
    this.props.navigation.push('Images')
  }

  setMicrophoneIcon() {
    if (JSON.parse(this.state.continue) && JSON.parse(this.state.is_recording)) {
      return <Icon
        name='microphone-slash'
        type='font-awesome'
        color='#FFF'
        size={32}
        onPress={this._stopRecognition.bind(this)}
      />
    }
    return <Icon
      name='microphone'
      type='font-awesome'
      color='#FFF'
      size={32}
      onPress={this._startRecognition.bind(this)}
    />
  }

  setEntity = () => {
    this.setState({setEntity: true})
    this.saveInMemory("isBuy", JSON.stringify(true))
    this.saveInMemory("entity", this.state.entity)
    this._continue()
  }

  setDate = () => {
    this.setState({setDate: true})
    this.saveInMemory("date", this.state.date)
    this._continue()
  }

  setInvoiceNumber = () => {
    this.setState({setInvoiceNumber: true})
    this.saveInMemory("invoiceNumber", this.state.invoiceNumber)
    this._continue()
  }

  setTotal = () => {
    this.setState({setTotal: true})
    this.saveInMemory("total", this.state.total)
    this.askFinish()
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
        this.saveInMemory("isBuy", JSON.stringify(true))
        this.saveInMemory("images", JSON.stringify(arrayImages))
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
        this.saveInMemory("isBuy", JSON.stringify(true))
        this.saveInMemory("images", JSON.stringify(arrayImages))
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
    await AsyncStorage.setItem("entity", "")
    await AsyncStorage.setItem("date", "")
    await AsyncStorage.setItem("invoiceNumber", "")
    await AsyncStorage.setItem("total", "")
    await AsyncStorage.setItem("images", JSON.stringify([]))
    await AsyncStorage.setItem("isBuy", JSON.stringify(false))
    this.props.navigation.push('Main')
  }

  goResumeView() {
    this.props.navigation.push('ResumeView', {
      type: "compra",
      back: "Buy"
    })
  }

    askFinish = async () => {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "Enviar documento",
          "¿Está seguro que desea enviar este documento?",
          [
            {
              text: 'Sí',
              onPress: () => {
                resolve(this.goResumeView());
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

    _finish = async () => {
      if (this.state.images.length > 0 || JSON.parse(this.state.total)) {
        this.askFinish()
      } else {
        this.showAlert("Finalizar el proceso", "Tiene que adjuntar al menos una imagen del documento o utilizar el control por voz")
      }
    }

    showAlert = (title, message) => {
      Alert.alert(
        title,
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

  setEmptyView() {
    if (this.state.entity.length>0) {
      return(<View style={styles.imagesSection}></View>)
    }
    return (<View></View>)
  }

  setMenuButtons() {
    if (this.state.images.length > 0 || this.state.entity.length>0) {
      return(
        <View style={styles.navBarButtons}>
          <TouchableOpacity onPress={this._delete}>
            <Text style={styles.exitText}>Eliminar</Text>
          </TouchableOpacity>
        <Icon
          name='window-close'
          type='font-awesome'
          color='#FFF'
          size={32}
        />
        <Icon
          name='window-close'
          type='font-awesome'
          color='#FFF'
          size={32}
        />
        <TouchableOpacity onPress={this._finish}>
          <Text style={styles.saveText}>Finalizar</Text>
        </TouchableOpacity>
        </View>
      )}
    return null
  }

  setMenu() {
    return(
      <View style={styles.menuViewShort}>
        <View style={styles.accountingViewShow}>
        <Icon
            name='shopping-cart'
            type='font-awesome'
            color='#000'
            size={45}
          />
          </View>
        <Text style={styles.mainHeader}>Contabilidad para compra</Text>
      </View>
    )
  }

  setImages() {
    if (this.state.images.length > 0) {
      return (
        <View style={styles.imagesSection}>
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
                      key={item}
                      style={{
                        width:300,
                        height:400,
                      }}
                    />
                  </TouchableOpacity>
                )}
            />
        </View>
      )
    }
    return null
  }

  setEntityVoiceControl() {
    if (this.state.started.length>0 && this.state.entity.length == 0) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Escuchando entidad...</Text>
      </View>)
    }
    if (JSON.parse(this.state.getEntity) && !JSON.parse(this.state.setEntity)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Resultados para entidad</Text>
        <Text style={styles.resultsText}>Texto escuchado: <Text style={styles.transcript}>{this.state.entity}</Text></Text>
        <Text style={styles.resultsText}>Texto interpretado: <Text style={styles.transcript}>{this.state.entity} </Text></Text>
        <View style={styles.navBarButtons}>
        <TouchableOpacity onPress={this._cancel}>
        <Text style={styles.exitButton}>Cancelar</Text>
          </TouchableOpacity>
          <Icon
          name='window-close'
          type='font-awesome'
          color='#FFF'
          size={32}
          />
          <Text style={styles.transcript}></Text>
          <TouchableOpacity onPress={this.setEntity}>
            <Text style={styles.saveButton}>Continuar</Text>
          </TouchableOpacity>
        </View>
        </View>)
    } 
    return null
  }

  setDateVoiceControl() {
    if (JSON.parse(this.state.continue) && this.state.date.length==0 && this.state.entity.length>0 && !JSON.parse(this.state.getDate)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Escuchando fecha...</Text>
      </View>)
    }
    if (JSON.parse(this.state.getDate) && !JSON.parse(this.state.setDate)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Resultados para fecha</Text>
        <Text style={styles.resultsText}>Texto escuchado: <Text style={styles.transcript}>{this.state.date}</Text></Text>
        <Text style={styles.resultsText}>Texto interpretado: <Text style={styles.transcript}>{this.state.date} </Text></Text>
        <Text style={styles.transcript}></Text>
        <View style={styles.navBarButtons}>
        <TouchableOpacity onPress={this._cancel}>
            <Text style={styles.exitButton}>Cancelar</Text>
          </TouchableOpacity>
          <Icon
          name='window-close'
          type='font-awesome'
          color='#FFF'
          size={32}
          />
          <Text style={styles.transcript}></Text>
          <TouchableOpacity onPress={this.setDate}>
            <Text style={styles.saveButton}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>)
    } 
    return null
  }

  setInvoiceNumberVoiceControl() {
    if (JSON.parse(this.state.continue) && this.state.invoiceNumber.length==0 && this.state.date.length>0 && !JSON.parse(this.state.getInvoiceNumber)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Escuchando número de factura...</Text>
      </View>)
    }
    if (JSON.parse(this.state.getInvoiceNumber) && !JSON.parse(this.state.setInvoiceNumber)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Resultados para factura</Text>
        <Text style={styles.text}>Texto escuchado:</Text><Text style={styles.transcript}>{this.state.invoiceNumber}</Text>
        <Text style={styles.text}>Texto interpretado:</Text><Text style={styles.transcript}>{this.state.invoiceNumber} </Text>
        <Text style={styles.transcript}></Text>
        <View style={styles.navBarButtons}>
        <TouchableOpacity onPress={this._cancel}>
            <Text style={styles.exitButton}>Cancelar</Text>
          </TouchableOpacity>
          <Icon
          name='window-close'
          type='font-awesome'
          color='#FFF'
          size={32}
          />
          <Text style={styles.transcript}></Text>
          <TouchableOpacity onPress={this.setInvoiceNumber}>
            <Text style={styles.saveButton}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>)
    } 
    return null
  }

  setTotalVoiceControl() {
    if (JSON.parse(this.state.continue) && this.state.total.length==0 && this.state.invoiceNumber.length>0 && !JSON.parse(this.state.getTotal)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Escuchando total...</Text>
      </View>)
    }
    if (this.state.total.length>0) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Resultados para el total</Text>
        <Text style={styles.text}>Texto escuchado:</Text><Text style={styles.transcript}>{this.state.total}</Text>
        <Text style={styles.text}>Texto interpretado:</Text><Text style={styles.transcript}>{this.state.total} </Text>
        <Text style={styles.transcript}></Text>
        <View style={styles.navBarButtons}>
        <TouchableOpacity onPress={this._cancel}>
            <Text style={styles.exitButton}>Cancelar</Text>
          </TouchableOpacity>
          <Icon
          name='window-close'
          type='font-awesome'
          color='#FFF'
          size={32}
          />
          <Text style={styles.transcript}></Text>
          <TouchableOpacity onPress={this.setTotal}>
            <Text style={styles.saveButton}>Ver resumen</Text>
          </TouchableOpacity>
        </View>
      </View>)
    } 
    return null
  }

  render () {
    return (
      <View style={{flex: 1}}>
        {this.setMenu()}
        <ScrollView style={{backgroundColor: "#fff"}}>
        <View style={styles.sections}>
          {this.setImages()}
          {this.setEntityVoiceControl()}
          {this.setDateVoiceControl()}
          {this.setInvoiceNumberVoiceControl()}
          {this.setTotalVoiceControl()}
          {this.setEmptyView()}
          {this.setMenuButtons()}
        </View>
        </ScrollView>
        <View style={styles.footBar}>
          <View style={styles.cameraIcon}>
          <Icon
            name='camera'
            type='font-awesome'
            color='#FFF'
            size={32}
            onPress={this.takePhoto}
          />
          </View>
          <Icon
            name='window-close'
            type='font-awesome'
            color='#FFF'
            size={32}
          />
          <View style={styles.microIcon}>
            {this.setMicrophoneIcon()}
          </View>
           <Icon
            name='window-close'
            type='font-awesome'
            color='#FFF'
            size={32}
          />
          <View style={styles.galleryIcon}>
          <Icon
            name='image'
            type='font-awesome'
            color='#FFF'
            size={32}
            onPress={this.goGallery}
          />
          </View>
        </View>
      </View>
    );
  }
}

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBuy: false,
      isSale: false,
      isPay: false
    }
    this.init()
  }

  async init() {
    await AsyncStorage.getItem("isBuy").then((value) => {
      if (value != null) {
        this.setState({ isBuy: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("isSale").then((value) => {
      if (value != null) {
        this.setState({ isSale: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("isPay").then((value) => {
      if (value != null) {
        this.setState({ isPay: JSON.parse(value) })
      }
    })
  }

  goBuyScreen = async () => {
    var today = new Date()
    var id = "C_"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)+ "-" + ("0" + (today.getHours())).slice(-2)+ ":" + ("0" + (today.getMinutes())).slice(-2)
    await AsyncStorage.setItem('id', id)
    this.props.navigation.push('Buy')
  }

  goSaleScreen = async () => {
    alert("Venta no se encuentra activo de momento")
    /*var today = new Date()
    var id = "V_"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)+ "-" + ("0" + (today.getHours())).slice(-2)+ ":" + ("0" + (today.getMinutes())).slice(-2)
    await AsyncStorage.setItem('id', id)
    this.props.navigation.push('Sale')*/
  }

  goPayScreen = async () => {
    alert("Pago no se encuentra activo de momento")
    /*var today = new Date()
    var id = "P_"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)+ "-" + ("0" + (today.getHours())).slice(-2)+ ":" + ("0" + (today.getMinutes())).slice(-2)
    await AsyncStorage.setItem('id', id)
    this.props.navigation.push('Pay')*/
  }

  goHelp = () => {
    alert("Ayuda no se encuentra activo de momento")
    //this.props.navigation.push('Help')
  }

  render () {
    return (
      <View style={styles.mainView}> 
        <View style={styles.accountingView}>
        <Icon
            name='balance-scale'
            type='font-awesome'
            color='#000'
            size={45}
          />
          </View>
        <Text style={styles.mainHeader}>Contabilidad inteligente</Text>
        <Text style={styles.text}>Seleccione tipo de documento</Text>
        <View style={styles.twoColumnsInARow}>
        {this.state.isBuy && 
          (<View>
          <TouchableOpacity onPress={this.goBuyScreen}>
            <View style={styles.mainIcon}>
              <Icon
                name='shopping-cart'
                type='font-awesome'
                color='#FFF'
                size={40}
              />
              </View>
            <Text style={styles.mainButton}>Seguir compra</Text>
          </TouchableOpacity>
          </View>)}
        {!this.state.isBuy && 
          (<View>
            <TouchableOpacity onPress={this.goBuyScreen}>
              <View style={styles.mainIcon}>
                <Icon
                  name='shopping-cart'
                  type='font-awesome'
                  color='#FFF'
                  size={40}
                />
                </View>
              <Text style={styles.mainButton}>Compra</Text>
            </TouchableOpacity>
            </View>)}
            <Icon
                name='shopping-cart'
                type='font-awesome'
                color='#FFF'
                size={40}
              />
        {this.state.isSale && 
          (<View>
          <TouchableOpacity onPress={this.goSaleScreen}>
            <View style={styles.mainIcon}>
              <Icon
                name='shopping-cart'
                type='font-awesome'
                color='#FFF'
                size={40}
              />
              </View>
            <Text style={styles.mainButton}>Seguir venta</Text>
          </TouchableOpacity>
          </View>)}
        {!this.state.isSale && 
          (<View>
            <TouchableOpacity onPress={this.goSaleScreen}>
              <View style={styles.mainIcon}>
                <Icon
                  name='tags'
                  type='font-awesome'
                  color='#FFF'
                  size={40}
                />
                </View>
              <Text style={styles.mainButton}>Venta</Text>
            </TouchableOpacity>
            </View>)}
          </View>
          <View style={styles.twoColumnsInARow}>
        {this.state.isPay && 
          (<View>
          <TouchableOpacity onPress={this.goPayScreen}>
            <View style={styles.mainIcon}>
              <Icon
                name='tags'
                type='font-awesome'
                color='#FFF'
                size={40}
              />
              </View>
            <Text style={styles.mainButton}>Seguir pago</Text>
          </TouchableOpacity>
          </View>)}
        {!this.state.isPay && 
          (<View>
            <TouchableOpacity onPress={this.goPayScreen}>
              <View style={styles.mainIcon}>
                <Icon
                  name='money'
                  type='font-awesome'
                  color='#FFF'
                  size={40}
                />
                </View>
              <Text style={styles.mainButton}>Pago</Text>
            </TouchableOpacity>
            </View>)}
            <Icon
                name='money'
                type='font-awesome'
                color='#FFF'
                size={40}
              />
          <TouchableOpacity onPress={this.goHelp}>
            <View style={styles.mainIcon}>
              <Icon
                name='info'
                type='font-awesome'
                color='#FFF'
                size={40}
              />
              </View>
            <Text style={styles.mainButton}>Ayuda</Text>
          </TouchableOpacity>
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
  ResumeView: {
    screen: ResumeViewScreen,
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
    color: '#000',
    fontSize: 20,
    fontStyle: 'italic',
    width: "90%"
  },
  navBar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#000", 
    flexDirection:'row', 
    textAlignVertical: 'center',
    height: 50
  },
  navBarButtons: {
    backgroundColor:"#FFF", 
    paddingTop: 20,
    paddingBottom: 50,
    flexDirection:'row',
    alignSelf: 'center',
  },
  mainView: {
    flex: 1,
    backgroundColor:"#FFF",
    paddingTop: 30,
  },
  menuView: {
    backgroundColor:"#FFF",
    paddingTop: 30,
    paddingBottom: 40,
  },
  menuViewShort: {
    backgroundColor:"#FFF",
    paddingTop: 10,
    paddingBottom: 40,
  },
  sections: {
    flex: 1,
    backgroundColor:"#FFF",
  },
  imageView: {
    flex: 1,
    backgroundColor:"#000",
    paddingTop: 30,
  },
  accountingView: {
    flexDirection: 'row',
    textAlign: "center",
    alignSelf: "center",
    paddingTop: 50,
    paddingBottom: 15
  },
  accountingViewShow: {
    flexDirection: 'row',
    textAlign: "center",
    alignSelf: "center",
    paddingTop: 30,
  },
  footBar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#FFF", 
    flexDirection:'row', 
    textAlignVertical: 'center',
    paddingBottom: 20,
  },
  sendBar: {
    backgroundColor:"#FFF", 
    flexDirection:'row',
    justifyContent: 'flex-end',
    paddingBottom: 50,
    paddingRight: 30
  },
  darkFootBar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#000", 
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
    color: "#000",
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
  resultsText: {
    fontSize: 17,
    paddingTop: 20,
    paddingBottom: 10,
    color: "#000",
    textAlign: "center",
  },
  resumeView: {
    paddingTop: 40,
    paddingLeft: 40,
    backgroundColor: "#FFF"
  },
  resumeText: {
    fontSize: 20,
    textAlign: "justify",
    paddingTop: 20,
    color: "#000",
    fontWeight: 'bold',
  },
  imageText: {
    fontSize: 17,
    textAlign: "center",
    paddingTop: 15,
    paddingBottom: 30,
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
  mainButtonText: {
    fontSize: 17,
    textAlign: "center",
    color: "#000",
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 'bold',
    width: "90%"
  },
  mainButtonTextLight: {
    fontSize: 17,
    textAlign: "center",
    color: "#FFF",
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 'bold'
  },
  saveButton: {
    fontSize: 17,
    textAlign: "center",
    fontWeight: 'bold',
    color: "#2E8B57",
    fontWeight: 'bold',
  },
  saveText: {
    fontSize: 17,
    textAlign: "center",
    fontWeight: 'bold',
    color: "#fff",
    backgroundColor: "#2E8B57",
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
  },
  exitButton: {
    fontSize: 17,
    textAlign: "center",
    fontWeight: 'bold',
    color: "#B03A2E",
    fontWeight: 'bold',
  },
  exitText: {
    fontSize: 17,
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#B03A2E",
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
  },
  mainIcon: {
    backgroundColor: "#00749A",
    alignSelf: "center",
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    borderRadius: 10
  },
  buyButton: {
    fontSize: 17,
    backgroundColor: "#186A3B",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#fff",
    paddingTop: 50,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 50,
    textAlign: "center",
    alignSelf: "center",
  },
  saleButton: {
    fontSize: 17,
    backgroundColor: "#2E86C1",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#fff",
    paddingTop: 50,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 50,
    textAlign: "center",
    alignSelf: "center",
  },
  payButton: {
    fontSize: 17,
    backgroundColor: "#922B21",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#fff",
    paddingTop: 50,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 50,
    textAlign: "center",
    alignSelf: "center",
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
  },
  selectedImageView: {
    flex: 1,
    alignItems: 'center',
    textAlign: "center",
    backgroundColor: "#000",
  },
  mainHeader: {
    paddingTop: 20,
    alignItems: 'center',
    textAlign: "center",
    fontWeight: "bold",
    color: "#000",
    fontSize: 25,
  },
  howStart: {
    paddingTop: 100,
    alignItems: 'center',
    textAlign: "center",
    color: "#000",
    fontSize: 20,
  },
  voiceControlView: {
    flex: 1,
    paddingTop: 50,
    alignContent: "center",
    alignSelf: "center",
    width: "90%",
  },
  imagesBlock: {
    alignSelf: "center",
    backgroundColor: "#00749A",
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
    width: "70%",
    borderRadius: 10
  },
  cameraIcon: {
    backgroundColor: "#00749A",
    borderRadius: 10,
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
  microIcon: {
    backgroundColor: "#00749A",
    borderRadius: 10,
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
  galleryIcon: {
    backgroundColor: "#00749A",
    borderRadius: 10,
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
  }
});