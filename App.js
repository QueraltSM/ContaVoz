import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, FlatList, BackHandler, ScrollView} from 'react-native';
import Voice from 'react-native-voice';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Icon, withTheme } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

class DictionaryViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
      addKey: "",
      addValue: ""
    };
    this.init()
  }

  async init() {
    await AsyncStorage.getItem("words").then((value) => {
      if (value != null) {
        this.setState({ words: JSON.parse(value) })
      }
    })
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

  _addWord = async () => {
    if (this.state.addKey == "" || this.state.addValue == "") {
      this.showAlert("Error", "Complete todos los campos")
    } else {
      var entered = false
      var arrayWords =  this.state.words
      for (let i = 0; i < this.state.words.length; i++) {
        if ( this.state.words[i].key == this.state.addKey) {
          entered = true
        }
      }
      if (!entered) {
        arrayWords.push({
          key: this.state.addKey,
          value: this.state.addValue
        })
        this.setState({ words: arrayWords })
        await AsyncStorage.setItem("words", JSON.stringify(arrayWords))
      }
      this.setState({ addKey: "" })
      this.setState({ addValue: "" })
    }
  }

  setMenuButtons() {
      return(
        <View style={styles.resumeView}>
          <Text style={styles.resumeText}>Palabra</Text>
          <TextInput value={this.state.addKey} multiline={true} style={styles.changeTranscript} placeholder="Macro" onChangeText={addKey => this.setState({addKey})}></TextInput>
          <Text style={styles.resumeText}>Valor que debe tomar</Text>
          <TextInput value={this.state.addValue} multiline={true} style={styles.changeTranscript} placeholder="Makro" onChangeText={addValue => this.setState({addValue})}></TextInput>
          <Text style={styles.transcript}></Text>
          <TouchableOpacity onPress={this._addWord}>
            <Text style={styles.saveNewValue}>Añadir palabra</Text>
          </TouchableOpacity>
        </View>
      )
  }

  setMenu() {
    return(
      <View style={{backgroundColor:"#FFF"}}>
        <View style={styles.accountingViewShow}>
        <Icon
            name='book'
            type='font-awesome'
            color='#000'
            size={45}
          />
          </View>
        <Text style={styles.mainHeader}>Diccionario</Text>
      </View>
    )
  }

  deleteWord = async (item) => {
    var arrayWords = []
    for (let i = 0; i < this.state.words.length; i++) {
      if ( this.state.words[i].key != item.key) {
        arrayWords.push({
          key: this.state.words[i].key,
          value: this.state.words[i].value
        })
      }
    }
    this.setState({ words: arrayWords })
    await AsyncStorage.setItem("words", JSON.stringify(arrayWords))
  }

  setWords() {
    if (this.state.words.length > 0) {
      return (
        <View style={styles.resumeView}>
          <Text style={styles.showTitle}>Listado de palabras</Text>
        <FlatList 
          vertical
          showsVerticalScrollIndicator={false}
          data={this.state.words}
          renderItem={({ item }) => (
            <View style={styles.wordsBox}>
            <Text style={styles.dictionaryValues}>'{item.key}' es {item.value}</Text>             
             <View style={styles.delIcon}>            
              <TouchableOpacity onPress={() => this.deleteWord(item)}>
                <Icon
                  name='times'
                  type='font-awesome'
                  color='#B03A2E'
                  size={28}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      </View>
      )
    }
    return null
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.setMenu()}
        <ScrollView style={{backgroundColor: "#fff"}}>
        <View style={{paddingBottom: 100}}>
          {this.setMenuButtons()}
          {this.setWords()}
        </View>
        </ScrollView>
      </View>
    );
  }
}

class ResumeViewScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: "",
      entity: this.props.navigation.state.params.entity,
      nif: this.props.navigation.state.params.nif,
      date: this.props.navigation.state.params.date,
      invoiceNumber: this.props.navigation.state.params.invoiceNumber,
      total: this.props.navigation.state.params.total,
      images:  this.props.navigation.state.params.images,
      type: this.props.navigation.state.params.type,
      back: this.props.navigation.state.params.back,
    };
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

  sendDocument = async () => {
    alert("Esta acción está desactivada por el momento")
  }

  setControlVoice(){
      return(
        <View style={styles.resumeView}>
          {this.state.entity.length > 0 && 
          (<View>
            <Text style={styles.mainButtonText}>Edite el documento generado</Text>
            <Text style={styles.resumeText}>Entidad</Text>
            <TextInput multiline={true} style={styles.changeTranscript}>{this.state.entity}</TextInput>
            </View>
          )}
          {this.state.nif.length > 0 &&
            (<View>
              <Text style={styles.resumeText}>NIF</Text>
              <TextInput multiline={true} style={styles.changeTranscript}>{this.state.nif}</TextInput>
              </View>
          )}
          {this.state.date.length > 0 &&
            (<View>
              <Text style={styles.resumeText}>Fecha</Text>
              <TextInput multiline={true} style={styles.changeTranscript}>{this.state.date}</TextInput>
              </View>
          )}
          {this.state.invoiceNumber.length > 0 &&
            (<View>
              <Text style={styles.resumeText}>Nº factura</Text>
              <TextInput multiline={true} style={styles.changeTranscript}>{this.state.invoiceNumber}</TextInput>
              </View>
          )}
          {this.state.total.length > 0 &&
            (<View>
              <Text style={styles.resumeText}>Total</Text>
              <TextInput multiline={true} style={styles.changeTranscript}>{this.state.total}</TextInput>
              </View>
          )}
        </View>
      )
  }

  render () {
    return (
      <View style={{flex: 1}}>
        {this.setMenu()}
        <ScrollView style={{backgroundColor: "#fff"}}>
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
      nif: "",
      date: "",
      invoiceNumber: "",
      total: "",
      interpretedEntity: "",
      interpretedNif: "",
      interpretedDate: "",
      interpretedInvoiceNumber: "",
      interpretedTotal: "",
      getEntity: false,
      setEntity: false,
      getNIF: false,
      setNIF: false,
      getDate: false,
      setDate: false,
      getInvoiceNumber: false,
      setInvoiceNumber: false,
      getTotal: false,
      setTotal: false,
      started: false,
      startVoice: false,
      saved: true,
      images: [],
      words: []
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
    await AsyncStorage.getItem("saved").then((value) => {
      if (value != null) {
        this.setState({ saved: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("images").then((value) => {
      if (value != null) {
        this.setState({ images: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("entity").then((value) => {
      if (value != null) {
        this.setState({ entity: value })
      }
    })
    await AsyncStorage.getItem("interpretedEntity").then((value) => {
      if (value != null) {
        this.setState({ interpretedEntity: value })
      }
    })
    await AsyncStorage.getItem("nif").then((value) => {
      if (value != null) {
        this.setState({ nif: value })
      }
    })
    await AsyncStorage.getItem("interpretedNif").then((value) => {
      if (value != null) {
        this.setState({ interpretedNif: value })
      }
    })
    await AsyncStorage.getItem("date").then((value) => {
      if (value != null) {
        this.setState({ date: value })
      }
    })
    await AsyncStorage.getItem("interpretedDate").then((value) => {
      if (value != null) {
        this.setState({ interpretedDate: value })
      }
    })
    await AsyncStorage.getItem("invoiceNumber").then((value) => {
      if (value != null) {
        this.setState({ invoiceNumber: value })
      }
    })
    await AsyncStorage.getItem("interpretedInvoiceNumber").then((value) => {
      if (value != null) {
        this.setState({ interpretedInvoiceNumber: value })
      }
    })
    await AsyncStorage.getItem("total").then((value) => {
      if (value != null) {
        this.setState({ total: value })
      }
    })
    await AsyncStorage.getItem("interpretedTotal").then((value) => {
      if (value != null) {
        this.setState({ interpretedTotal: value })
      }
    })
    await AsyncStorage.getItem("id").then((value) => {
      if (value != null) {
        this.setState({ id: value })
      }
    })
    await AsyncStorage.getItem("words").then((value) => {
      if (value != null) {
        this.setState({ words: JSON.parse(value) })
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


  setInterpretedEntity() {
    var str = this.state.entity
    for (let i = 0; i < this.state.words.length; i++) {
      if (this.state.entity.toLowerCase().includes(this.state.words[i].key.toLowerCase())) {
        str = str.toLocaleLowerCase().replace(this.state.words[i].key.toLocaleLowerCase(), this.state.words[i].value)
      }
    }
    this.setState({ interpretedEntity: str })
    this.saveInMemory("interpretedEntity", this.state.interpretedEntity)
  }

  // nif 123
  // nombre queralt
  // prueba jojo
  // mi empresa difost xxx
  // 56 jh

  setInterpretedNif() {
    var str = this.state.nif 
    for (let i = 0; i < this.state.words.length; i++) {
      if (this.state.nif.toLowerCase().includes(this.state.words[i].key.toLowerCase())) {
        str = str.toLocaleLowerCase().replace(this.state.words[i].key.toLocaleLowerCase(), this.state.words[i].value)
      }
    }
    this.setState({ interpretedNif: str })
    this.saveInMemory("interpretedNif", this.state.interpretedNif)
  }

  setInterpretedDate() {
    var str = this.state.date
    for (let i = 0; i < this.state.words.length; i++) {
      if (this.state.date.toLowerCase().includes(this.state.words[i].key.toLowerCase())) {
        str = str.toLocaleLowerCase().replace(this.state.words[i].key.toLocaleLowerCase(), this.state.words[i].value)
      }
    }
    this.setState({ interpretedDate: str })
    this.saveInMemory("interpretedDate", this.state.interpretedDate)
  }

  setInterpretedInvoiceNumber() {
    var str = this.state.invoiceNumber
    for (let i = 0; i < this.state.words.length; i++) {
      if (this.state.invoiceNumber.toLowerCase().includes(this.state.words[i].key.toLowerCase())) {
        str = str.toLocaleLowerCase().replace(this.state.words[i].key.toLocaleLowerCase(), this.state.words[i].value)
      }
    }
    this.setState({ interpretedInvoiceNumber: str })
    this.saveInMemory("interpretedInvoiceNumber", this.state.interpretedInvoiceNumber)
  }

  setInterpretedTotal() {
    var str = this.state.total
    for (let i = 0; i < this.state.words.length; i++) {
      if (this.state.total.toLowerCase().includes(this.state.words[i].key.toLowerCase())) {
        str = str.toLocaleLowerCase().replace(this.state.words[i].key.toLocaleLowerCase(), this.state.words[i].value)
      }
    }
    this.setState({ interpretedTotal: str })
    this.saveInMemory("interpretedTotal", this.state.interpretedTotal)
  }

  onSpeechResults(e) {
    var res = e.value + ""
    var word = res.split(",")
    if (this.state.entity == "") {
      this.setState({
        entity: word[0],
      });
      this.setState({getEntity: true})
      this.setInterpretedEntity()
    } else {
      if (this.state.nif == "") {
        this.setState({
          nif: word[0],
        });
        this.setState({getNIF: true})
        this.setInterpretedNif()
      } else {
        if (this.state.date == "") {
          this.setState({
            date: word[0],
          });
          this.setState({getDate: true})
          this.setInterpretedDate()
        } else {
          if (this.state.invoiceNumber == "") {
            this.setState({
              invoiceNumber: word[0],
            });
            this.setState({getInvoiceNumber: true})
            this.setInterpretedInvoiceNumber()
          } else {
            if (this.state.total == "") {
              this.setState({
                total: word[0],
              });
              this.setState({getTotal: true})
              this.setInterpretedTotal()
            }
          }
        }
      } 
    }
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
    this._startRecognition()
  }

  _cancel = async() => {
    this.props.navigation.push('Main')
  }

  _getImages = () => {
    this.props.navigation.push('Images')
  }

  setMicrophoneIcon() {
    if (JSON.parse(this.state.is_recording) && !JSON.parse(this.state.saved)) {
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

  cancelEntity = async () => {
    this.setState({setEntity: false})
    this.setState({is_recording: true})
    this.setState({getEntity: false})
    this.setState({entity: ""})
    this.setState({interpretedEntity: ""})
    this._startRecognition()
  }

  cancelNIF = async() => {
    this.setState({setNIF: false})
    this.setState({getNIF: false})
    this.setState({is_recording: true})
    this.setState({nif: ""})
    this.setState({interpretedNif: ""})
    this._startRecognition()
  }

  cancelDate = async() => {
    this.setState({setDate: false})
    this.setState({is_recording: true})
    this.setState({getDate: false})
    this.setState({date: ""})
    this.setState({interpretedDate: ""})
    this._startRecognition()
  }

  cancelInvoiceNumber = async() => {
    this.setState({setInvoiceNumber: false})
    this.setState({is_recording: true})
    this.setState({invoiceNumber: ""})
    this.setState({getInvoiceNumber: false})
    this.setState({interpretedInvoiceNumber: ""})
    this._startRecognition()
  }

  cancelTotal = async() => {
    this.setState({setTotal: false})
    this.setState({is_recording: true})
    this.setState({total: ""})
    this.setState({saved: false})
    this.setState({getTotal: false})
    this.setState({interpretedTotal: ""})
    this.saveInMemory("saved", JSON.stringify(false))
    this._startRecognition()
  }

  setEntity = async() => {
    this.setState({setEntity: true})
    this.saveInMemory("isBuy", JSON.stringify(true))
    this.saveInMemory("entity", this.state.entity)
    this.setState({is_recording: true})
    this._continue()
  }

  setNIF = async() => {
    this.setState({setNIF: true})
    this.saveInMemory("nif", this.state.nif)
    this.setState({is_recording: true})
    this._continue()
  }

  setDate = async() => {
    this.setState({setDate: true})
    this.saveInMemory("date", this.state.date)
    this.setState({is_recording: true})
    this._continue()
  }

  setInvoiceNumber = async() => {
    this.setState({setInvoiceNumber: true})
    this.setState({is_recording: true})
    this.saveInMemory("invoiceNumber", this.state.invoiceNumber)
    this._continue()
  }

  setTotal = async() => {
    this.setState({setTotal: true})
    this.saveInMemory("total", this.state.total)
    this.setState({saved: true})
    this.saveInMemory("saved", JSON.stringify(true))
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
    this.setState({entity: "" })
    this.setState({nif: "" })
    this.setState({date: ""})
    this.setState({invoiceNumber: ""})
    this.setState({total: ""})
    this.setState({getEntity: false})
    this.setState({setEntity: false})
    this.setState({getNIF: false})
    this.setState({setNIF: false})
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
    await AsyncStorage.setItem("nif", "")
    await AsyncStorage.setItem("date", "")
    await AsyncStorage.setItem("invoiceNumber", "")
    await AsyncStorage.setItem("total", "")
    await AsyncStorage.setItem("images", JSON.stringify([]))
    await AsyncStorage.setItem("isBuy", JSON.stringify(false))
    await AsyncStorage.setItem("saved", JSON.stringify(false))
    this.props.navigation.push('Main')
  }

    _finish = async () => {
      if (this.state.images.length > 0 || this.state.entity.length>0) {
        this.props.navigation.push('ResumeView', {
          type: "compra",
          back: "Buy",
          entity: this.state.interpretedEntity,
          nif: this.state.interpretedNif,
          date: this.state.interpretedDate,
          invoiceNumber: this.state.interpretedInvoiceNumber,
          total: this.state.interpretedTotal,
          images: this.state.images
        })
      } else {
        this.showAlert("Finalizar el proceso", "Tiene que adjuntar al menos una imagen del documento o terminar el proceso de control por voz")
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
                        height:300,
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
        <Text style={styles.resultsText}>Texto interpretado: <Text style={styles.transcript}>{this.state.interpretedEntity} </Text></Text>
        <Text style={styles.transcript}></Text>
        <View style={styles.navBarButtons}>
        <TouchableOpacity onPress={this.cancelEntity}>
        <Text style={styles.exitButton}>Repetir</Text>
          </TouchableOpacity>
          <Icon
          name='window-close'
          type='font-awesome'
          color='#FFF'
          size={32}
          />
          <Text style={styles.transcript}></Text>
          <TouchableOpacity onPress={this.setEntity}>
            <Text style={styles.saveButton}>Guardar</Text>
          </TouchableOpacity>
        </View>
        </View>)
    } 
    return null
  }

  setNIFVoiceControl() {
    if (JSON.parse(this.state.is_recording) && this.state.nif.length==0 && this.state.entity.length>0 && !JSON.parse(this.state.getNIF)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Escuchando NIF...</Text>
      </View>)
    }
    if (JSON.parse(this.state.getNIF) && !JSON.parse(this.state.setNIF)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Resultados para NIF</Text>
        <Text style={styles.resultsText}>Texto escuchado: <Text style={styles.transcript}>{this.state.nif}</Text></Text>
        <Text style={styles.resultsText}>Texto interpretado: <Text style={styles.transcript}>{this.state.interpretedNif} </Text></Text>
        <Text style={styles.transcript}></Text>
        <View style={styles.navBarButtons}>
          <TouchableOpacity onPress={this.cancelNIF}>
            <Text style={styles.exitButton}>Repetir</Text>
          </TouchableOpacity>
          <Icon
          name='window-close'
          type='font-awesome'
          color='#FFF'
          size={32}
          />
          <Text style={styles.transcript}></Text>
          <TouchableOpacity onPress={this.setNIF}>
            <Text style={styles.saveButton}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>)
    } 
    return null
  }

  setDateVoiceControl() {
    if (JSON.parse(this.state.is_recording) && this.state.date.length==0 && this.state.nif.length>0 && !JSON.parse(this.state.getDate)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Escuchando fecha...</Text>
      </View>)
    }
    if (JSON.parse(this.state.getDate) && !JSON.parse(this.state.setDate)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Resultados para fecha</Text>
        <Text style={styles.resultsText}>Texto escuchado: <Text style={styles.transcript}>{this.state.date}</Text></Text>
        <Text style={styles.resultsText}>Texto interpretado: <Text style={styles.transcript}>{this.state.interpretedDate} </Text></Text>
        <Text style={styles.transcript}></Text>
        <View style={styles.navBarButtons}>
        <TouchableOpacity onPress={this.cancelDate}>
            <Text style={styles.exitButton}>Repetir</Text>
          </TouchableOpacity>
          <Icon
          name='window-close'
          type='font-awesome'
          color='#FFF'
          size={32}
          />
          <Text style={styles.transcript}></Text>
          <TouchableOpacity onPress={this.setDate}>
            <Text style={styles.saveButton}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>)
    } 
    return null
  }

  setInvoiceNumberVoiceControl() {
    if (JSON.parse(this.state.is_recording) && this.state.invoiceNumber.length==0 && this.state.date.length>0 && !JSON.parse(this.state.getInvoiceNumber)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Escuchando nº factura...</Text>
      </View>)
    }
    if (JSON.parse(this.state.getInvoiceNumber) && !JSON.parse(this.state.setInvoiceNumber)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Resultados para factura</Text>
        <Text style={styles.text}>Texto escuchado: <Text style={styles.transcript}>{this.state.invoiceNumber}</Text></Text>
        <Text style={styles.text}>Texto interpretado: <Text style={styles.transcript}>{this.state.interpretedInvoiceNumber} </Text></Text>
        <Text style={styles.transcript}></Text>
        <View style={styles.navBarButtons}>
        <TouchableOpacity onPress={this.cancelInvoiceNumber}>
            <Text style={styles.exitButton}>Repetir</Text>
          </TouchableOpacity>
          <Icon
          name='window-close'
          type='font-awesome'
          color='#FFF'
          size={32}
          />
          <Text style={styles.transcript}></Text>
          <TouchableOpacity onPress={this.setInvoiceNumber}>
            <Text style={styles.saveButton}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>)
    } 
    return null
  }

  setTotalVoiceControl() {
    if (JSON.parse(this.state.is_recording) && this.state.total.length==0 && this.state.invoiceNumber.length>0 && !JSON.parse(this.state.getTotal)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Escuchando total...</Text>
      </View>)
    }
    if (this.state.total.length>0 && !JSON.parse(this.state.saved)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Resultados para el total</Text>
        <Text style={styles.text}>Texto escuchado: <Text style={styles.transcript}>{this.state.total}</Text></Text>
        <Text style={styles.text}>Texto interpretado: <Text style={styles.transcript}>{this.state.interpretedTotal} </Text></Text>
        <Text style={styles.transcript}></Text>
        <View style={styles.navBarButtons}>
        <TouchableOpacity onPress={this.cancelTotal}>
            <Text style={styles.exitButton}>Repetir</Text>
        </TouchableOpacity>
          <Icon
          name='window-close'
          type='font-awesome'
          color='#FFF'
          size={32}
          />
          <Text style={styles.transcript}></Text>
          <TouchableOpacity onPress={this.setTotal}>
            <Text style={styles.saveButton}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>)
    } 
    return null
  }


  setSaveDocument() {
    if (JSON.parse(this.state.saved)) {
      return(
        <View style={styles.voiceControlView}>
          <TouchableOpacity onPress={this._finish}>
            <Text style={styles.mainButtonText}>Editar documento de voz</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return null
  }

  render () {
    return (
      <View style={{flex: 1}}>
        {this.setMenu()}
        <ScrollView style={{backgroundColor: "#fff"}}>
        <View style={styles.sections}>
          {this.setMenuButtons()}
          {this.setImages()}
          {this.setSaveDocument()}
          {this.setEntityVoiceControl()}
          {this.setNIFVoiceControl()}
          {this.setDateVoiceControl()}
          {this.setInvoiceNumberVoiceControl()}
          {this.setTotalVoiceControl()}
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

  goDictionary = () => {
    this.props.navigation.push('DictionaryView')
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
          <TouchableOpacity onPress={this.goDictionary}>
            <View style={styles.mainIcon}>
              <Icon
                name='book'
                type='font-awesome'
                color='#FFF'
                size={40}
              />
              </View>
            <Text style={styles.mainButton}>Diccionario</Text>
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

export class Dictionary {
  constructor(key, value) {
    this.key = key;
    this.value = value;
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
  DictionaryView: {    
    screen: DictionaryViewScreen,
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
    flex:1,
    backgroundColor:"#FFF", 
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
  wordsBox: {
    flexDirection:'row',
    borderColor:"#FFF",
    width: "90%",
    borderWidth:1,
    paddingTop: 10,
  },
  resumeText: {
    fontSize: 20,
    textAlign: "justify",
    paddingTop: 20,
    color: "#000",
    fontWeight: 'bold',
  },
  dictionaryText:{
    fontSize: 20,
    textAlign: "justify",
    color: "#000",
    fontWeight: 'bold',
  },
  dictionaryValues: {
    fontSize: 20,
    textAlign: "justify",
    paddingTop: 15,
    color: "#000",
    width:"85%",
    fontWeight: 'bold',
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
    color: "#2874A6",
    paddingBottom: 30,
    fontWeight: 'bold',
    width: "100%"
  },
  saveButton: {
    fontSize: 17,
    textAlign: "center",
    fontWeight: 'bold',
    color: "#2E8B57",
    fontWeight: 'bold',
  },
  saveNewValue: {
    fontSize: 20,
    textAlign: "left",
    fontWeight: 'bold',
    color: "#2E8B57",
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
  title: {
    textAlign: 'center',
    color: '#1B5E8B',
    fontWeight: 'bold',
    fontSize: 25
  },
  showTitle:{
    textAlign: 'center',
    color: '#154360',
    fontWeight: 'bold',
    fontSize: 20
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
  voiceControlView: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 50,
    alignContent: "center",
    alignSelf: "center",
    width: "90%",
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
  },
  setMenuButtons: {
    flex:1,
    justifyContent: 'flex-end',
    backgroundColor: "#fff",
    paddingBottom: 20
  },
  delIcon: {
    paddingLeft: 5,
    backgroundColor:"#FFF", 
    justifyContent: 'flex-end',
    paddingTop: 12,
  }
});