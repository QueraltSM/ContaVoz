import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, FlatList, BackHandler, ScrollView, Dimensions, PermissionsAndroid, Modal } from 'react-native';
import Voice from 'react-native-voice';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import ImageZoom from 'react-native-image-pan-zoom';

class PetitionScreen extends Component {
    
    constructor(props) {
      super(props);
      this.state = {
        title:"",
        listid: "",
        id: "",
        data: [],
        recognized: '',
        started: '',
        results: [],
        is_recording: false,
        listenedData: "",
        interpretedData: "",
        optionalData: "",
        optionalValue: "",
        lastOptionalValue: "",
        getData: false,
        setData: false,
        images: [],
        words: [],
        list: [],
        savedData: [],
        userid: "",
        flatlistPos: 0,
        saved: false,
      }
      Voice.onSpeechStart = this.onSpeechStart.bind(this);
      Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
      Voice.onSpeechResults = this.onSpeechResults.bind(this);
      this.init()
    }
  
    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }
  
    goBack = () => {
      this.props.navigation.push('PetitionHistory')
      return true
    }
  
    async init() {
      await AsyncStorage.getItem("listid").then((value) => {
        this.setState({ listid: value })
      })
      await AsyncStorage.getItem("id").then((value) => {
        this.setState({ id: value })
      })
      await AsyncStorage.getItem("data").then((value) => {
        this.setState({ title: JSON.parse(value).titulo }) 
        this.setState({ data: JSON.parse(value).campos })  
      })
      await AsyncStorage.getItem("userid").then((value) => {
        this.setState({ userid: value })
      })
      await AsyncStorage.getItem(this.state.id+".saved").then((value) => {
        if (value != null) {
          this.setState({ saved: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.id+".savedData").then((value) => {
        if (value != null) {
          this.setState({ savedData: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.userid+".words").then((value) => {
        if (value != null) {
          this.setState({ words: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.id+".images").then((value) => {
        if (value != null) {
          this.setState({ images: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.listid).then((value) => {
        if (value != null) {
          this.setState({ list: JSON.parse(value) })
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

    async showDateError() {
      await this.showAlert("Fecha errónea", "La fecha '" + this.state.listenedData + "' es incorrecta")
      this.cancelData()
    }

    setFixedDate() {
      if (this.state.listenedData.toLowerCase() == "hoy") {
        this.setState({ interpretedData: ("0" + (new Date().getDate())).slice(-2)+ "/"+ ("0" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear() })
      } else if (this.state.listenedData.toLowerCase() == "ayer") {
        this.setState({ interpretedData: ("0" + (new Date().getDate()-1)).slice(-2)+ "/"+ ("0" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear() })
      } else {
        var daysL = ["Uno", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve", "Diez",
        "Once", "Doce", "Trece", "Catorce", "Quince", "Dieciséis", "Diecisiete", "Dieciocho", "Diecinueve",
        "Veinte", "Veintiuno", "Veintidós", "Veintitrés", "Veinticuatro", "Veinticinco", "Veintiséis", "Veintisiete",
        "Veintiocho", "Veintinueve", "Treinta", "Treinta y uno"]
        var daysN = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", 
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]
        var months = [
          {name:"Enero",last:31}, 
          {name:"Febrero",last:28}, 
          {name:"Marzo",last:31}, 
          {name:"Abril",last:30}, 
          {name:"Mayo",last:31}, 
          {name:"Junio",last:30}, 
          {name:"Julio",last:31}, 
          {name:"Agosto",last:31}, 
          {name:"Septiembre",last:30}, 
          {name:"Octubre",last:31}, 
          {name:"Noviembre",last:30}, 
          {name:"Diciembre",last:31}]
          var indexL = daysL.findIndex((i) => this.state.listenedData.toLowerCase().includes(i.toLowerCase()))
          var indexN = daysN.findIndex((i) => this.state.listenedData.toLowerCase().includes(i.toLowerCase()))
          var indexM = months.findIndex((i) => this.state.listenedData.toLowerCase().includes(i.name.toLowerCase()))
          var aux = this.state.listenedData.split(" ")
          var day = ""
          daysN.forEach((i) => {
            if (i == aux[0]){
              day = i
            }
          })
        if (indexL > -1 && indexM > -1) {
          indexM++
          var d = ("0" + daysN[indexL]).slice(-2)
          var m = ("0" + indexM).slice(-2)
          this.setState({ interpretedData: d + "/" + m + "/" + new Date().getFullYear() })
        } else if (indexN > -1 && indexM > -1 && day != "") {
          indexM++
          var d = ("0" + day).slice(-2)
          var m = ("0" + indexM).slice(-2)
          if (months[indexM-1].last < day) {
            this.showDateError()
          } else {
            this.setState({ interpretedData: d + "/" + m + "/" + new Date().getFullYear() })
          }
        } else if (indexL > -1) {
          var d = ("0" + daysN[indexL]).slice(-2)
          if (d > new Date().getDate()) {
            this.setState({ interpretedData: d + "/" + (("0" + (new Date().getMonth())).slice(-2)) + "/" + new Date().getFullYear() })
          } else {
            this.setState({ interpretedData: d + "/" + (("0" + (new Date().getMonth() + 1)).slice(-2)) + "/" + new Date().getFullYear() })
          }
        } else if (indexN > -1 && day != "") {
          var d = ("0" + day).slice(-2)
          if (d > new Date().getDate()) {
            this.setState({ interpretedData: d + "/" + (("0" + (new Date().getMonth())).slice(-2)) + "/" + new Date().getFullYear() })
          } else {
            this.setState({ interpretedData: d + "/" + (("0" + (new Date().getMonth() + 1)).slice(-2)) + "/" + new Date().getFullYear() })
          }
        } else {
          this.showDateError()
        }
      }
    }

    async setFixedNumber() {
      var str = this.state.listenedData
      if (this.state.listenedData.toLowerCase().includes("con")) {
        str = str.replace("con", ".")
      } else if (this.state.listenedData.toLowerCase().includes("punto")) {
        str = str.replace("punto", ".")
      } else if (this.state.listenedData.toLowerCase().includes("coma")) {
        str = str.replace("coma", ",")
      }
      this.setState({ interpretedData: str.split(' ').join("")  })
    }

    setOptionalData(d,v){
      this.setState({optionalData: d})
      this.setState({optionalValue: v})
      this.setState({lastOptionalValue: v})
    }

    setFixedData() {
      var str = this.state.listenedData
      for (let i = 0; i < this.state.words.length; i++) {
        if (this.state.listenedData.toLowerCase().includes(this.state.words[i].key.toLowerCase())) {
          if (this.state.data[this.state.savedData.length].tipoexp == "E" && JSON.parse(this.state.words[i].enterprise)) {
            this.setOptionalData("NIF asociado", this.state.words[i].value)
            str = this.state.words[i].key
          } else {
            str = str.toLocaleLowerCase().replace(this.state.words[i].key.toLocaleLowerCase(), this.state.words[i].value)
          }
        } else if (this.state.listenedData.toLowerCase().includes(this.state.words[i].value.toLowerCase())) {
          if (this.state.data[this.state.savedData.length].tipoexp == "E" && JSON.parse(this.state.words[i].enterprise)) {
            this.setOptionalData("Entidad asociada", this.state.words[i].key)
            str = this.state.words[i].value
          }
        }
      }
      this.setState({ interpretedData: str })
    }

    async setListenedData() {
      if (this.state.data[this.state.savedData.length].tipoexp == "F") {
        this.setFixedDate()
      } else if (this.state.data[this.state.savedData.length].tipoexp == "N") {
        this.setFixedNumber()
      } else if (this.state.data[this.state.savedData.length].tipoexp == "") {
        var s = this.state.listenedData
        this.setState({ interpretedData: s.split(' ').join("") })
      } else {
        this.setFixedData()
      }
    }
  
    onSpeechResults(e) {
      var res = e.value + ""
      var word = res.split(",")
      this.setState({
        listenedData: word[0],
      });
      this.setState({getData: true})
      this.setListenedData()
    }
  
    async _startRecognition(e) {
      this.setState({is_recording: JSON.stringify(true)})
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
  
    noMoreAudio() {
      this.showAlert("Error", "El documento de voz ha sido completado")
    }

    setMicrophoneIcon() {
      if (this.state.savedData.length == this.state.data.length) {
        return <Icon
          name='microphone'
          type='font-awesome'
          color='#FFF'
          size={30}
          onPress={() => this.noMoreAudio()}
        />
      } else {
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
                  this.saveInMemory(this.state.id+".images", JSON.stringify(arrayImages))
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
            this.saveInMemory(this.state.id+".images", JSON.stringify(arrayImages))
          }
        })
      } else {
        this.showAlert("Error", "Solo puede adjuntar 10 imágenes")
      }
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
      this.props.navigation.push('ImageViewer', {image: image,back: "Petition"})
    }
  
    setImageZoom(item) {
      return (
        <ImageZoom
          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height/2}
          imageWidth={Dimensions.get('window').width}
          imageHeight={Dimensions.get('window').height/2}>
            <TouchableOpacity onPress={() => this.seeImage(item)}>
            <Image
              source={{
                uri: item.uri.replace(/['"]+/g, ''),
              }}
              resizeMode="cover"
              key={item}
              style={{ width: Dimensions.get('window').width, height: (Dimensions.get('window').height)/2, aspectRatio: 1 }}
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
        <Text style={styles.transcript}></Text>
        <Image
            source={require('./assets/no-photo.png')}
            resizeMode="contain"
            key="0"
            style={{ width: 130, height: 130 }}
        />
        </View>
      )
    }
  
    setVoiceControl() {
      if (JSON.parse(this.state.is_recording) && this.state.savedData.length < this.state.data.length) {
        return (<View style={styles.resumeView}><Text style={styles.showTitle}>Escuchando {this.state.data[this.state.savedData.length].titulo.toLowerCase()}...</Text></View>)
      } else if (this.state.savedData.length < this.state.data.length && JSON.parse(this.state.getData) && !JSON.parse(this.state.setData)) {
        return (this.setDataModal())
      }
      return null
    }

    async storeDataInDicctionary() {
      var arrayWords =  this.state.words
      if (!this.state.words.some(item => item.key.toLowerCase() === this.state.listenedData.toLowerCase())) {
        arrayWords.push({
          key: this.state.listenedData,
          value: this.state.interpretedData,
          time: new Date().getTime(),
          enterprise: false
        })
      } else {
        var i = arrayWords.findIndex(obj => obj.key.toLowerCase() === this.state.listenedData.toLowerCase());
        arrayWords[i].value = this.state.interpretedData
      }
      this.setState({ words: arrayWords })
      await AsyncStorage.setItem(this.state.userid+".words", JSON.stringify(arrayWords))
      this.storeData()
    }

    async storeEnterpriseInDicctionary() {
      var arrayWords =  this.state.words
      if (!this.state.words.some(item => item.key.toLowerCase() === this.state.interpretedData.toLowerCase())) {
        arrayWords.push({
          key: this.state.interpretedData,
          value: this.state.optionalValue,
          time: new Date().getTime(),
          enterprise: true
        })
      } else {
        var i = arrayWords.findIndex(obj => obj.key.toLowerCase() === this.state.interpretedData.toLowerCase());
        arrayWords[i].value = this.state.optionalValue
      }
      this.setState({ words: arrayWords })
      await AsyncStorage.setItem(this.state.userid+".words", JSON.stringify(arrayWords))
      this.storeData()
    }

    async askSaveEnterprise() {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "Guardar empresa",
          "¿Desea registrar los datos de esta empresa?",
          [
            {
              text: 'Sí',
              onPress: () => {
                resolve(this.storeEnterpriseInDicctionary());
              },
            },
            {
              text: 'No',
              onPress: () => {
                resolve(this.storeData());
              },
            },
          ],
          { cancelable: false },
        );
        });
        await AsyncAlert();
    }

    async askNewDataSave () {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "Guardar palabra",
          "¿Desea registrar estos datos en el diccionario?",
          [
            {
              text: 'Sí',
              onPress: () => {
                resolve(this.storeDataInDicctionary());
              },
            },
            {
              text: 'No',
              onPress: () => {
                resolve(this.storeData());
              },
            },
          ],
          { cancelable: false },
        );
        });
        await AsyncAlert();
    }

    async storeData () {
      if (this.state.data[this.state.savedData.length].tipoexp == "E") {
        this.setState({ optionalData: "" })
        this.setState({ optionalValue: "" })
      }
      var array = this.state.savedData
      array.push(this.state.interpretedData)
      await AsyncStorage.setItem(this.state.id+".savedData", JSON.stringify(array))
      this.setState({ savedData: array })
      this.setState({ listenedData: "" })
      this.setState({ interpretedData: "" })
    }

    saveData = async () => {
      if (this.state.lastOptionalValue != this.state.optionalValue) {
        this.askSaveEnterprise()
      } else if (this.state.data[this.state.savedData.length].tipoexp != "F" && this.state.interpretedData != this.state.listenedData) {
        this.askNewDataSave()
      } else {
        this.storeData()
      }
    }

    cancelData = () => {
      this.setState({is_recording: false})
      this.setState({listenedData: ""})
      this.setState({interpretedData: ""})
    }

    setDataModal() {
      if (this.state.listenedData.length == 0 || this.state.interpretedData.length == 0) {
        return null
      }
      return(<Modal
          animationType = {"slide"}
          transparent={true}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <Text style={styles.listening}>{this.state.data[this.state.savedData.length].titulo}</Text>
            <View>
              <Text style={styles.resumeText}>Texto escuchado</Text><Text multiline={true} style={styles.transcript}>{this.state.listenedData}</Text>
              <Text style={styles.resumeText}>Texto interpretado <Icon name='pencil' type='font-awesome' color='#000' size={25}/></Text>
              <TextInput multiline={true} style={styles.changeTranscript} onChangeText={interpretedData => this.setState({interpretedData})}>{this.state.interpretedData}</TextInput>
              {this.state.optionalData.length > 0 &&
              (<View><Text style={styles.resumeText}>{this.state.optionalData}</Text>
                <TextInput multiline={true} placeholder="NIF no registrado" style={styles.changeTranscript} onChangeText={optionalValue => this.setState({optionalValue})}>{this.state.optionalValue}</TextInput>
              </View>)}
              </View>
              <Text style={styles.transcript}></Text>
              <View style={styles.modalNavBarButtons}>
                  <TouchableOpacity onPress={this.saveData}>
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
                  <TouchableOpacity onPress={this.cancelData}>
                      <Text style={styles.exitButton}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
            </ScrollView>
          </View>
        </View>
      </Modal>)
    }
  
    startProgramm() {
      if (!JSON.parse(this.state.is_recording) && this.state.images.length == 0 && this.state.savedData.length==0) {
        return(
          <View style={styles.resumeView}>
            <Text style={styles.showTitle}></Text>
            <Text style={styles.showTitle}>Para comenzar debe adjuntar una imagen o pulsar el micrófono</Text>
          </View>
        )
      } else if (!JSON.parse(this.state.is_recording) && this.state.savedData.length > 0 && this.state.savedData.length != this.state.data.length) {
        return(
          <View style={styles.resumeView}>
            <Text style={styles.showTitle}>Existe un documento por voz no terminado</Text>
          </View>
        )
      } else if (this.state.savedData.length == this.state.data.length) {
        return(
          <View style={styles.resumeView}>
            <Text style={styles.showTitle}>Existe documento por voz terminado</Text>
          </View>
        )
      }
      return null
    }
  
    seeDocument = () => {
      this.state.images.length > 0 && (this.state.savedData.length == 0 || (this.state.data.length==this.state.savedData.length))
      this.props.navigation.push('ResumeView')
    }

    async deleteDoc() {
      var chargeDocs = []
      this.state.list.forEach((i) => {
        if (i.id != this.state.id) {
          chargeDocs.push(i)
        }
      })
      await AsyncStorage.setItem(this.state.listid, JSON.stringify(chargeDocs))
      this.goBack()
    }
  
    askDeleteDoc = async () => {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "Borrar documento",
          "¿Está seguro que desea borrar permanentemente este documento?",
          [
            {
              text: 'Sí',
              onPress: () => {
                resolve(this.deleteDoc());
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
        return (
        <View style={styles.navBarBackHeader}>
            <View style={{ width: 60,textAlign:'center' }}>
              <Icon
                name='trash'
                type='font-awesome'
                color='#FFF'
                size={30}
                onPress={this.askDeleteDoc}
              />
            </View>
            <View style={{ width: 60,textAlign:'center' }}>
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
            {(this.state.images.length > 0 && (this.state.savedData.length == 0 || this.state.data.length == this.state.savedData.length)
            || (this.state.images.length == 0 && (this.state.data.length == this.state.savedData.length))) &&
            (<View style={{ width: 60,textAlign:'center' }}>
              <Icon
                name='check-square'
                type='font-awesome'
                color='#FFF'
                size={30}
                onPress={this.seeDocument}
              />
            </View>)}
          </View>
        )
    }

    render () {
      return (
        <View style={{flex: 1, backgroundColor: "#fff" }}>
          <ScrollView
            style={{backgroundColor: "#fff", paddingBottom: 100 }}>
          <View style={{backgroundColor: "#1A5276"}}>
            <Text style={styles.mainHeader}>{this.state.title}</Text>
          </View>
            <View style={styles.sections}>
              {this.setImages()}
              {this.startProgramm()}
              {this.setVoiceControl()}
            </View>
          </ScrollView>
          {this.setMenu()}
        </View>
      );
    }
  }

  export default createAppContainer(PetitionScreen);

  const styles = StyleSheet.create({
    navBarBackHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#1A5276", 
        flexDirection:'row', 
        textAlignVertical: 'center',
        height: 60
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
        paddingBottom: 20
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
      roundButtonsView:{
        paddingLeft:7,
        paddingRight:7,
        paddingBottom: 5
      },
      flatlistView: {
        paddingTop:20, 
        backgroundColor:"#FFF", 
        flexDirection: "row", 
        justifyContent: 'center',
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
      },
      footBar: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#FFF", 
        flexDirection:'row', 
        textAlignVertical: 'center',
      },
      iconsView: {
        backgroundColor: "#1A5276",
        borderRadius: 10,
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
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
      resumeText: {
        fontSize: 20,
        textAlign: "justify",
        paddingTop: 20,
        color: "#000",
        fontWeight: 'bold',
      },
      exitButton: {
        fontSize: 17,
        textAlign: "center",
        fontWeight: 'bold',
        color: "#B03A2E",
        fontWeight: 'bold',
      },
      saveNewValue: {
        fontSize: 17,
        textAlign: "left",
        color: "#2E8B57",
        fontWeight: 'bold',
      },
      saveButton: {
        fontSize: 17,
        textAlign: "center",
        fontWeight: 'bold',
        color: "#2E8B57",
        fontWeight: 'bold',
      },
      exitNewValue: {
        fontSize: 17,
        textAlign: "left",
        color: "#B03A2E",
        fontWeight: 'bold',
      },
      resumeView: {
        paddingTop: 30,
        paddingLeft: 40,
        backgroundColor: "#FFF",
        paddingBottom: 30
      },
      sections: {
        flex: 1,
        backgroundColor:"#FFF",
      },
      mainHeader: {
        padding: 20,
        alignItems: 'center',
        textAlign: "center",
        fontWeight: "bold",
        color: "#FFF",
        fontSize: 20,
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
  })