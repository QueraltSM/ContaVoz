import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, FlatList, BackHandler, ScrollView, Modal, Dimensions} from 'react-native';
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
      nif: "",
      date: "",
      invoice: "",
      total: "",
      images: [],
      back: this.props.navigation.state.params.back,
    };
    this.init()
  }

  async init() {
    await AsyncStorage.getItem("images").then((value) => {
      if (value != null) {
        this.setState({ images: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("setEntity").then((value) => {
      if (value != null) {
        this.setState({ setEntity: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("setNIF").then((value) => {
      if (value != null) {
        this.setState({ setNIF: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("setDate").then((value) => {
      if (value != null) {
        this.setState({ setDate: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("setInvoice").then((value) => {
      if (value != null) {
        this.setState({ setInvoice: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("setTotal").then((value) => {
      if (value != null) {
        this.setState({ setTotal: JSON.parse(value) })
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
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  goBack = () => {
    this.props.navigation.push(this.state.back)
    return true
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
                source={{
                  uri:item.uri.replace(/['"]+/g, ''),
                }}
                resizeMode="contain"
                key={item}
                style={{ width: Dimensions.get('window').width, height: (Dimensions.get('window').height)/1.5, aspectRatio: 1 }}
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
            <Text style={styles.resumeText}>Entidad</Text>
            <View style={{flexDirection:'row', width:"90%"}}>
            <TextInput multiline={true} style={styles.changeTranscript}>{this.state.interpretedEntity}</TextInput>
            <Icon
              name='pencil'
              type='font-awesome'
              color='#000'
              size={30}
            />
            </View>
            </View>
          )}
          {this.state.nif.length > 0 &&
            (<View>
              <Text style={styles.resumeText}>NIF</Text>
            <View style={{flexDirection:'row', width:"90%"}}>
            <TextInput multiline={true} style={styles.changeTranscript}>{this.state.interpretedNif}</TextInput>
            <Icon
              name='pencil'
              type='font-awesome'
              color='#000'
              size={30}
            />
            </View>
          </View>
          )}
          {this.state.date.length > 0 &&
            (<View>
              <Text style={styles.resumeText}>Fecha</Text>
              <View style={{flexDirection:'row', width:"90%"}}>
              <TextInput multiline={true} style={styles.changeTranscript}>{this.state.interpretedDate}</TextInput>
              <Icon
                name='pencil'
                type='font-awesome'
                color='#000'
                size={30}
              />
              </View>
              </View>
          )}
          {this.state.invoice.length > 0 &&
            (<View>
              <Text style={styles.resumeText}>Nº factura</Text>
              <View style={{flexDirection:'row', width:"90%"}}>
              <TextInput multiline={true} style={styles.changeTranscript}>{this.state.interpretedInvoice}</TextInput>
              <Icon
                name='pencil'
                type='font-awesome'
                color='#000'
                size={30}
              />
              </View>
              </View>
          )}
          {this.state.total.length > 0 &&
            (<View>
              <Text style={styles.resumeText}>Total</Text>
              <View style={{flexDirection:'row', width:"90%"}}>
              <TextInput multiline={true} style={styles.changeTranscript}>{this.state.interpretedTotal}</TextInput>
              <Icon
                name='pencil'
                type='font-awesome'
                color='#000'
                size={30}
              />
              </View>
              </View>
          )}
        </View>
      )
  }

  render () {
    return (
      <View style={{flex: 1, paddingBottom: 50, backgroundColor:"#FFF"}}>
        <ScrollView style={{backgroundColor: "#fff"}}>
        <View style={styles.sections}>
          {this.setImages()}
          {this.setControlVoice()}
        </View>
        </ScrollView>
      </View>
    );
  }
}

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
      this.formAction()
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
            <Text style={styles.saveNewValue}>Guardar registro</Text>
          </TouchableOpacity>
          <Text style={styles.transcript}></Text>
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
            <Text>
            <Text style={styles.dictionaryKeys}>{item.key}</Text> 
            <Text style={styles.dictionaryValues}> es {item.value}</Text>    
            </Text>         
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

  saveDocument() {
    console.log("saveDocument")
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
        <View style={styles.sendBar}>
          <TouchableOpacity onPress={this.saveDocument}><Text style={styles.saveText}>Guardar</Text></TouchableOpacity>
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
              size={35}
            />
            <Icon
              name='plus'
              type='font-awesome'
              color='#000'
              size={35}
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
              size={35}
            />
            <Icon
              name='plus'
              type='font-awesome'
              color='#000'
              size={35}
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
      saved: false,
      images: [],
      words: []
    };
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
    this.init()
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
    await AsyncStorage.getItem("setEntity").then((value) => {
      if (value != null) {
        this.setState({ setEntity: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("setNIF").then((value) => {
      if (value != null) {
        this.setState({ setNIF: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("setDate").then((value) => {
      if (value != null) {
        this.setState({ setDate: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("setInvoice").then((value) => {
      if (value != null) {
        this.setState({ setInvoice: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("setTotal").then((value) => {
      if (value != null) {
        this.setState({ setTotal: JSON.parse(value) })
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

  _continue = () => {
    this._startRecognition()
  }

  setMicrophoneIcon() {
    if (JSON.parse(this.state.is_recording) && !JSON.parse(this.state.saved)) {
      return <Icon
            name='microphone-slash'
            type='font-awesome'
            color='#00749A'
            size={35}
            onPress={this._stopRecognition.bind(this)}
          />
    }
    return <Icon
      name='microphone'
      type='font-awesome'
      color='#00749A'
      size={35}
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
        "¿Desea almacenar esta palabra en el diccionario?",
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
        "¿Desea almacenar esta palabra en el diccionario?",
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
        "¿Desea almacenar esta palabra en el diccionario?",
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
        "¿Desea almacenar esta palabra en el diccionario?",
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
        "¿Desea almacenar esta palabra en el diccionario?",
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
    this.saveInMemory("setEntity", JSON.stringify(true))
    this.saveInMemory("isBuy", JSON.stringify(true))
    this.saveInMemory("entity", this.state.entity)
    this.setState({is_recording: true})
    this._continue()
  }

  async storeNif() {
    this.setState({setNIF: true})
    this.saveInMemory("setNIF", JSON.stringify(true))
    this.saveInMemory("nif", this.state.nif)
    this.setState({is_recording: true})
    this._continue()
  }

  async storeDate() {
    this.setState({setDate: true})
    this.saveInMemory("setDate", JSON.stringify(true))
    this.saveInMemory("date", this.state.date)
    this.setState({is_recording: true})
    this._continue()
  }

  async storeInvoice() {
    this.setState({setInvoice: true})
    this.saveInMemory("setInvoice", JSON.stringify(true))
    this.setState({is_recording: true})
    this.saveInMemory("invoice", this.state.invoice)
    this._continue()
  }

  async storeTotal() {
    this.setState({setTotal: true})
    this.saveInMemory("setTotal", JSON.stringify(true))
    this.saveInMemory("total", this.state.total)
    this.setState({saved: true})
    this.saveInMemory("saved", JSON.stringify(true))
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

  cancelInvoice = async() => {
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
    await AsyncStorage.getItem("interpretedEntity").then((value) => {
      if (value != null) {
        if (value != this.state.interpretedEntity) {
          this.askEntityNewSave()
        } else {
          this.storeEntity()
        }
      } else if (this.state.interpretedEntity != this.state.entity) {
        this.askEntityNewSave()
      } else {
        this.storeEntity()
      }
    })
  }

  setNIF = async() => {
    await AsyncStorage.getItem("interpretedNif").then((value) => {
      if (value != null) {
        if (value != this.state.interpretedNif) {
          this.askNifNewSave()
        } else {
          this.storeNif()
        }
      } else if (this.state.interpretedNif != this.state.nif) {
        this.askNifNewSave()
      } else {
        this.storeNif()
      }
    })
  }

  setDate = async() => {
    await AsyncStorage.getItem("interpretedDate").then((value) => {
      if (value != null) {
        if (value != this.state.interpretedDate) {
          this.askDateNewSave()
        } else {
          this.storeDate()
        }
      } else if (this.state.interpretedDate != this.state.date) {
        this.askDateNewSave()
      } else {
        this.storeDate()
      }
    })
  }

  setInvoice = async() => {
    await AsyncStorage.getItem("interpretedInvoice").then((value) => {
      if (value != null) {
        if (value != this.state.interpretedInvoice) {
          this.askInvoiceNewSave()
        } else {
          this.storeInvoice()
        }
      } else if (this.state.interpretedInvoice != this.state.invoice) {
        this.askInvoiceNewSave()
      } else {
        this.storeInvoice()
      }
    })
  }

  setTotal = async() => {
    await AsyncStorage.getItem("interpretedTotal").then((value) => {
      if (value != null) {
        if (value != this.state.interpretedTotal) {
          this.askTotalNewSave()
        } else {
          this.storeTotal()
        }
      } else if (this.state.interpretedTotal != this.state.total) {
        this.askTotalNewSave()
      } else {
        this.storeTotal()
      }
    })
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

  async resetState() {
    this.setState({entity: "" })
    this.setState({nif: "" })
    this.setState({date: ""})
    this.setState({invoice: ""})
    this.setState({total: ""})
    this.setState({interpretedEntity: "" })
    this.setState({interpretedNif: "" })
    this.setState({interpretedDate: ""})
    this.setState({interpretedInvoice: ""})
    this.setState({interpretedTotal: ""})
    this.setState({id: ""})
    this.setState({recognized: ""})
    this.setState({started: ""})
    this.setState({results: ""})
    this.setState({is_recording: false})
    this.setState({getEntity: false})
    this.setState({getNIF: false})
    this.setState({getDate: false})
    this.setState({getInvoice: false})
    this.setState({getTotal: false})
    this.setState({setEntity: false})
    this.setState({setNIF: false})
    this.setState({setDate: false})
    this.setState({setInvoice: false})
    this.setState({setTotal: false})
    this.setState({finalView: false})
    this.setState({started: false})
    this.setState({startVoice: false})
    this.setState({images: []})
  }

  async delete() {
    this.resetState()
    await AsyncStorage.setItem("entity", "")
    await AsyncStorage.setItem("nif", "")
    await AsyncStorage.setItem("date", "")
    await AsyncStorage.setItem("invoice", "")
    await AsyncStorage.setItem("total", "")
    await AsyncStorage.setItem("interpretedEntity", "")
    await AsyncStorage.setItem("interpretedNif", "")
    await AsyncStorage.setItem("interpretedDate", "")
    await AsyncStorage.setItem("interpretedInvoice", "")
    await AsyncStorage.setItem("interpretedTotal", "")
    await AsyncStorage.setItem("images", JSON.stringify([]))
    await AsyncStorage.setItem("isBuy", JSON.stringify(false))
    await AsyncStorage.setItem("saved", JSON.stringify(false))
    await AsyncStorage.setItem("setEntity", JSON.stringify(false))
    await AsyncStorage.setItem("setNIF", JSON.stringify(false))
    await AsyncStorage.setItem("setDate", JSON.stringify(false))
    await AsyncStorage.setItem("setInvoice", JSON.stringify(false))
    await AsyncStorage.setItem("setTotal", JSON.stringify(false))
  }

    _finish = async () => {
      if (this.state.images.length > 0 || this.state.total.length>0) {
        alert("Esta función debe enviar los datos oportunos")
      } else {
        this.showAlert("Enviar documento", "Tiene que adjuntar al menos una imagen o generar un documento contable por voz")
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
      "Borrar documento",
      "¿Está seguro que desea borrar permanentemente este documento?",
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
    if (this.state.images.length > 0 || this.state.interpretedEntity.length>0) {
      return(
        <View style={styles.navBarButtons}>
          <TouchableOpacity onPress={this._delete}>
            <Text style={styles.exitText}>Borrar</Text>
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
          <Text style={styles.saveText}>Enviar</Text>
        </TouchableOpacity>
        </View>
      )}
    return null
  }

  setImages() {
    if (this.state.images.length > 0) {
      return (
        <View style={styles.imagesSection}>
          <View style={styles.selectedImageView}>
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
                      resizeMode="contain"
                      key={item}
                      style={{ width: Dimensions.get('window').width, height: (Dimensions.get('window').height)/1.5, aspectRatio: 1 }}
                    />
                  </TouchableOpacity>
                )}
            />
        </View>
        </View>
      )
    }
    return (
      <View style={styles.imagesSection}>
      <View style={styles.selectedImageView}>
      </View>
      <TouchableOpacity onPress={this.takePhoto} style={{paddingTop: 20}}>
      <Image
          source={require('./assets/camera_plus.png')}
          resizeMode="contain"
          key="0"
          style={{ width: 150, height: 150 }}
      />
      </TouchableOpacity>
      </View>
    )
  }

  setEntityVoiceControl() {
    if (this.state.started.length>0 && this.state.entity.length == 0 && JSON.parse(this.state.is_recording)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.title}>Diga el nombre de su entidad</Text>
      </View>)
    }
    if (JSON.parse(this.state.getEntity) && !JSON.parse(this.state.setEntity)) {
      return (
            <Modal
            animationType = {"slide"}
            transparent={true}>
              <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <Text style={styles.listening}>Entidad</Text>
              <View style={styles.textForm}>
                <Text style={styles.resumeText}>Texto escuchado</Text>
                <Text multiline={true} style={styles.transcript}>{this.state.entity}</Text>
                <Text style={styles.transcript}></Text>
                <Text style={styles.resumeText}>Texto interpretado </Text>
                <View style={{flexDirection:'row', width:"90%"}}>
                  <TextInput multiline={true} style={styles.changeTranscript} onChangeText={(interpretedEntity) => this.setState({interpretedEntity})}>{this.state.interpretedEntity}</TextInput>
                  <Icon
                    name='pencil'
                    type='font-awesome'
                    color='#000'
                    size={30}
                  />
                  </View>
                  <Text style={styles.transcript}></Text>
                  <View style={styles.modalNavBarButtons}>
                    <TouchableOpacity onPress={this.setEntity}>
                        <Text style={styles.saveButton}>Guardar</Text>
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
                    <TouchableOpacity onPress={this.cancelEntity}>
                        <Text style={styles.exitButton}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
              </View>
            </View>
          </View>
        </Modal>)
    } 
    return null
  }

  setNIFVoiceControl() {
    if (JSON.parse(this.state.is_recording) && this.state.nif.length==0 && this.state.entity.length>0 && !JSON.parse(this.state.getNIF) && JSON.parse(this.state.is_recording)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.listening}>Diga su NIF</Text>
      </View>)
    }
    if (JSON.parse(this.state.getNIF) && !JSON.parse(this.state.setNIF)) {
      return (
        <Modal
        animationType = {"slide"}
        transparent={true}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>NIF</Text>
            <View style={styles.textForm}>
                <Text style={styles.resumeText}>Texto escuchado</Text>
                <Text multiline={true} style={styles.transcript}>{this.state.nif}</Text>
                <Text style={styles.transcript}></Text>
                <Text style={styles.resumeText}>Texto interpretado </Text>
                <Text style={styles.transcript}></Text>
                <View style={{flexDirection:'row', width:"90%"}}>
                  <TextInput multiline={true} style={styles.changeTranscript} onChangeText={(interpretedNif) => this.setState({interpretedNif})}>{this.state.interpretedNif}</TextInput>
                  <Icon
                    name='pencil'
                    type='font-awesome'
                    color='#000'
                    size={30}
                  />
                  </View>
                  <View style={styles.modalNavBarButtons}>
                <TouchableOpacity onPress={this.setNIF}>
                    <Text style={styles.saveButton}>Guardar</Text>
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
                <TouchableOpacity onPress={this.cancelNIF}>
                    <Text style={styles.exitButton}>Cancelar</Text>
                </TouchableOpacity>
                </View>
            </View>
          </View>
          </View>
      </Modal>)
    } 
    return null
  }

  setDateVoiceControl() {
    if (JSON.parse(this.state.is_recording) && this.state.date.length==0 && this.state.nif.length>0 && !JSON.parse(this.state.getDate) && JSON.parse(this.state.is_recording)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.listening}>Diga su fecha</Text>
      </View>)
    }
    if (JSON.parse(this.state.getDate) && !JSON.parse(this.state.setDate)) {
      return (
        <Modal
        animationType = {"slide"}
        transparent={true}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Fecha</Text>
            <View style={styles.textForm}>
                <Text style={styles.resumeText}>Texto escuchado</Text>
                <Text multiline={true} style={styles.transcript}>{this.state.date}</Text>
                <Text style={styles.transcript}></Text>
                <Text style={styles.resumeText}>Texto interpretado </Text>
                <View style={{flexDirection:'row', width:"90%"}}>
                  <TextInput multiline={true} style={styles.changeTranscript} onChangeText={(interpretedDate) => this.setState({interpretedDate})}>{this.state.interpretedDate}</TextInput>
                  <Icon
                    name='pencil'
                    type='font-awesome'
                    color='#000'
                    size={30}
                  />
                  </View>
                  <Text style={styles.transcript}></Text>
                <View style={{flexDirection:'row', width:"90%"}}>
                <TouchableOpacity onPress={this.setDate}>
                    <Text style={styles.saveButton}>Guardar</Text>
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
                <TouchableOpacity onPress={this.cancelDate}>
                    <Text style={styles.exitButton}>Cancelar</Text>
                </TouchableOpacity>
                </View>
            </View>
          </View>
        </View>
      </Modal>)
    } 
    return null
  }

  setInvoiceVoiceControl() {
    if (JSON.parse(this.state.is_recording) && this.state.invoice.length==0 && this.state.date.length>0 && !JSON.parse(this.state.getInvoice) && JSON.parse(this.state.is_recording)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.listening}>Diga su nº factura</Text>
      </View>)
    }
    if (JSON.parse(this.state.getInvoice) && !JSON.parse(this.state.setInvoice)) {
      return (
        <Modal
        animationType = {"slide"}
        transparent={true}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Nº Factura</Text>
            <View style={styles.textForm}>
                <Text style={styles.resumeText}>Texto escuchado</Text>
                <Text multiline={true} style={styles.transcript}>{this.state.invoice}</Text>
                <Text style={styles.transcript}></Text>
                <Text style={styles.resumeText}>Texto interpretado </Text>
                <View style={{flexDirection:'row', width:"90%"}}>
                  <TextInput multiline={true} style={styles.changeTranscript} onChangeText={(interpretedInvoice) => this.setState({interpretedInvoice})}>{this.state.interpretedInvoice}</TextInput>
                  <Icon
                    name='pencil'
                    type='font-awesome'
                    color='#000'
                    size={30}
                  />
                  </View>
                <Text style={styles.transcript}></Text>
                <View style={{flexDirection:'row', width:"90%"}}>
                <TouchableOpacity onPress={this.setInvoice}>
                    <Text style={styles.saveButton}>Guardar</Text>
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
                <TouchableOpacity onPress={this.cancelInvoice}>
                    <Text style={styles.exitButton}>Cancelar</Text>
                </TouchableOpacity>
                </View>
            </View>
          </View>
          </View>
      </Modal>)
    } 
    return null
  }

  setTotalVoiceControl() {
    if (JSON.parse(this.state.is_recording) && this.state.total.length==0 && this.state.invoice.length>0 && !JSON.parse(this.state.getTotal) && JSON.parse(this.state.is_recording)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.listening}>Diga su total</Text>
      </View>)
    }
    if (this.state.total.length>0 && !JSON.parse(this.state.saved)) {
      return (
        <Modal
        animationType = {"slide"}
        transparent={true}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Total</Text>
            <View style={styles.textForm}>
                <Text style={styles.resumeText}>Texto escuchado</Text>
                <Text multiline={true} style={styles.transcript}>{this.state.total}</Text>
                <Text style={styles.transcript}></Text>
                <Text style={styles.resumeText}>Texto interpretado </Text>
                <View style={{flexDirection:'row', width:"90%"}}>
                  <TextInput multiline={true} style={styles.changeTranscript} onChangeText={(interpretedTotal) => this.setState({interpretedTotal})}>{this.state.interpretedTotal}</TextInput>
                  <Icon
                    name='pencil'
                    type='font-awesome'
                    color='#000'
                    size={30}
                  />
                  </View>
                <Text style={styles.transcript}></Text>
                <View style={{flexDirection:'row', width:"90%"}}>
                <TouchableOpacity onPress={this.setTotal}>
                    <Text style={styles.saveButton}>Guardar</Text>
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
                <TouchableOpacity onPress={this.cancelTotal}>
                    <Text style={styles.exitButton}>Cancelar</Text>
                </TouchableOpacity>
                </View>
            </View>
          </View>
          </View>
      </Modal>)
    } 
    return null
  }

  startProgramm() {
    if (this.state.images.length == 0 && !JSON.parse(this.state.setEntity)) {
      return(
        <View style={styles.resumeView}>
          <Text style={styles.showTitle}>Para empezar debe adjuntar una imagen o pulsar el micrófono</Text>
        </View>
      )
    } else if (JSON.parse(this.state.setEntity) && !JSON.parse(this.state.setTotal)) {
      return(
        <View style={styles.resumeView}>
          <Text style={styles.showTitle}>Existe un documento contable por voz sin terminar</Text>
        </View>
      )
    } else if (JSON.parse(this.state.setEntity) && JSON.parse(this.state.setTotal)) {
      return(
        <View style={styles.resumeView}>
          <Text style={styles.showTitle}>Existe un documento contable por voz terminado</Text>
        </View>
      )
    }
    return null
  }

  sendDocument = async () => {
    alert("Esta acción está desactivada por el momento")
  }

  seeDocument = () => {
    this.props.navigation.push('ResumeView', {
      back: "Buy"
    })
  }

  setBottomMenu() {
    return (
      <View style={styles.footBar}>
      <View style={styles.cameraIcon}>
      <Icon
        name='camera'
        type='font-awesome'
        color='#00749A'
        size={35}
        onPress={this.takePhoto}
      />
      </View>
      <View style={styles.microIcon}>
        {this.setMicrophoneIcon()}
      </View>
      <View style={styles.galleryIcon}>
      <Icon
        name='image'
        type='font-awesome'
        color='#00749A'
        size={35}
        onPress={this.goGallery}
      />
      </View>
      {JSON.parse(this.state.setEntity) && 
      (<View style={styles.galleryIcon}>
      <Icon
        name='file'
        type='font-awesome'
        color='#00749A'
        size={35}
        onPress={this.seeDocument}
      /></View>)}
      </View>)
  }

  setTopMenu() {
    return (
    <View style={styles.footBar}>
    {(this.state.images.length > 0 || this.state.interpretedEntity.length>0) && 
      (<View style={{paddingRight:20}}><View style={styles.cameraIcon}><Icon
        name='times'
        type='font-awesome'
        color='#C0392B'
        size={40}
        onPress={this._delete}
      />
      </View></View>)}
    {(this.state.images.length > 0 || this.state.interpretedEntity.length>0) && 
    (<View style={{paddingLeft:20}}><View style={styles.galleryIcon}>
    <Icon
      name='check'
      type='font-awesome'
      color='#27AE60'
      size={40}
      onPress={this.sendDocument}
    /></View></View>)}
    </View>)
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: "#fff"}}>
        <ScrollView style={{backgroundColor: "#fff"}}>
          <View style={styles.sections}>
            {this.setImages()}
            {this.startProgramm()}
            {this.setEntityVoiceControl()}
            {this.setNIFVoiceControl()}
            {this.setDateVoiceControl()}
            {this.setInvoiceVoiceControl()}
            {this.setTotalVoiceControl()}
          </View>
        </ScrollView>
          {this.setTopMenu()}
          {this.setBottomMenu()}
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
            color='#154360'
            size={35}
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
                size={35}
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
                  size={35}
                />
                </View>
              <Text style={styles.mainButton}>Compra</Text>
            </TouchableOpacity>
            </View>)}
            <Icon
                name='shopping-cart'
                type='font-awesome'
                color='#FFF'
                size={35}
              />
        {this.state.isSale && 
          (<View>
          <TouchableOpacity onPress={this.goSaleScreen}>
            <View style={styles.mainIcon}>
              <Icon
                name='shopping-cart'
                type='font-awesome'
                color='#FFF'
                size={35}
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
                  size={35}
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
                size={35}
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
                  size={35}
                />
                </View>
              <Text style={styles.mainButton}>Gastos</Text>
            </TouchableOpacity>
            </View>)}
            <Icon
                name='money'
                type='font-awesome'
                color='#FFF'
                size={35}
              />
          <TouchableOpacity onPress={this.goDictionary}>
            <View style={styles.mainIcon}>
              <Icon
                name='book'
                type='font-awesome'
                color='#FFF'
                size={35}
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
    maxWidth: "90%"
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
  modalNavBarButtons: {
    backgroundColor:"#FFF", 
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
  dictionaryKeys: {
    fontSize: 20,
    textAlign: "justify",
    paddingTop: 15,
    color: "#000",
    width:"90%",
    fontWeight: 'bold',
  },
  dictionaryValues: {
    fontSize: 20,
    textAlign: "justify",
    paddingTop: 15,
    color: "#000",
    width:"90%",
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
  listening: {
    textAlign: 'center',
    color: '#1B5E8B',
    fontWeight: 'bold',
    fontSize: 20
  },
  showTitle:{
    textAlign: 'center',
    color: '#154360',
    fontWeight: 'bold',
    fontSize: 20,
    width: "90%",
    paddingBottom: 20,
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
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
  microIcon: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
  galleryIcon: {
    backgroundColor: "#FFF",
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
    paddingLeft: 10,
    backgroundColor:"#FFF", 
    justifyContent: 'flex-end',
  },
  exitButton: {
    fontSize: 17,
    textAlign: "center",
    fontWeight: 'bold',
    color: "#B03A2E",
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 50,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});