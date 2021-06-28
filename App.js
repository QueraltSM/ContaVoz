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
      addValue: "",
      showForm: false
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

  formAction = () => {
    this.setState({showForm: !this.state.showForm})
  }

  setMenuButtons() {
    if (this.state.showForm) {
      return(
        <View style={styles.dictionaryView}>
          <View style={{ width: "90%", flexDirection:'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity onPress={() => this.formAction()}>
                <Icon
                  name='times'
                  type='font-awesome'
                  color='#B03A2E'
                  size={28}
                />
              </TouchableOpacity>
          </View>
          <Text style={styles.resumeText}>Palabra</Text>
          <TextInput value={this.state.addKey} multiline={true} style={styles.changeTranscript} placeholder="Macro" onChangeText={addKey => this.setState({addKey})}></TextInput>
          <Text style={styles.resumeText}>Valor que debe tomar</Text>
          <TextInput value={this.state.addValue} multiline={true} style={styles.changeTranscript} placeholder="Makro" onChangeText={addValue => this.setState({addValue})}></TextInput>
          <Text style={styles.transcript}></Text>
          <TouchableOpacity onPress={this._addWord}>
            <Text style={styles.saveNewValue}>Guardar</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={{ width: "90%", flexDirection:'row', justifyContent: 'flex-end'}}>
      <TouchableOpacity onPress={() => this.formAction()}>
          <Icon
            name='plus'
            type='font-awesome'
            color='#2E8B57'
            size={28}
          />
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
      invoice: this.props.navigation.state.params.invoice,
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
          {this.state.invoice.length > 0 &&
            (<View>
              <Text style={styles.resumeText}>Nº factura</Text>
              <TextInput multiline={true} style={styles.changeTranscript}>{this.state.invoice}</TextInput>
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
          <TouchableOpacity onPress={this.sendDocument}><Text style={styles.saveText}>Enviar</Text></TouchableOpacity>
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
      invoice: "",
      total: "",
      interpretedEntity: "",
      interpretedNif: "",
      interpretedDate: "",
      interpretedInvoice: "",
      interpretedTotal: "",
      getEntity: false,
      setEntity: false,
      getNIF: false,
      setNIF: false,
      getDate: false,
      setDate: false,
      getInvoice: false,
      setInvoice: false,
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
      } else {
        this.setState({ saved: JSON.parse(false) })
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
    await AsyncStorage.getItem("invoice").then((value) => {
      if (value != null) {
        this.setState({ invoice: value })
      }
    })
    await AsyncStorage.getItem("interpretedInvoice").then((value) => {
      if (value != null) {
        this.setState({ interpretedInvoice: value })
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

  setInterpretedInvoice() {
    var str = this.state.invoice
    for (let i = 0; i < this.state.words.length; i++) {
      if (this.state.invoice.toLowerCase().includes(this.state.words[i].key.toLowerCase())) {
        str = str.toLocaleLowerCase().replace(this.state.words[i].key.toLocaleLowerCase(), this.state.words[i].value)
      }
    }
    this.setState({ interpretedInvoice: str })
    this.saveInMemory("interpretedInvoice", this.state.interpretedInvoice)
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
          if (this.state.invoice == "") {
            this.setState({
              invoice: word[0],
            });
            this.setState({getInvoice: true})
            this.setInterpretedInvoice()
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

  async storeTotalInDictionary() {
    var arrayWords =  this.state.words
    if (!this.state.words.some(item => item.key === this.state.total)) {
      arrayWords.push({
        key: this.state.total,
        value: this.state.interpretedTotal
      })
    } else {
      var i = arrayWords.findIndex(obj => obj.key === this.state.total);
      arrayWords[i].value = this.state.interpretedTotal
    }
    this.setState({ words: arrayWords })
    await AsyncStorage.setItem("words", JSON.stringify(arrayWords))
    this.storeInvoice()
  }

  async storeInvoiceInDictionary() {
    var arrayWords =  this.state.words
    if (!this.state.words.some(item => item.key === this.state.invoice)) {
      arrayWords.push({
        key: this.state.invoice,
        value: this.state.interpretedInvoice
      })
    } else {
      var i = arrayWords.findIndex(obj => obj.key === this.state.invoice);
      arrayWords[i].value = this.state.interpretedInvoice
    }
    this.setState({ words: arrayWords })
    await AsyncStorage.setItem("words", JSON.stringify(arrayWords))
    this.storeInvoice()
  }

  async storeDateInDictionary() {
    var arrayWords =  this.state.words
    if (!this.state.words.some(item => item.key === this.state.date)) {
      arrayWords.push({
        key: this.state.date,
        value: this.state.interpretedDate
      })
    } else {
      var i = arrayWords.findIndex(obj => obj.key === this.state.date);
      arrayWords[i].value = this.state.interpretedDate
    }
    this.setState({ words: arrayWords })
    await AsyncStorage.setItem("words", JSON.stringify(arrayWords))
    this.storeDate()
  }

  async storeNifInDictionary() {
    var arrayWords =  this.state.words
    if (!this.state.words.some(item => item.key === this.state.nif)) {
      arrayWords.push({
        key: this.state.nif,
        value: this.state.interpretedNif
      })
    } else {
      var i = arrayWords.findIndex(obj => obj.key === this.state.nif);
      arrayWords[i].value = this.state.interpretedNif
    }
    this.setState({ words: arrayWords })
    await AsyncStorage.setItem("words", JSON.stringify(arrayWords))
    this.storeNif()
  }

  async storeEntityInDictionary() {
    var arrayWords =  this.state.words
    if (!this.state.words.some(item => item.key === this.state.entity)) {
      arrayWords.push({
        key: this.state.entity,
        value: this.state.interpretedEntity
      })
    } else {
      var i = arrayWords.findIndex(obj => obj.key === this.state.entity);
      arrayWords[i].value = this.state.interpretedEntity
    }
    this.setState({ words: arrayWords })
    await AsyncStorage.setItem("words", JSON.stringify(arrayWords))
    this.storeEntity()
  }

  async askTotalNewSave() {
    const AsyncAlert = () => new Promise((resolve) => {
      Alert.alert(
        "Guardar palabra",
        "¿Desea almacenar esta palabra para 'Total' en el diccionario?",
        [
          {
            text: 'Sí',
            onPress: () => {
              resolve(this.storeTotalInDictionary());
            },
          },
          {
            text: 'No',
            onPress: () => {
              resolve(this.storeTotal());
            },
          },
        ],
        { cancelable: false },
      );
      });
      await AsyncAlert();
  }

  async askInvoiceNewSave () {
    const AsyncAlert = () => new Promise((resolve) => {
      Alert.alert(
        "Guardar palabra",
        "¿Desea almacenar esta palabra para 'Factura' en el diccionario?",
        [
          {
            text: 'Sí',
            onPress: () => {
              resolve(this.storeInvoiceInDictionary());
            },
          },
          {
            text: 'No',
            onPress: () => {
              resolve(this.storeInvoice());
            },
          },
        ],
        { cancelable: false },
      );
      });
      await AsyncAlert();
  }

  async askDateNewSave () {
    const AsyncAlert = () => new Promise((resolve) => {
      Alert.alert(
        "Guardar palabra",
        "¿Desea almacenar esta palabra para 'Fecha' en el diccionario?",
        [
          {
            text: 'Sí',
            onPress: () => {
              resolve(this.storeDateInDictionary());
            },
          },
          {
            text: 'No',
            onPress: () => {
              resolve(this.storeEntity());
            },
          },
        ],
        { cancelable: false },
      );
      });
      await AsyncAlert();
  }

  async askNifNewSave() {
    const AsyncAlert = () => new Promise((resolve) => {
      Alert.alert(
        "Guardar palabra",
        "¿Desea almacenar esta palabra para 'NIF' en el diccionario?",
        [
          {
            text: 'Sí',
            onPress: () => {
              resolve(this.storeNifInDictionary());
            },
          },
          {
            text: 'No',
            onPress: () => {
              resolve(this.storeEntity());
            },
          },
        ],
        { cancelable: false },
      );
      });
      await AsyncAlert();
  }

  async askEntityNewSave () {
    const AsyncAlert = () => new Promise((resolve) => {
      Alert.alert(
        "Guardar palabra",
        "¿Desea almacenar esta palabra para 'Entidad' en el diccionario?",
        [
          {
            text: 'Sí',
            onPress: () => {
              resolve(this.storeEntityInDictionary());
            },
          },
          {
            text: 'No',
            onPress: () => {
              resolve(this.storeEntity());
            },
          },
        ],
        { cancelable: false },
      );
      });
      await AsyncAlert();
  }

  async storeEntity() {
    this.setState({setEntity: true})
    this.saveInMemory("isBuy", JSON.stringify(true))
    this.saveInMemory("entity", this.state.entity)
    this.setState({is_recording: true})
    this._continue()
  }

  async storeNif() {
    this.setState({setNIF: true})
    this.saveInMemory("nif", this.state.nif)
    this.setState({is_recording: true})
    this._continue()
  }

  async storeDate() {
    this.setState({setDate: true})
    this.saveInMemory("date", this.state.date)
    this.setState({is_recording: true})
    this._continue()
  }

  async storeInvoice() {
    this.setState({setInvoice: true})
    this.setState({is_recording: true})
    this.saveInMemory("invoice", this.state.invoice)
    this._continue()
  }

  async storeTotal() {
    this.setState({setTotal: true})
    this.saveInMemory("total", this.state.total)
    this.setState({saved: true})
    this.saveInMemory("saved", JSON.stringify(true))
  }

  setEntity = async() => {
    if (this.state.interpretedEntity != this.state.entity) {
      this.askEntityNewSave()
    } else {
      this.storeEntity()
    }
  }

  setNIF = async() => {
    if (this.state.interpretedNif != this.state.nif) {
      this.askNifNewSave()
    } else {
      this.storeNif()
    }
  }

  setDate = async() => {
    if (this.state.interpretedDate != this.state.date) {
      this.askDateNewSave()
    } else {
      this.storeDate()
    }
  }

  setInvoice = async() => {
    if (this.state.interpretedInvoice != this.state.invoice) {
      this.askInvoiceNewSave()
    } else {
      this.storeInvoice()
    }
  }

  setTotal = async() => {
    if (this.state.interpretedTotal != this.state.total) {
      this.askTotalNewSave()
    } else {
      this.storeTotal()
    }
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
    this.setState({invoice: ""})
    this.setState({total: ""})
    this.setState({getEntity: false})
    this.setState({setEntity: false})
    this.setState({getNIF: false})
    this.setState({setNIF: false})
    this.setState({getDate: false})
    this.setState({setDate: false})
    this.setState({getInvoice: false})
    this.setState({setInvoice: false})
    this.setState({getTotal: false})
    this.setState({setTotal: false})
    this.setState({finalView: false})
    this.setState({started: false})
    this.setState({startVoice: false})
    this.setState({images: []})
    await AsyncStorage.setItem("entity", "")
    await AsyncStorage.setItem("nif", "")
    await AsyncStorage.setItem("date", "")
    await AsyncStorage.setItem("invoice", "")
    await AsyncStorage.setItem("total", "")
    await AsyncStorage.setItem("images", JSON.stringify([]))
    await AsyncStorage.setItem("isBuy", JSON.stringify(false))
    await AsyncStorage.setItem("saved", JSON.stringify(false))
  }

    _finish = async () => {
      if (this.state.images.length > 0 || this.state.entity.length>0) {
        this.props.navigation.push('ResumeView', {
          type: "compra",
          back: "Buy",
          entity: this.state.interpretedEntity,
          nif: this.state.interpretedNif,
          date: this.state.interpretedDate,
          invoice: this.state.interpretedInvoice,
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
      return (
      <View style={styles.voiceControlView}>
          <Text style={styles.title}>Entidad</Text>
          <View style={styles.textForm}>
            <Text style={styles.resumeText}>Texto escuchado</Text>
            <Text multiline={true} style={styles.transcript}>{this.state.entity}</Text>
            <Text style={styles.resumeText}>Texto interpretado</Text>
            <TextInput onChangeText={(interpretedEntity) => this.setState({interpretedEntity})} multiline={true} style={styles.changeTranscript}>{this.state.interpretedEntity}</TextInput>
            <TouchableOpacity onPress={this.setEntity}>
                <Text style={styles.saveButton}>Guardar</Text>
            </TouchableOpacity>
            <Text style={styles.transcript}></Text>
            <Text style={styles.transcript}></Text>
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

  setInvoiceVoiceControl() {
    if (JSON.parse(this.state.is_recording) && this.state.invoice.length==0 && this.state.date.length>0 && !JSON.parse(this.state.getInvoice)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Escuchando nº factura...</Text>
      </View>)
    }
    if (JSON.parse(this.state.getInvoice) && !JSON.parse(this.state.setInvoice)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Resultados para factura</Text>
        <Text style={styles.text}>Texto escuchado: <Text style={styles.transcript}>{this.state.invoice}</Text></Text>
        <Text style={styles.text}>Texto interpretado: <Text style={styles.transcript}>{this.state.interpretedInvoice} </Text></Text>
        <Text style={styles.transcript}></Text>
        <View style={styles.navBarButtons}>
          <Icon
          name='window-close'
          type='font-awesome'
          color='#FFF'
          size={32}
          />
          <Text style={styles.transcript}></Text>
          <TouchableOpacity onPress={this.setInvoice}>
            <Text style={styles.saveButton}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>)
    } 
    return null
  }

  setTotalVoiceControl() {
    if (JSON.parse(this.state.is_recording) && this.state.total.length==0 && this.state.invoice.length>0 && !JSON.parse(this.state.getTotal)) {
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

  startProgramm() {
    if (this.state.images.length == 0 && this.state.entity.length == 0) {
      return(
        <View style={styles.voiceControlView}>
          <Text style={styles.title}>Empiece adjuntando una imagen o el control de voz pulsando el micrófono</Text>
        </View>
      )
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
          {this.startProgramm()}
          {this.setImages()}
          {this.setSaveDocument()}
          {this.setEntityVoiceControl()}
          {this.setNIFVoiceControl()}
          {this.setDateVoiceControl()}
          {this.setInvoiceVoiceControl()}
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
            name='calculator'
            type='font-awesome'
            color='#000'
            size={45}
          />
          </View>
        <Text style={styles.mainHeader}>Contabilidad</Text>
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
            <Text style={styles.mainButton}>Seguir gastos</Text>
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
              <Text style={styles.mainButton}>Gastos</Text>
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
    color: '#000',
    fontSize: 20,
    width: "90%"
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
  dictionaryView: {
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
  saveNewValueRight: {
    fontSize: 20,
    textAlign: "center",
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