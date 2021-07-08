import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, FlatList, BackHandler, ScrollView, Modal, Dimensions, PermissionsAndroid} from 'react-native';
import Voice from 'react-native-voice';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import ImageZoom from 'react-native-image-pan-zoom';

class ResumeViewScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.navigation.state.params.id,
      entity: this.props.navigation.state.params.entity,
      interpretedEntity: this.props.navigation.state.params.entity,
      nif: this.props.navigation.state.params.nif,
      interpretedNif: this.props.navigation.state.params.nif,
      date: this.props.navigation.state.params.date,
      interpretedDate: this.props.navigation.state.params.date,
      invoice: this.props.navigation.state.params.invoice,
      interpretedInvoice: this.props.navigation.state.params.invoice,
      total: this.props.navigation.state.params.total,
      interpretedTotal: this.props.navigation.state.params.total,
      images: this.props.navigation.state.params.images,
      back: this.props.navigation.state.params.back,
      type: this.props.navigation.state.params.type,
      flatlistPos: 0,
      words: []
    }
    this.init()
  }

  async init() {
    await AsyncStorage.getItem("words").then((value) => {
      if (value != null) {
        this.setState({ words: JSON.parse(value) })
      }
    })
  }
  
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  goBack = () => {
    this.props.navigation.push(this.state.type)
    return true
  }

  async resetState() {
    var prep = ""
    if (this.state.type == "Buy") {
      prep = "b."
    }
    await AsyncStorage.setItem(prep+"entity", "")
    await AsyncStorage.setItem(prep+"nif", "")
    await AsyncStorage.setItem(prep+"date", "")
    await AsyncStorage.setItem(prep+"invoice", "")
    await AsyncStorage.setItem(prep+"total", "")
    await AsyncStorage.setItem(prep+"interpretedEntity", "")
    await AsyncStorage.setItem(prep+"interpretedNif", "")
    await AsyncStorage.setItem(prep+"interpretedDate", "")
    await AsyncStorage.setItem(prep+"interpretedInvoice", "")
    await AsyncStorage.setItem(prep+"interpretedTotal", "")
    await AsyncStorage.setItem(prep+"images", JSON.stringify([]))
    await AsyncStorage.setItem(prep+"saved", JSON.stringify(false))
    await AsyncStorage.setItem(prep+"setEntity", JSON.stringify(false))
    await AsyncStorage.setItem(prep+"setNIF", JSON.stringify(false))
    await AsyncStorage.setItem(prep+"setDate", JSON.stringify(false))
    await AsyncStorage.setItem(prep+"setInvoice", JSON.stringify(false))
    await AsyncStorage.setItem(prep+"setTotal", JSON.stringify(false))
    this.goBack()
  }

  async delete() {
    await AsyncStorage.setItem("isBuy", JSON.stringify(false))
    this.resetState()
    var prep = ""
    if (this.state.back == "Buy") {
      prep = "b."
    }
    await AsyncStorage.setItem(prep+"entity", "")
    await AsyncStorage.setItem(prep+"nif", "")
    await AsyncStorage.setItem(prep+"date", "")
    await AsyncStorage.setItem(prep+"invoice", "")
    await AsyncStorage.setItem(prep+"total", "")
    await AsyncStorage.setItem(prep+"interpretedEntity", "")
    await AsyncStorage.setItem(prep+"interpretedNif", "")
    await AsyncStorage.setItem(prep+"interpretedDate", "")
    await AsyncStorage.setItem(prep+"interpretedInvoice", "")
    await AsyncStorage.setItem(prep+"interpretedTotal", "")
    await AsyncStorage.setItem(prep+"images", JSON.stringify([]))
    await AsyncStorage.setItem(prep+"saved", JSON.stringify(false))
    await AsyncStorage.setItem(prep+"setEntity", JSON.stringify(false))
    await AsyncStorage.setItem(prep+"setNIF", JSON.stringify(false))
    await AsyncStorage.setItem(prep+"setDate", JSON.stringify(false))
    await AsyncStorage.setItem(prep+"setInvoice", JSON.stringify(false))
    await AsyncStorage.setItem(prep+"setTotal", JSON.stringify(false))
    this.goBack()
  }

  seeImage (image) {
    this.props.navigation.push('ImageViewer', {
      id: this.state.id,
      entity: this.state.entity,
      interpretedEntity: this.state.interpretedEntity,
      nif: this.state.nif,
      interpretedNif: this.state.interpretedNif,
      date: this.state.date,
      interpretedDate: this.state.interpretedDate,
      invoice: this.state.invoice,
      interpretedInvoice: this.state.interpretedInvoice,
      total: this.state.total,
      interpretedTotal: this.state.interpretedTotal,
      images: this.state.images,
      image: image,
      back: this.state.back,
      type: this.state.type
    })
  }

  setFlatlistPos(i) {
    this.setState({ flatlistPos: i })
  }

  setFlatlistButtons(pos) {
    var result = []
    for (let i = 0; i < this.state.images.length; i++) {
      if (pos == i) {
        this.setImageZoom(this.state.images[pos])
        result.push(<View style={styles.roundButtonsView}><Text
          style={styles.roundButton}>
        </Text></View>)
      } else {
        this.setImageZoom(this.state.images[i])
        result.push(<View style={styles.roundButtonsView}><Text
          style={styles.focusRoundButton}>
        </Text></View>)
      }
    }
    return (<View style={styles.flatlistView}>{result}</View>)
  }
  
  setImageZoom(item) {
    return (
      <ImageZoom
        cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height/1.5}
        imageWidth={Dimensions.get('window').width}
        imageHeight={Dimensions.get('window').height/1.5}>
          <TouchableOpacity onPress={() => this.seeImage(item)}>
          <Image
            source={{
              uri: item.uri.replace(/['"]+/g, ''),
            }}
            resizeMode="cover"
            key={item}
            style={{ width: Dimensions.get('window').width, height: (Dimensions.get('window').height)/1.5, aspectRatio: 1 }}
          />
          </TouchableOpacity>
      </ImageZoom>)
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
            renderItem={({ item, index }) => (
              (<View>
                {this.setImageZoom(item)}
                { this.state.images.length > 1 && this.setFlatlistButtons(index)}
              </View>) 
            )}
        />
        </View>
      </View>)
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
            <TextInput multiline={true} style={styles.changeTranscript} onChangeText={interpretedEntity => this.setState({interpretedEntity})}>{this.state.interpretedEntity}</TextInput>
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
            <TextInput multiline={true} style={styles.changeTranscript} onChangeText={interpretedNif => this.setState({interpretedNif})}>{this.state.interpretedNif}</TextInput>
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
              <TextInput multiline={true} style={styles.changeTranscript} onChangeText={interpretedDate => this.setState({interpretedDate})}>{this.state.interpretedDate}</TextInput>
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
              <TextInput multiline={true} style={styles.changeTranscript} onChangeText={interpretedInvoice => this.setState({interpretedInvoice})}>{this.state.interpretedInvoice}</TextInput>
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
              <TextInput multiline={true} style={styles.changeTranscript} onChangeText={interpretedTotal => this.setState({interpretedTotal})}>{this.state.interpretedTotal}</TextInput>
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

  async saveWord(key, value) {
    var entered = false
    var arrayWords =  this.state.words
    for (let i = 0; i < this.state.words.length; i++) {
      if (this.state.words[i].key.toLowerCase() == key.toLowerCase()) {
        entered = true
      }
    }
    if (!entered) {
      arrayWords.push({
        key: key,
        value: value,
        time: new Date().getTime()
      })
      this.setState({ words: arrayWords })
      await AsyncStorage.setItem("words", JSON.stringify(arrayWords))
    }
  }

  async askDictionary(key, value) {
    const AsyncAlert = () => new Promise((resolve) => {
      Alert.alert(
        "Atención",
        "¿Desea almacenar en el diccionario " + value + " para " + key + "?",
        [
          {
            text: 'Sí',
            onPress: () => {
              resolve(this.saveWord(key,value));
            },
          },
          {
            text: 'No',
            onPress: () => {
              resolve();
            },
          },
        ],
        { cancelable: false },
      );
      });
      await AsyncAlert();
  }

  _save = async () => {
    if (this.state.entity == this.state.interpretedEntity && this.state.nif == this.state.interpretedNif
      && this.state.date == this.state.interpretedDate && this.state.invoice == this.state.interpretedInvoice && 
      this.state.total == this.state.interpretedTotal) {
        alert("Esta accion todavía no está activada")
    }
    if (this.state.entity != this.state.interpretedEntity) {
      this.setState({ entity: this.state.interpretedEntity})
      await AsyncStorage.setItem("interpretedEntity", this.state.interpretedEntity)
    }
    if (this.state.nif != this.state.interpretedNif) {
      await this.askDictionary(this.state.nif,this.state.interpretedNif)
      this.setState({ nif: this.state.interpretedNif})
    }
    if (this.state.date != this.state.interpretedDate) {
      await this.askDictionary(this.state.date,this.state.interpretedDate)
      this.setState({ date: this.state.interpretedDate})
    }
    if (this.state.invoice != this.state.interpretedInvoice) {
      await this.askDictionary(this.state.invoice,this.state.interpretedInvoice)
      this.setState({ invoice: this.state.interpretedInvoice})
    }
    if (this.state.total != this.state.interpretedTotal) {
      await this.askDictionary(this.state.total,this.state.interpretedTotal)
      this.setState({ total: this.state.interpretedTotal})
    }
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor:"#FFF", paddingBottom: 100 }}>
        <View style={styles.navBarBackHeader}>
        <View style={{ width: 70,textAlign:'center' }}>
            <Icon
              name='trash'
              type='font-awesome'
              color='#FFF'
              size={30}
              onPress={this._delete}
            />
          </View>
          <Text style={styles.navBarHeader}>Documento generado</Text>
          <View style={{ width: 70,textAlign:'center' }}>
            <Icon
              name='save'
              type='font-awesome'
              color='#FFF'
              size={30}
              onPress={this._save}
            />
          </View>
        </View>
        <ScrollView style={{backgroundColor: "#FFF"}}>
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
        this.setState({ words: JSON.parse(value).reverse() })
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

  async pushArrayWords() {
    var arrayWords =  this.state.words
    if (!this.state.words.some(item => item.key.toLowerCase() === this.state.addKey.toLowerCase())) {
      arrayWords.push({
        key: this.state.addKey,
        value: this.state.addValue,
        time: new Date().getTime()
      })
    } else {
      var i = arrayWords.findIndex(obj => obj.key.toLowerCase() === this.state.addKey.toLowerCase());
      arrayWords[i].value = this.state.addValue
      arrayWords[i].time = new Date().getTime()
    }
    this.setState({ words: arrayWords })
    await AsyncStorage.setItem("words", JSON.stringify(arrayWords))
  }

  _addWord = async () => {
    if (this.state.addKey == "" || this.state.addValue == "") {
      this.showAlert("Error", "Complete todos los campos")
    } else {
      await this.pushArrayWords()
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
                  size={30}
                />
              </TouchableOpacity>
          </View>
          <Text style={styles.resumeText}>Palabra: </Text>
          <TextInput value={this.state.addKey} multiline={true} style={styles.changeTranscript} placeholder="Macro" onChangeText={addKey => this.setState({addKey})}></TextInput>
        
          <Text style={styles.resumeText}>Valor que debe tomar: </Text>
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

  async askDelete(item) {
    const AsyncAlert = () => new Promise((resolve) => {
      Alert.alert(
        "Eliminar palabra",
        "¿Desea eliminar esta palabra del diccionario definitivamente?",
        [
          {
            text: 'Sí',
            onPress: () => {
              resolve(this.deleteWord(item));
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


  deleteWord = async (item) => {
    var arrayWords = []
    for (let i = 0; i < this.state.words.length; i++) {
      if ( this.state.words[i].key != item.key) {
        arrayWords.push({
          key: this.state.words[i].key,
          value: this.state.words[i].value,
          time: this.state.words[i].time
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
          data={ this.state.words.sort((a,b) => a.time < b.time) } 
          renderItem={({ item }) => (
            <View style={{paddingBottom: 20}}>
            <View style={styles.wordsBox}>
            <Text style={styles.wordsBoxText}>
            <Text style={styles.dictionaryKeys}>Palabra: </Text> 
            <Text style={styles.dictionaryValues}>{item.key}</Text> 
            </Text>
            <Text style={styles.wordsBoxText}>
            <Text style={styles.dictionaryKeys}>Valor: </Text> 
            <Text style={styles.dictionaryValues}>{item.value}</Text>    
            </Text>   
            <View style={styles.delIcon}>            
              <TouchableOpacity onPress={() => this.askDelete(item)}>
                <Icon
                  name='trash'
                  type='font-awesome'
                  color='#B03A2E'
                  size={28}
                />
              </TouchableOpacity>
            </View>
            </View>
          </View>
        )}
      />
      </View>
      )
    }
    return (<View style={styles.resumeView}>
      <Text style={styles.showTitle}>No ha registrado ningún dato</Text>
      <Text style={styles.showTitle}>Pulse + para empezar</Text>
      </View>)
  }

  saveDocument() {
    console.log("saveDocument")
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{backgroundColor: "#fff"}}>
        {this.setMenu()}
        <View style={{paddingBottom: 50}}>
          {this.setMenuButtons()}
          {this.setWords()}
        </View>
        </ScrollView>
      </View>
    );
  }
}


class ImageViewerScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.navigation.state.params.id,
      entity: this.props.navigation.state.params.entity,
      interpretedEntity: this.props.navigation.state.params.interpretedEntity,
      nif: this.props.navigation.state.params.nif,
      interpretedNif: this.props.navigation.state.params.interpretedNif,
      date: this.props.navigation.state.params.date,
      interpretedDate: this.props.navigation.state.params.interpretedDate,
      invoice: this.props.navigation.state.params.invoice,
      interpretedInvoice: this.props.navigation.state.params.interpretedInvoice,
      total: this.props.navigation.state.params.total,
      interpretedTotal: this.props.navigation.state.params.interpretedTotal,
      images: this.props.navigation.state.params.images,
      image: this.props.navigation.state.params.image,
      back: this.props.navigation.state.params.back,
      type: this.props.navigation.state.params.type,
    }
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  goBack = () => {
    if (this.state.back == "Buy" || this.state.back == "Sales" || this.state.back == "Pay") {
      this.props.navigation.push(this.state.back)
    } else if (this.state.images == 0 && this.state.interpretedEntity.length == 0) {
        this.props.navigation.push(this.state.type)
    } else {
        this.props.navigation.push("ResumeView", {
          id: this.state.id,
          entity: this.state.entity,
          interpretedEntity: this.state.interpretedEntity,
          nif: this.state.nif,
          interpretedNif: this.state.interpretedNif,
          date: this.state.date,
          interpretedDate: this.state.interpretedDate,
          invoice: this.state.invoice,
          interpretedInvoice: this.state.interpretedInvoice,
          total: this.state.total,
          interpretedTotal: this.state.interpretedTotal,
          images: this.state.images,
          back: this.state.back,
          type: this.state.type,
        })
      }
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
    await AsyncStorage.setItem("b.images", JSON.stringify([]))
    await AsyncStorage.setItem("b.images", JSON.stringify(arrayImages))
  }

  takePhoto = async() =>{
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "ContaVoz",
          message:"Se necesita acceder a su cámara",
          buttonNegative: "Cancelar",
          buttonPositive: "Aceptar"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        let options = {
          title: 'Hacer una foto',
          customButtons: [
            { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
          ],
          storageOptions: {
            skipBackup: true,
            path: 'images',
            privateDirectory: true,
          },
        };
        if (this.state.images.length <= 9) {
          ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel || response.error || response.customButton) {
              console.log(JSON.stringify(response));
            } else {
              var uri = JSON.stringify(response.assets[0]["uri"])
              this.updateImage(uri)
            }
          })
        } else {
          this.showAlert("Error", "Solo puede adjuntar 10 imágenes")
        }
      }
    } catch (err) {
    console.log(err);
    }
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
    if (this.state.images.length <= 9) {
      ImagePicker.launchImageLibrary(options, (response) => {
        if (response.didCancel || response.error || response.customButton) {
          console.log('Something happened');
        } else {
          var uri = JSON.stringify(response.assets[0]["uri"])
          this.updateImage(uri)
        }
      })
    } else {
      this.showAlert("Error", "Solo puede adjuntar 10 imágenes")
    }
  }

  async delete() {
    var arrayImages = []
    for (let i = 0; i < this.state.images.length; i++) {
      if (this.state.images[i].id != this.state.image.id) {
        arrayImages.push({
          id:  this.state.image.id + "_" + i,
          uri: this.state.images[i].uri
        })
      }
    }
    await AsyncStorage.setItem("b.images", JSON.stringify([]))
    await AsyncStorage.setItem("b.images", JSON.stringify(arrayImages))
    this.setState({images: arrayImages})
    if (this.state.images.length == 0) {
      this.props.navigation.push(this.state.type)
    } else {
      this.goBack()
    }
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

  setImageZoom() {
    return (
      <ImageZoom
      cropWidth={Dimensions.get('window').width}
      cropHeight={Dimensions.get('window').height}
      imageWidth={Dimensions.get('window').width}
      imageHeight={Dimensions.get('window').height}>
      <Image
        source={{
          uri: this.state.image.uri.replace(/['"]+/g, '')
        }}
        resizeMode="center"
        key={this.state.image}
        style={{ width: "100%", height: "100%" }}
      />
      </ImageZoom>
    )
  }

  render () {
    return (
      <View style={styles.imageView}>
        <View style={styles.selectedImageView}>
        {this.setImageZoom()}
      </View>
        <View style={styles.darkFootBar}>
          <Icon
              name='camera'
              type='font-awesome'
              color='#FFF'
              size={30}
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
              size={30}
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
              size={30}
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
      words: [],
      flatlistPos: 0,
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
    await AsyncStorage.getItem("b.saved").then((value) => {
      if (value != null) {
        this.setState({ saved: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("b.images").then((value) => {
      if (value != null) {
        this.setState({ images: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("b.setEntity").then((value) => {
      if (value != null) {
        this.setState({ setEntity: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("b.setNIF").then((value) => {
      if (value != null) {
        this.setState({ setNIF: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("b.setDate").then((value) => {
      if (value != null) {
        this.setState({ setDate: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("b.setInvoice").then((value) => {
      if (value != null) {
        this.setState({ setInvoice: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("b.setTotal").then((value) => {
      if (value != null) {
        this.setState({ setTotal: JSON.parse(value) })
      }
    })
    await AsyncStorage.getItem("b.entity").then((value) => {
      if (value != null) {
        this.setState({ entity: value })
      }
    })
    await AsyncStorage.getItem("b.interpretedEntity").then((value) => {
      if (value != null) {
        this.setState({ interpretedEntity: value })
      }
    })
    await AsyncStorage.getItem("b.nif").then((value) => {
      if (value != null) {
        this.setState({ nif: value })
      }
    })
    await AsyncStorage.getItem("b.interpretedNif").then((value) => {
      if (value != null) {
        this.setState({ interpretedNif: value })
      }
    })
    await AsyncStorage.getItem("b.date").then((value) => {
      if (value != null) {
        this.setState({ date: value })
      }
    })
    await AsyncStorage.getItem("b.interpretedDate").then((value) => {
      if (value != null) {
        this.setState({ interpretedDate: value })
      }
    })
    await AsyncStorage.getItem("b.invoice").then((value) => {
      if (value != null) {
        this.setState({ invoice: value })
      }
    })
    await AsyncStorage.getItem("b.interpretedInvoice").then((value) => {
      if (value != null) {
        this.setState({ interpretedInvoice: value })
      }
    })
    await AsyncStorage.getItem("b.total").then((value) => {
      if (value != null) {
        this.setState({ total: value })
      }
    })
    await AsyncStorage.getItem("b.interpretedTotal").then((value) => {
      if (value != null) {
        this.setState({ interpretedTotal: value })
      }
    })
    await AsyncStorage.getItem("b.id").then((value) => {
      if (value != null) {
        this.setState({ id: value })
      }
    })
    await AsyncStorage.getItem("words").then((value) => {
      if (value != null) {
        this.setState({ words: JSON.parse(value) })
      }
    })
    if (this.state.images.length == 0 && !JSON.parse(this.state.setEntity)) {
      await AsyncStorage.setItem("isBuy", JSON.stringify(false))
    }
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
    this.saveInMemory("b.interpretedEntity", this.state.interpretedEntity)
  }

  setInterpretedNif() {
    var str = this.state.nif 
    for (let i = 0; i < this.state.words.length; i++) {
      if (this.state.nif.toLowerCase().includes(this.state.words[i].key.toLowerCase())) {
        str = str.toLocaleLowerCase().replace(this.state.words[i].key.toLocaleLowerCase(), this.state.words[i].value)
      }
    }
    this.setState({ interpretedNif: str })
    this.saveInMemory("b.interpretedNif", this.state.interpretedNif)
  }

  setInterpretedDate() {
    var str = this.state.date
    for (let i = 0; i < this.state.words.length; i++) {
      if (this.state.date.toLowerCase().includes(this.state.words[i].key.toLowerCase())) {
        str = str.toLocaleLowerCase().replace(this.state.words[i].key.toLocaleLowerCase(), this.state.words[i].value)
      }
    }
    this.setState({ interpretedDate: str })
    this.saveInMemory("b.interpretedDate", this.state.interpretedDate)
  }

  setInterpretedInvoice() {
    var str = this.state.invoice
    for (let i = 0; i < this.state.words.length; i++) {
      if (this.state.invoice.toLowerCase().includes(this.state.words[i].key.toLowerCase())) {
        str = str.toLocaleLowerCase().replace(this.state.words[i].key.toLocaleLowerCase(), this.state.words[i].value)
      }
    }
    this.setState({ interpretedInvoice: str })
    this.saveInMemory("b.interpretedInvoice", this.state.interpretedInvoice)
  }

  setInterpretedTotal() {
    var str = this.state.total
    for (let i = 0; i < this.state.words.length; i++) {
      if (this.state.total.toLowerCase().includes(this.state.words[i].key.toLowerCase())) {
        str = str.toLocaleLowerCase().replace(this.state.words[i].key.toLocaleLowerCase(), this.state.words[i].value)
      }
    }
    this.setState({ interpretedTotal: str })
    this.saveInMemory("b.interpretedTotal", this.state.interpretedTotal)
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
            color='#FFF'
            size={30}
            onPress={this._stopRecognition.bind(this)}
          />
    }
    return <Icon
      name='microphone'
      type='font-awesome'
      color='#FFF'
      size={30}
      onPress={this._startRecognition.bind(this)}
    />
  }

  async storeTotalInDictionary() {
    var arrayWords =  this.state.words
    if (!this.state.words.some(item => item.key.toLowerCase() === this.state.total.toLowerCase())) {
      arrayWords.push({
        key: this.state.total,
        value: this.state.interpretedTotal,
        time: new Date().getTime()
      })
    } else {
      var i = arrayWords.findIndex(obj => obj.key.toLowerCase() === this.state.total.toLowerCase());
      arrayWords[i].value = this.state.interpretedTotal
    }
    this.setState({ words: arrayWords })
    await AsyncStorage.setItem("words", JSON.stringify(arrayWords))
    this.storeInvoice()
  }

  async storeInvoiceInDictionary() {
    var arrayWords =  this.state.words
    if (!this.state.words.some(item => item.key.toLowerCase() === this.state.invoice.toLowerCase())) {
      arrayWords.push({
        key: this.state.invoice,
        value: this.state.interpretedInvoice,
        time: new Date().getTime()
      })
    } else {
      var i = arrayWords.findIndex(obj => obj.key.toLowerCase() === this.state.invoice.toLowerCase());
      arrayWords[i].value = this.state.interpretedInvoice
    }
    this.setState({ words: arrayWords })
    await AsyncStorage.setItem("words", JSON.stringify(arrayWords))
    this.storeInvoice()
  }

  async storeDateInDictionary() {
    var arrayWords =  this.state.words
    if (!this.state.words.some(item => item.key.toLowerCase() === this.state.date.toLowerCase())) {
      arrayWords.push({
        key: this.state.date,
        value: this.state.interpretedDate,
        time: new Date().getTime()
      })
    } else {
      var i = arrayWords.findIndex(obj => obj.key.toLowerCase() === this.state.date.toLowerCase());
      arrayWords[i].value = this.state.interpretedDate
    }
    this.setState({ words: arrayWords })
    await AsyncStorage.setItem("words", JSON.stringify(arrayWords))
    this.storeDate()
  }

  async storeNifInDictionary() {
    var arrayWords =  this.state.words
    if (!this.state.words.some(item => item.key.toLowerCase() === this.state.nif.toLowerCase())) {
      arrayWords.push({
        key: this.state.nif,
        value: this.state.interpretedNif,
        time: new Date().getTime()
      })
    } else {
      var i = arrayWords.findIndex(obj => obj.key.toLowerCase() === this.state.nif.toLowerCase());
      arrayWords[i].value = this.state.interpretedNif
    }
    this.setState({ words: arrayWords })
    await AsyncStorage.setItem("words", JSON.stringify(arrayWords))
    this.storeNif()
  }

  async storeEntityInDictionary() {
    var arrayWords =  this.state.words
    if (!this.state.words.some(item => item.key.toLowerCase() === this.state.entity.toLowerCase())) {
      arrayWords.push({
        key: this.state.entity,
        value: this.state.interpretedEntity,
        time: new Date().getTime()
      })
    } else {
      var i = arrayWords.findIndex(obj => obj.key.toLowerCase() === this.state.entity.toLowerCase());
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
              resolve(this.storeDate());
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
              resolve(this.storeNif());
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
    this.saveInMemory("b.setEntity", JSON.stringify(true))
    this.saveInMemory("isBuy", JSON.stringify(true))
    this.saveInMemory("b.entity", this.state.entity)
    this.saveInMemory("b.interpretedEntity", this.state.interpretedEntity)
    this.setState({is_recording: true})
    this._continue()
  }

  async storeNif() {
    this.setState({setNIF: true})
    this.saveInMemory("b.setNIF", JSON.stringify(true))
    this.saveInMemory("b.nif", this.state.nif)
    this.saveInMemory("b.interpretedNif", this.state.interpretedNif)
    this.setState({is_recording: true})
    this._continue()
  }

  async storeDate() {
    this.setState({setDate: true})
    this.saveInMemory("b.setDate", JSON.stringify(true))
    this.saveInMemory("b.date", this.state.date)
    this.saveInMemory("b.interpretedDate", this.state.interpretedDate)
    this.setState({is_recording: true})
    this._continue()
  }

  async storeInvoice() {
    this.setState({setInvoice: true})
    this.saveInMemory("b.setInvoice", JSON.stringify(true))
    this.setState({is_recording: true})
    this.saveInMemory("b.invoice", this.state.invoice)
    this.saveInMemory("b.interpretedInvoice", this.state.interpretedInvoice)
    this._continue()
  }

  async storeTotal() {
    this.setState({setTotal: true})
    this.saveInMemory("b.setTotal", JSON.stringify(true))
    this.saveInMemory("b.total", this.state.total)
    this.saveInMemory("b.interpretedTotal", this.state.interpretedTotal)
    this.setState({saved: true})
    this.saveInMemory("b.saved", JSON.stringify(true))
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
    this.saveInMemory("b.saved", JSON.stringify(false))
    this._startRecognition()
  }

  setEntity = async() => {
    await AsyncStorage.getItem("b.interpretedEntity").then((value) => {
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
    await AsyncStorage.getItem("b.interpretedNif").then((value) => {
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
    await AsyncStorage.getItem("b.interpretedDate").then((value) => {
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
    await AsyncStorage.getItem("b.interpretedInvoice").then((value) => {
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
    await AsyncStorage.getItem("b.interpretedTotal").then((value) => {
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
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "ContaVoz",
            message:"Se necesita acceder a su cámara",
            buttonNegative: "Cancelar",
            buttonPositive: "Aceptar"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          let options = {
            title: 'Hacer una foto',
            customButtons: [
              { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
            ],
            storageOptions: {
              skipBackup: true,
              path: 'images',
              privateDirectory: true,
            },
          };
          if (this.state.images.length <= 9) {
            ImagePicker.launchCamera(options, (response) => {
              if (response.didCancel || response.error || response.customButton) {
                console.log(JSON.stringify(response));
              } else {
                var arrayImages = this.state.images
                var newID = this.state.id+"_"+(this.state.images.length+1)
                var uri = JSON.stringify(response.assets[0]["uri"])
                arrayImages.push({
                  id: newID,
                  uri: uri
                })
                this.setState({images: arrayImages})
                this.saveInMemory("isBuy", JSON.stringify(true))
                this.saveInMemory("b.images", JSON.stringify(arrayImages))
              }
            })
          } else {
            this.showAlert("Error", "Solo puede adjuntar 10 imágenes")
          }
        }
      } catch (err) {
      console.log(err);
    }
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
    if (this.state.images.length <= 9) {
      ImagePicker.launchImageLibrary(options, (response) => {
        if (response.didCancel || response.error || response.customButton) {
          console.log('Something happened');
        } else {
          var arrayImages = this.state.images
          var uri = JSON.stringify(response.assets[0]["uri"])
          var newID = this.state.id+"_"+(this.state.images.length+1)
          arrayImages.push({
            id: newID,
            uri: uri
          })
          this.setState({images: arrayImages})
          this.saveInMemory("isBuy", JSON.stringify(true))
          this.saveInMemory("b.images", JSON.stringify(arrayImages))
        }
      })
    } else {
      this.showAlert("Error", "Solo puede adjuntar 10 imágenes")
    }
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
    await AsyncStorage.setItem("isBuy", JSON.stringify(false))
    await AsyncStorage.setItem("b.entity", "")
    await AsyncStorage.setItem("b.nif", "")
    await AsyncStorage.setItem("b.date", "")
    await AsyncStorage.setItem("b.invoice", "")
    await AsyncStorage.setItem("b.total", "")
    await AsyncStorage.setItem("b.interpretedEntity", "")
    await AsyncStorage.setItem("b.interpretedNif", "")
    await AsyncStorage.setItem("b.interpretedDate", "")
    await AsyncStorage.setItem("b.interpretedInvoice", "")
    await AsyncStorage.setItem("b.interpretedTotal", "")
    await AsyncStorage.setItem("b.images", JSON.stringify([]))
    await AsyncStorage.setItem("b.saved", JSON.stringify(false))
    await AsyncStorage.setItem("b.setEntity", JSON.stringify(false))
    await AsyncStorage.setItem("b.setNIF", JSON.stringify(false))
    await AsyncStorage.setItem("b.setDate", JSON.stringify(false))
    await AsyncStorage.setItem("b.setInvoice", JSON.stringify(false))
    await AsyncStorage.setItem("b.setTotal", JSON.stringify(false))
    this.props.navigation.push("Buy")
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

  setFlatlistPos(i) {
    this.setState({ flatlistPos: i })
  }

  setFlatlistButtons(pos) {
    var result = []
    for (let i = 0; i < this.state.images.length; i++) {
      if (pos == i) {
        result.push(<View style={styles.roundButtonsView}><Text style={styles.roundButton}></Text></View>)
      } else {
        result.push(<View style={styles.roundButtonsView}><Text style={styles.focusRoundButton}></Text></View>)
      }
    }
    return (<View style={styles.flatlistView}>{result}</View>)
  }

  seeImage (image) {
    this.props.navigation.push('ImageViewer', {
      id: this.state.id,
      entity: this.state.entity,
      interpretedEntity: this.state.interpretedEntity,
      nif: this.state.nif,
      interpretedNif: this.state.interpretedNif,
      date: this.state.date,
      interpretedDate: this.state.interpretedDate,
      invoice: this.state.invoice,
      interpretedInvoice: this.state.interpretedInvoice,
      total: this.state.total,
      interpretedTotal: this.state.interpretedTotal,
      images: this.state.images,
      image: image,
      back: "Buy",
      type: "Buy",
    })
  }

  setImageZoom(item) {
    return (
      <ImageZoom
        cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height/1.5}
        imageWidth={Dimensions.get('window').width}
        imageHeight={Dimensions.get('window').height/1.5}>
          <TouchableOpacity onPress={() => this.seeImage(item)}>
          <Image
            source={{
              uri: item.uri.replace(/['"]+/g, ''),
            }}
            resizeMode="cover"
            key={item}
            style={{ width: Dimensions.get('window').width, height: (Dimensions.get('window').height)/1.5, aspectRatio: 1 }}
          />
          </TouchableOpacity>
      </ImageZoom>)
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
            renderItem={({ item, index }) => (
              (<View>
               {this.setImageZoom(item)}
              {this.state.images.length > 1 && this.setFlatlistButtons(index)}
              </View>) 
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
          style={{ width: 100, height: 100 }}
      />
      </TouchableOpacity>
      </View>
    )
  }

  setTotalModal() {
    return(
      <Modal
        animationType = {"slide"}
        transparent={true}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Total</Text>
            <View style={styles.textForm}>
                <Text style={styles.resumeText}>Texto escuchado</Text>
                <Text multiline={true} style={styles.transcript}>{this.state.total}</Text>
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
      </Modal>
    )
  }

  setInvoiceModal(){
    return(
      <Modal
        animationType = {"slide"}
        transparent={true}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Nº Factura</Text>
            <View style={styles.textForm}>
                <Text style={styles.resumeText}>Texto escuchado</Text>
                <Text multiline={true} style={styles.transcript}>{this.state.invoice}</Text>
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
      </Modal>
    )
  }

  setDateModal() {
    return(
      <Modal
        animationType = {"slide"}
        transparent={true}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Fecha</Text>
            <View style={styles.textForm}>
                <Text style={styles.resumeText}>Texto escuchado</Text>
                <Text multiline={true} style={styles.transcript}>{this.state.date}</Text>
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
      </Modal>
    )
  }

  setNIFModal() {
    return(<Modal
      animationType = {"slide"}
      transparent={true}>
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>NIF</Text>
          <View style={styles.textForm}>
              <Text style={styles.resumeText}>Texto escuchado</Text>
              <Text multiline={true} style={styles.transcript}>{this.state.nif}</Text>
              <Text style={styles.resumeText}>Texto interpretado </Text>
              <View style={{flexDirection:'row', width:"90%"}}>
                <TextInput multiline={true} style={styles.changeTranscript} onChangeText={(interpretedNif) => this.setState({interpretedNif})}>{this.state.interpretedNif}</TextInput>
                <Icon
                  name='pencil'
                  type='font-awesome'
                  color='#000'
                  size={30}
                />
                </View>
                <Text style={styles.transcript}></Text>
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


  setEntityModal() {
    return(
      <Modal
            animationType = {"slide"}
            transparent={true}>
              <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <Text style={styles.listening}>Entidad</Text>
              <View style={styles.textForm}>
                <Text style={styles.resumeText}>Texto escuchado</Text>
                <Text multiline={true} style={styles.transcript}>{this.state.entity}</Text>
                <Text style={styles.resumeText}>Texto interpretado</Text>
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
              </ScrollView>
            </View>
          </View>
        </Modal>)
  }

  setEntityVoiceControl() {
    if (this.state.started.length>0 && this.state.entity.length == 0 && JSON.parse(this.state.is_recording)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.listening}>Diga el nombre de su entidad</Text>
      </View>)
    }
    if (JSON.parse(this.state.getEntity) && !JSON.parse(this.state.setEntity)) {
      return (this.setEntityModal())
    } 
    return null
  }

  setNIFVoiceControl() {
    if (JSON.parse(this.state.is_recording) && this.state.nif.length==0 && JSON.parse(this.state.setEntity) && !JSON.parse(this.state.getNIF)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.listening}>Diga su NIF</Text>
      </View>)
    }
    if (JSON.parse(this.state.getNIF) && !JSON.parse(this.state.setNIF)) {
      return (this.setNIFModal())
    } 
    return null
  }

  setDateVoiceControl() {
    if (JSON.parse(this.state.is_recording) && this.state.date.length==0 && JSON.parse(this.state.setNIF) && !JSON.parse(this.state.getDate)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.listening}>Diga su fecha</Text>
      </View>)
    }
    if (JSON.parse(this.state.getDate) && !JSON.parse(this.state.setDate)) {
      return (this.setDateModal())
    } 
    return null
  }

  setInvoiceVoiceControl() {
    if (JSON.parse(this.state.is_recording) && this.state.invoice.length==0 && JSON.parse(this.state.setDate) && !JSON.parse(this.state.getInvoice)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.listening}>Diga su nº factura</Text>
      </View>)
    }
    if (JSON.parse(this.state.getInvoice) && !JSON.parse(this.state.setInvoice)) {
      return (this.setInvoiceModal())
    } 
    return null
  }

  setTotalVoiceControl() {
    if (JSON.parse(this.state.is_recording) && this.state.total.length==0 && JSON.parse(this.state.setInvoice) && !JSON.parse(this.state.getTotal)) {
      return (<View style={styles.voiceControlView}>
        <Text style={styles.listening}>Diga su total</Text>
      </View>)
    }
    if (this.state.total.length>0 && !JSON.parse(this.state.saved)) {
      return (this.setTotalModal())
    } 
    return null
  }

  startProgramm() {
    if (!JSON.parse(this.state.is_recording) && this.state.images.length == 0 && !JSON.parse(this.state.setEntity)) {
      return(
        <View style={styles.resumeView}>
          <Text style={styles.showTitle}>Para empezar debe adjuntar una imagen o pulsar el micrófono</Text>
        </View>
      )
    } else if (!JSON.parse(this.state.is_recording) && JSON.parse(this.state.setEntity) && !JSON.parse(this.state.setTotal)) {
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
      id: this.state.id,
      entity: this.state.interpretedEntity,
      nif: this.state.interpretedNif,
      date: this.state.interpretedDate,
      invoice: this.state.interpretedInvoice,
      total: this.state.interpretedTotal,
      images: this.state.images,
      back: "ResumeView",
      type: "Buy"
    })
  }

  setBottomMenu() {
    return (
      <View style={styles.footBar}>
      <View style={styles.iconsView}>
      <Icon
        name='camera'
        type='font-awesome'
        color='#FFF'
        size={30}
        onPress={this.takePhoto}
      />
      </View>
      <View style={styles.iconsView}>
        {this.setMicrophoneIcon()}
      </View>
      <View style={styles.iconsView}>
      <Icon
        name='image'
        type='font-awesome'
        color='#FFF'
        size={30}
        onPress={this.goGallery}
      />
      </View>
      </View>)
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: "#fff" }}>
        <ScrollView style={{backgroundColor: "#fff", paddingBottom: 100 }}>
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
        <View style={styles.navBarBackHeader}>
       <View style={{ width: 60,textAlign:'center' }}>
            <Icon
              name='shopping-cart'
              type='font-awesome'
              color='#FFF'
              size={30}
            />
          </View>
       {(this.state.images.length > 0 || JSON.parse(this.state.setEntity)) &&
        (<View style={{ width: 60,textAlign:'center' }}>
            <Icon
              name='trash'
              type='font-awesome'
              color='#FFF'
              size={30}
              onPress={this._delete}
            />
          </View>)}
          <View style={{ width: 60,textAlign:'center' }}>
            <Icon
              name='camera'
              type='font-awesome'
              color='#FFF'
              size={30}
              onPress={this.takePhoto}
            />
            </View>
            <View style={{ width: 60,textAlign:'center' }}>
              {this.setMicrophoneIcon()}
            </View>
            <View style={styles.iconsView}>
            <Icon
              name='image'
              type='font-awesome'
              color='#FFF'
              size={30}
              onPress={this.goGallery}
            />
            </View>
          {(this.state.images.length > 0 || JSON.parse(this.state.setEntity)) &&
          (<View style={{ width: 60,textAlign:'center' }}>
            <Icon
              name='file'
              type='font-awesome'
              color='#FFF'
              size={25}
              onPress={this.seeDocument}
            />
          </View>)}
        </View>
      </View>
    );
  }
}

class LaunchScreen extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      saveData: false
    }
    this.init()
  }

  async init(){
    await AsyncStorage.getItem("saveData").then((value) => {
      if (value != null) {
         this.setState({ saveData: JSON.parse(value) })
      }
     })
    if (JSON.parse(this.state.saveData)) {
      this.props.navigation.push("Main")
    } else {
      this.props.navigation.push("Login")
    }
  }

  render() {return (<View style={ styles.container }></View>)}
}

class LoginScreen extends Component {  
  constructor(props) {
    super(props);
    this.state = { 
      alias: "", 
      user: "",
      pass: "",
      token: "",
      fullname: "",
      idempresa: "",
      userID: "",
      hidePassword: true }
      this.init()
  }

  async init () {
    await AsyncStorage.getItem("alias").then((value) => {
      if (value != null) {
        this.setState({ alias: value })
      }
    })
    await AsyncStorage.getItem("user").then((value) => {
      if (value != null) {
        this.setState({ user: value })
      }
    })
    await AsyncStorage.getItem("pass").then((value) => {
      if (value != null) {
        this.setState({ pass: value })
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
        error = "Alias incorrecto"
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
    await AsyncStorage.setItem('saveData', JSON.stringify(true));
    this.goHome()
  }

  async goHome() {
    await AsyncStorage.setItem('alias', this.state.alias);
    await AsyncStorage.setItem('user', this.state.user);
    await AsyncStorage.setItem('pass', this.state.pass);
    await AsyncStorage.setItem('fullname', this.state.fullname);
    await AsyncStorage.setItem('idempresa',  this.state.idempresa + "");
    await AsyncStorage.setItem('token',  this.state.token);
    await AsyncStorage.setItem('userID',  this.state.userID + "");
    this.props.navigation.navigate('Main')
  }

  login = async () => {
    if (this.state.alias != undefined && this.state.user != undefined && this.state.pass != undefined) {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({aliasDb: this.state.alias, user: this.state.user, password: this.state.pass, appSource: "Dicloud"})
      };
      fetch('https://app.dicloud.es/login.asp', requestOptions)
        .then((response) => response.json())
        .then((responseJson) => {
          let error = JSON.stringify(responseJson.error_code)
          if (error == 0) {
            this.setState({fullname: JSON.parse(JSON.stringify(responseJson.fullName))})
            this.setState({token: JSON.parse(JSON.stringify(responseJson.token))})
            this.setState({idempresa: JSON.parse(JSON.stringify(responseJson.idempresa))})
            this.setState({userID: JSON.parse(JSON.stringify(responseJson.userid))})
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
        <TextInput  
          style = { styles.textBox }
          placeholder="Alias"  
          onChangeText={(alias) => this.setState({alias})}  
          value={this.state.alias}
        /> 
        <TextInput  
          style = { styles.textBox }
          placeholder="Usuario"  
          onChangeText={(user) => this.setState({user})}  
          value={this.state.user}
        /> 
        <View style = { styles.textBoxBtnHolder }>
          <TextInput  
            style = { styles.textBox }
            placeholder="Contraseña"
            secureTextEntry = { this.state.hidePassword }
            onChangeText={(pass) => this.setState({pass})}  
            value={this.state.pass}
          />  
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
    await AsyncStorage.setItem('b.id', id)
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
    alert("Gastos no se encuentra activo de momento")
    /*var today = new Date()
    var id = "P_"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)+ "-" + ("0" + (today.getHours())).slice(-2)+ ":" + ("0" + (today.getMinutes())).slice(-2)
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
    const AsyncAlert = (title, msg) => new Promise((resolve) => {
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
              <Text style={styles.mainButton}>Compras</Text>
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
                name='tag'
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
                  name='tag'
                  type='font-awesome'
                  color='#FFF'
                  size={35}
                />
                </View>
              <Text style={styles.mainButton}>Ventas</Text>
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
            <Text style={styles.mainButton}>Seguir gasto</Text>
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
                name='shopping-cart'
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
      
        <View style={styles.twoColumnsInARow}>
        <View>
          <TouchableOpacity onPress={this.logout}>
            <View style={styles.mainIcon}>
              <Icon
                name='sign-out'
                type='font-awesome'
                color='#FFF'
                size={35}
              />
              </View>
            <Text style={styles.mainButton}>Desconectar</Text>
          </TouchableOpacity>
          </View>
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
  constructor(key, value, time) {
    this.key = key;
    this.value = value;
    this.time = time;
  }
}

const AppNavigator = createStackNavigator({
  Launch: {
    screen: LaunchScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
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
  appButtonText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
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
    paddingTop: 30,
    paddingLeft: 40,
    backgroundColor: "#FFF"
  },
  dictionaryView: {
    paddingLeft: 40,
    backgroundColor: "#FFF",
    width:"100%",
  },
  wordsBox: {
    borderWidth: 0.5,
    borderColor:"#E7E4E4",
    width: "90%",
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 20,
  },
  wordsBoxText: {
    paddingTop: 10,
    paddingRight: 10,
    paddingLeft: 10,
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
    fontSize: 17,
    textAlign: "left",
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: "#1A5276",
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
    fontSize: 18,
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
  textBoxBtnHolder:{
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center'
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
    paddingTop: 40,
    alignContent: "center",
    alignSelf: "center",
    width: "90%",
  },
  iconsView: {
    backgroundColor: "#1A5276",
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
    paddingRight: 5,
    flexDirection: "row",
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
    elevation: 5,
    width:"80%",
    maxHeight:"60%"

  },
  navBarHeader: {
    flex: 1,
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center'
  },
  navBarBackHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#1A5276", 
    flexDirection:'row', 
    textAlignVertical: 'center',
    height: 60
  },
  focusRoundButton: {
    width: 5,
    height: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderRadius: 50,
    borderWidth:2,
    borderColor: '#1A5276',
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
  visibilityBtn: {
    position: 'absolute',
    right: 20,
    height: 40,
    width: 35,
    padding: 2
  },
  roundButton: {
    width: 5,
    height: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderRadius: 50,
    backgroundColor: '#1A5276',
    borderWidth:2,
    borderColor: '#1A5276',
  },
  flatlistView: {
    paddingTop:20, 
    backgroundColor:"#FFF", 
    flexDirection: "row", 
    justifyContent: 'center',
  },
  roundButtonsView:{
    paddingLeft:7,
    paddingRight:7,
    paddingBottom: 5
  }
});