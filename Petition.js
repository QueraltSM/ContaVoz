import React, { Component } from 'react';
import { StyleSheet, Platform, Text, View, TouchableOpacity, Alert, TextInput, Image, BackHandler, ScrollView, Dimensions, PermissionsAndroid, Modal, Animated } from 'react-native';
import Voice from 'react-native-voice';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import ImageZoom from 'react-native-image-pan-zoom';
import evaluate from 'words-to-numbers-es';
import { RFPercentage } from "react-native-responsive-fontsize";

class PetitionScreen extends Component {
    
    constructor(props) {
      super(props);
      this.state = {
        title:"",
        petitionType: "",
        petitionID: "",
        data: [],
        recognized: '',
        started: '',
        results: [],
        is_recording: false,
        listenedData: "",
        interpretedData: "",
        optionalData: "Empresa no encontrada",
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
        flag: 0,
        fadeAnimation: new Animated.Value(0),
        timer: 0,
        seconds: 15,
        hasStarted: false,
        listenFlag: 0,
        showResult: false
      }
      this.init()
      Voice.onSpeechStart = this.onSpeechStart.bind(this);
      Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
      Voice.onSpeechResults = this.onSpeechResults.bind(this);
    }

    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }
  
    goBack = () => {
      this._stopRecognition(this)
      this.props.navigation.push('PetitionHistory')
      return true
    }
  
    async init() {
      await AsyncStorage.getItem("petitionType").then((value) => {
        this.setState({ petitionType: value })
      })
      await AsyncStorage.getItem("petitionID").then((value) => {
        this.setState({ petitionID: JSON.parse(value).id })
      })
      await AsyncStorage.getItem("data").then((value) => {
        this.setState({ title: JSON.parse(value).titulo }) 
        this.setState({ data: JSON.parse(value).campos })  
      })
      await AsyncStorage.getItem("userid").then((value) => {
        this.setState({ userid: value })
      })
      await AsyncStorage.getItem(this.state.petitionID+".listenFlag").then((value) => {
        if (value != null) {
          this.setState({ listenFlag: value })
        }
      })
      await AsyncStorage.getItem(this.state.petitionID+".saved").then((value) => {
        if (value != null) {
          this.setState({ saved: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.petitionID+".savedData").then((value) => {
        if (value != null) {
          this.setState({ savedData: JSON.parse(value) })
        }
      })
      if (this.state.savedData.length == 0) {
        var array = []
        this.state.data.forEach((i) => {
          var result = null
          if ( i.xdefecto != "") {
            result = i.xdefecto
          }
          array.push({
            idcampo:i.idcampo,
            titulo: i.titulo,
            tipoexp: i.tipoexp,
            xdefecto: i.xdefecto,
            obligatorio: i.obligatorio,
            escuchado: "",
            valor: result
          })
        })
        await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(array))
        this.setState({ savedData: array })
      }
      await AsyncStorage.getItem(this.state.petitionID+".optionalData").then((value) => {
        if (value != null) {
          this.setState({ optionalData: value })
        }
      })
      await AsyncStorage.getItem(this.state.petitionID+".optionalValue").then((value) => {
        if (value != null) {
          this.setState({ optionalValue: value })
        }
      })
      await AsyncStorage.getItem(this.state.petitionID+".lastOptionalValue").then((value) => {
        if (value != null) {
          this.setState({ lastOptionalValue: value })
        }
      })
      await AsyncStorage.getItem(this.state.userid+".words").then((value) => {
        if (value != null) {
          this.setState({ words: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.petitionID+".images").then((value) => {
        if (value != null) {
          this.setState({ images: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.petitionType).then((value) => {
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
      this.resetListening()
    }

    async setFixedNumber() {
      if (this.state.listenedData.includes("con")) this.setState({ listenedData: this.state.listenedData.replace("con", ".")})
      var number = evaluate(this.state.listenedData);
      if (number==0) {
        if (isNaN(this.state.listenedData)) {
          this.showAlert("Error", "El dato aportado no es numérico")
          this.setState({ getData: false })
        } else {
          if (!this.state.listenedData.includes(".") || !this.state.listenedData.includes(",")) {
            this.setState({ listenedData: this.state.listenedData + ",00" })
          }
          this.setState({ interpretedData: this.state.listenedData.split(' ').join("").replace("/",".") })
          this.resetListening()
        }
      } else {
        this.setState({ listenedData: number + "" })
        this.setState({ interpretedData: number + "" })
        this.resetListening()
      }
    }

    async setOptionalData(d,v){
      await this.setState({optionalData: d})
      await this.setState({optionalValue: v})
      await this.setState({lastOptionalValue: v})
      await AsyncStorage.setItem(this.state.petitionID+".optionalData", this.state.optionalData)
      await AsyncStorage.setItem(this.state.petitionID+".optionalValue", this.state.optionalValue)
      await AsyncStorage.setItem(this.state.petitionID+".lastOptionalValue", this.state.lastOptionalValue)
    }

    setFixedData() {
      var listenedData = this.state.listenedData.toLowerCase()
      var sameKeywords = this.state.words.findIndex(obj => obj.keywords.toLowerCase().includes(listenedData))
      var sameEntity = this.state.words.findIndex(obj => obj.entity.toLowerCase().includes(listenedData))
      if (sameKeywords > -1) {
        this.setState({ interpretedData: this.state.words[sameKeywords].entity })
        this.setOptionalData("CIF asociado", this.state.words[sameKeywords].cifValue)
      } else if (sameEntity > -1) {
        this.setState({ interpretedData: this.state.words[sameEntity].entity })
        this.setOptionalData("CIF asociado", this.state.words[sameEntity].cifValue)
      } else {
        this.setState({ interpretedData: this.state.listenedData })
        this.setOptionalData("Empresa no encontrada", "")
      }
      this.resetListening()
    }

    async setListenedData() {
      if (this.state.savedData[this.state.listenFlag].tipoexp == "F") {
        this.setFixedDate()
      } else if (this.state.savedData[this.state.listenFlag].tipoexp == "N") {
        this.setFixedNumber()
      } else {
        this.setFixedData()
      }
    }
  
    onSpeechResults(e) {
      console.log("::onSpeechResults::")
      var res = e.value + ""
      var word = res.split(",")
      console.log("word:"+word)
      if (word[0].length>0) {
        console.log("entro")
        this._stopRecognition(e)
      }
      this.setState({
        listenedData: word[0],
      });
      if (this.state.savedData[this.state.listenFlag].idcampo=="factura") {
        this.setState({listenedData:this.state.listenedData.toUpperCase()})
      }
      if (this.state.savedData[this.state.listenFlag].tipoexp != "1" && this.state.savedData[this.state.listenFlag].tipoexp != "E" && this.state.savedData[this.state.listenFlag].tipoexp != "F") {
        this.setState({listenedData:this.state.listenedData.split(' ').join("")})
      }
      this.setState({getData: true})
      this.setListenedData()
    }
  
    async _startRecognition(e) {
      console.log(":::_startRecognition:::")
      this.setState({
        recognized: '',
        started: '',
        results: [],
      });
      var percentage = this.state.savedData.findIndex(obj => obj.idcampo.includes("porcentaje"))
      if (this.state.listenFlag<this.state.savedData.length) {
        this.setState({is_recording: true })
        var idcampo = this.state.data[this.state.listenFlag].idcampo
        if ((!idcampo.includes("base") && !idcampo.includes("cuota") && this.state.data[this.state.listenFlag].xdefecto == "") || 
        (idcampo.includes("base") && idcampo.includes("cuota") && this.state.data[this.state.listenFlag].xdefecto != "")) {
          try {
            await Voice.start('es');
            this.setTimer(e)
          } catch (e) {
            console.error(e);
          }
        } else {
          if (idcampo.includes("base") || idcampo.includes("cuota") && this.state.savedData[percentage].valor != "") {
            this.calculateResult()
          } else {
            this.setState({ interpretedData : this.state.data[this.state.listenFlag].xdefecto })
          }
        }
      }
    }

    async setTimer (e) {
      if (this.state.seconds > 0 ) {
        var timer = setTimeout(() => {
          this.setState({ seconds: this.state.seconds-1})
          this.setTimer(e)
        },1000);
      } else {
          this._stopRecognition(e)
          clearTimeout(this.state.timer)
      }
      this.setState({ timer: timer })
    }
  
    async _stopRecognition(e) {
      console.log(":::_stopRecognition:::")
      await this.setState({ is_recording: false })
      await this.setState({ seconds: 15 })
      clearTimeout(this.state.timer)
      try {
        await Voice.stop()
      } catch (e) {}
    }
  
    noMoreAudio() {
      this.showAlert("Atención", "El documento de voz ha sido completado")
    }

    setMicrophoneIcon() {
      if (this.state.savedData.length>0 && this.state.listenFlag >= this.state.savedData.length-1) {
        return (<View style={{ width: 70,textAlign:'center' }}><TouchableOpacity onPress={() => this.noMoreAudio()}><Icon name='microphone' type='font-awesome' color='#1A5276' size={40}/></TouchableOpacity></View>)
      }
      return (<View style={{ width: 70,textAlign:'center' }}><TouchableOpacity onPress={this._startRecognition.bind(this)}><Icon name='microphone' type='font-awesome' color='#1A5276' size={40} /></TouchableOpacity></View>)
    }

     takePhoto = async() =>{
       /* //Probar con el iPhone
       if (Platform.OS == "ios") {
        console.log("soy ios")
        let options = {
          title: 'Hacer una foto',
          customButtons: [ { name: 'customOptionKey', title: 'Choose Photo from Custom Option' }, ],
          storageOptions: {
            skipBackup: true,
            path: 'images',
            privateDirectory: true,
          },
        };
        ImagePicker.launchCamera(options, (response) => {
          if (response.didCancel || response.error || response.customButton) {
            console.log(JSON.stringify(response));
          } else {
            var arrayImages = this.state.images
            var newID = this.state.petitionID+"_"+(this.state.images.length+1)
            var uri = JSON.stringify(response.assets[0]["uri"])
            arrayImages.push({
              id: newID,
              uri: uri
            })
            this.setState({images: arrayImages})
            this.saveImages()
          }
        })
       } else {*/
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA, { title: "ContaVoz", message:"Necesitamos permisos para acceder a su cámara", buttonNegative: "Cancelar", buttonPositive: "Aceptar" }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            let options = {
              title: 'Hacer una foto',
              customButtons: [ { name: 'customOptionKey', title: 'Choose Photo from Custom Option' }, ],
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
                  var newID = this.state.petitionID+"_"+(this.state.images.length+1)
                  var uri = JSON.stringify(response.assets[0]["uri"])
                  arrayImages.push({
                    id: newID,
                    uri: uri
                  })
                  this.setState({images: arrayImages})
                  this.saveImages()
                }
              })
            } else {
              this.showAlert("Error", "Solo puede adjuntar 10 imágenes")
            }
          }
        } catch (err) {
          console.log(err);
        }
      //}
    }
  
    async saveImages() {
      var list = []
      await AsyncStorage.getItem(this.state.petitionType).then((value) => {
        if (value != null) {
          list = JSON.parse(value) 
        }
      })
      var index = list.findIndex(obj => JSON.stringify(obj.id) == this.state.petitionID)
      list[index].images = this.state.images
      await AsyncStorage.setItem(this.state.petitionType, JSON.stringify(list))
      await AsyncStorage.setItem(this.state.petitionID+".images", JSON.stringify(this.state.images))
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
            var newID = this.state.petitionID+"_"+(this.state.images.length+1)
            arrayImages.push({
              id: newID,
              uri: uri
            })
            this.setState({images: arrayImages})
            this.saveImages()
          }
        })
      } else {
        this.showAlert("Error", "Solo puede adjuntar 10 imágenes")
      }
    }
  
      async showAlert (title, message) {
        const AsyncAlert = () => new Promise((resolve) => {
          Alert.alert(
            title,
            message,
            [
              {
                text: 'Ok',
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

    async setFlag(i) {
      this.setState({flag: i })
    }
  
    setAllFlags() {
      var result = []
      for (let i = 0; i < this.state.images.length; i++) {
        if (this.state.flag == i) {
          result.push(<View style={styles.roundButtonsView}><Text style={styles.focusRoundButton}></Text></View>)
        } else {
          result.push(<View style={styles.roundButtonsView}>
            <TouchableOpacity onPress={() => this.setFlag(i)}>
              <Text style={styles.roundButton}></Text>
            </TouchableOpacity>
            </View>)
        }
      }
      return (<View style={styles.flatlistView}>{result}</View>)
    }
  
    seeImage (image) {
      this.props.navigation.push('ImageViewer', {image: image,back: "Petition"})
    }
  
    setImageZoom() {
      return (<ImageZoom
          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height/2}
          imageWidth={Dimensions.get('window').width}
          imageHeight={Dimensions.get('window').height/2}>
            <TouchableOpacity onPress={() => this.seeImage(this.state.images[this.state.flag])}>
            <Image
              source={{
                uri: this.state.images[this.state.flag].uri.replace(/['"]+/g, ''),
              }}
              resizeMode="cover"
              key={this.state.flag}
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
            {this.setImageZoom()}
          </View>
          </View>
        )}
      return (
        <View style={styles.imagesSection}>
        <Text style={styles.transcript}></Text>
        <Image source={require('./assets/no-photo.png')} resizeMode="contain" key="0" style={{ width: 180, height: 180 }} />
        </View>
      )
    }

    fadeIn = () => {
      Animated.timing(this.state.fadeAnimation, {
        useNativeDriver: true,
        toValue: 1,
        duration: 500
      }).start(({ finished }) => {
        if (finished) {
          this.fadeOut()
        }
      })
    }
  
    fadeOut = () => {
      Animated.timing(this.state.fadeAnimation, {
        useNativeDriver: true,
        toValue: 0,
        duration: 500
      }).start(({ finished }) => {
        if (finished) {
          this.fadeIn()
        }
      })
    };

    setVoiceControlView() {
      var lastSaved = Number(this.state.listenFlag)
      this.fadeIn()
      return (<View style={styles.titleView}>
          <Animated.View style={[ { opacity: this.state.fadeAnimation, width:"90%" }]}>
            <Text style={styles.showListen}>Escuchando {this.state.savedData[lastSaved].titulo.toLowerCase()}</Text>
          </Animated.View>
          <Text style={styles.secondsLabel}>({this.state.seconds})</Text>
          {lastSaved>-1 && lastSaved <= this.state.savedData.length-2 && <Text style={styles.showNextData}>Siguiente dato es {this.state.data[lastSaved+1].titulo}</Text>}
          <Text style={styles.transcript}></Text>
            <View style={styles.modalNavBarButtons}>
              {lastSaved==0 && (<View style={{paddingRight: 20}}><TouchableOpacity onPress={() => this.closeListen()} style={styles.saveButtomModal}><Icon name='times' type='font-awesome' color='white' size={32}/></TouchableOpacity></View>)}
              {lastSaved>0 && (<View style={{paddingRight: 20}}>
                <TouchableOpacity onPress={() => this.updateListen(-1)} style={styles.saveButtomModal}><Icon name='arrow-left' type='font-awesome' color='white' size={32}/></TouchableOpacity>
                </View>)}
                {lastSaved>0 && (
                <View>
                  <TouchableOpacity onPress={() => this.editListen(-1)} style={styles.editButtomModal}><Icon name='pencil' type='font-awesome' color='white' size={32}/></TouchableOpacity>
                </View>)}
                {lastSaved < this.state.savedData.length-1 && (
                <View style={{paddingLeft: 20}}><TouchableOpacity onPress={() => this.updateListen(1)} style={styles.exitButtomModal}><Icon name='arrow-right' type='font-awesome' color='white' size={32}/></TouchableOpacity></View>)}
              </View>
      </View>)
    }

    async editListen() {
      this.setState({ listenFlag: this.state.listenFlag - 1 })
      this.setState({ showResult: true })
      this._stopRecognition(this)
      this.setState({ is_recording: false })
    }

    async closeListen() {
      this._stopRecognition(this)
      this.setState({ is_recording: false })
    }

    async updateListen(value) {
      this.setState({ listenFlag: Number(this.state.listenFlag) + Number(value)})
      var lng =  this.state.savedData.length-1
      console.log(this.state.listenFlag + " and " + lng)
      if (this.state.listenFlag < lng) {
        await AsyncStorage.setItem(this.state.petitionID+".listenFlag", JSON.stringify(this.state.listenFlag))
        if (this.state.savedData[this.state.listenFlag].idcampo.includes("base") || this.state.savedData[this.state.listenFlag].idcampo.includes("cuota")) {
          this.calculateResult()
        }
        this.setState({ seconds: 10 })
        this._stopRecognition(this)
        this._startRecognition(this) 
        this.setState({interpretedData:""})
      } else {
        console.log("ya temrine")
        this._stopRecognition(this)
      }
    }

    setVoiceControl() {
      if (JSON.parse(this.state.is_recording) && this.state.listenFlag>0 && this.state.listenFlag<this.state.savedData.length && (this.state.savedData[this.state.listenFlag].xdefecto != "")) {
        return this.setDefaultDataModal()
      } else if (JSON.parse(this.state.is_recording) && this.state.listenFlag>0 && this.state.listenFlag<this.state.savedData.length && (this.state.savedData[this.state.listenFlag].idcampo.includes("base") || 
      this.state.savedData[this.state.listenFlag].idcampo.includes("cuota"))) {
        return this.setCalculateDataModal()
      } else if (JSON.parse(this.state.is_recording & this.state.listenFlag>=0 && this.state.listenFlag<this.state.savedData.length-1)) {
        return this.setVoiceControlView()
      }
      console.log("pues es al final")
      return null
    }

    async saveEnterprise() {
      var arrayWords =  this.state.words
      if (!this.state.words.some(item => item.entity.toLowerCase() === this.state.interpretedData.toLowerCase())) {
        arrayWords.push({
          keywords: this.state.listenedData,
          entity: this.state.interpretedData,
          cifValue: this.state.optionalValue,
          time: new Date().getTime()
        })
      } else {
        var i = arrayWords.findIndex(obj => obj.entity.toLowerCase() === this.state.interpretedData.toLowerCase());
        arrayWords[i].cifValue = this.state.optionalValue
      }
      this.setState({ words: arrayWords })
      await AsyncStorage.setItem(this.state.userid+".words", JSON.stringify(arrayWords))
      this.storeData()
    }

    async askSaveEnterprise() {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "Guardar empresa",
          "¿Desea guardar los datos de esta empresa en el diccionario?",
          [
            {
              text: 'Sí',
              onPress: () => {
                resolve(this.saveEnterprise());
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
      var lastSaved = this.state.savedData.findIndex(obj => obj.valor == null)
      if (this.state.data[lastSaved].tipoexp == "E") {
        this.setState({ optionalData: "" })
        this.setState({ optionalValue: "" })
        this.setState({ lastOptionalValue: "" })
      }
      var array = this.state.savedData
      array[lastSaved].valor=this.state.interpretedData
      this.resetListening()
      this.setState({ savedData: array })
      await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(array))
      this.saveDocument()
    }

    async resetListening() {
      this.state.savedData[this.state.listenFlag].escuchado = this.state.listenedData
      this.state.savedData[this.state.listenFlag].valor = this.state.interpretedData
      this.setState({savedData: this.state.savedData})
      await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(this.state.savedData))
      this.setState({ listenedData: "" })
      this.setState({ interpretedData: "" })
      if (this.state.listenFlag<this.state.savedData.length-1) {
        this.setState({ is_recording: true })
        this.updateListen(1)
      }
    }

    saveNextData = async () => {
      this.setState({ is_recording: false })
      this.saveData()
      this._startRecognition()
    }

    saveData = async () => {
      if (this.state.interpretedData != "") {
        this.setState({ hasStarted: true })
        if (this.state.lastOptionalValue != this.state.optionalValue) {
          this.askSaveEnterprise()
        } else {
          this.storeData()
        }
      } else {
        this.showAlert("Error", "El texto interpretado no puede estar vacío")
      }
    }

    async cancelData() {
      if (this.state.interpretedData.length>0) {
        this.state.savedData[this.state.listenFlag].valor = this.state.interpretedData
        this.setState({savedData: this.state.savedData})
        await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(this.state.savedData))
      }
      this.setState({showResult: false})
      this.updateListen(1)
      this.setState({is_recording: true})
    }

    async calculateResult() {
      var porcentaje =  this.state.savedData[this.state.listenFlag-1].valor
      var index = this.state.savedData.findIndex(obj => obj.idcampo.includes("importe"))
      var importe = this.state.savedData[index].valor
      if (importe == null) {
        await this.showAlert("Error", "Debe indicar un importe para proceder a calcular base y cuota")
        var newIndex=Number(this.state.listenFlag)-Number(index)
        this.updateListen(-newIndex)
      } else {
        if (importe.includes(",")) {
          importe = importe.replace(",",".")
        }
        var result = ""
        if (this.state.savedData[this.state.listenFlag].idcampo.includes("base")) {
          var x = 100 + Number(porcentaje)
          result = ( importe * 100 ) / x
          result = Math.round(result * 100) / 100
        } else {
          var base = Number(this.state.savedData[this.state.listenFlag-1].valor) 
          var porcentaje = Number(this.state.savedData[this.state.listenFlag-2].valor) 
          result = base*porcentaje
          result = Math.round(result * 100) / 100
        }
        this.state.savedData[this.state.listenFlag].escuchado = result
        this.state.savedData[this.state.listenFlag].valor = result
        await this.setState({interpretedData: JSON.stringify(this.state.interpretedData)})
        await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(this.state.savedData))
      }
    }

    setDefaultDataModal() {
      if (this.state.savedData[this.state.listenFlag].valor == null) return null
      return (<Modal
          animationType = {"slide"}
          transparent={true}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Text style={styles.showTitle}>{this.state.savedData[this.state.listenFlag].titulo}</Text>
            <View style={styles.modalResult}>
              <Text style={styles.resumeText}>Valor por defecto</Text>
              <TextInput blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={interpretedData => this.setState({interpretedData: interpretedData})}>{this.state.savedData[this.state.listenFlag].valor}</TextInput>
            </View>
              <Text style={styles.transcript}></Text>
              <View style={styles.modalNavBarButtons}>
                <TouchableOpacity onPress={() => this.cancelData()} style={styles.exitButtomModal}><Icon name='check' type='font-awesome' color='white' size={32}/></TouchableOpacity>
              </View>
          </View>
        </View>
      </Modal>)
    }
    
    setCalculateDataModal() {
      if (this.state.savedData[this.state.listenFlag].valor == null) return null
      return(<Modal
        animationType = {"slide"}
        transparent={true}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Text style={styles.showTitle}>{this.state.savedData[this.state.listenFlag].titulo}</Text>
          <View style={styles.modalResult}>
            <Text style={styles.resumeText}>Resultado</Text>
            <TextInput blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={result => this.setState({interpretedData:result })}>{this.state.savedData[this.state.listenFlag].valor}</TextInput>
          </View>
            <Text style={styles.transcript}></Text>
            <View style={styles.modalNavBarButtons}>
            <TouchableOpacity onPress={() => this.cancelData()} style={styles.exitButtomModal}><Icon name='check' type='font-awesome' color='white' size={32}/></TouchableOpacity>
            </View>
        </View>
      </View>
    </Modal>)
    }

    setDataModal() {
      if (this.state.savedData.length==0) return null
      if (!this.state.showResult) return null
      return(<Modal
          animationType = {"slide"}
          transparent={true}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Text style={styles.listening}>{this.state.savedData[this.state.listenFlag].titulo}</Text>
            <View style={styles.modalResult}>
              <Text style={styles.resumeText}>Texto escuchado</Text>
              {this.state.savedData[this.state.listenFlag].escuchado.length>0&&<Text multiline={true} style={styles.transcript}>{this.state.savedData[this.state.listenFlag].escuchado}</Text>}
              {this.state.savedData[this.state.listenFlag].escuchado.length==0&&<Text multiline={true} style={styles.transcript}>No se ha dicho nada</Text>}
              <Text style={styles.resumeText}>Texto interpretado</Text>
              {this.state.savedData[this.state.listenFlag].valor==null&&<TextInput blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={interpretedData => this.setState({interpretedData})}>No he interpretado nada</TextInput>}
              {this.state.savedData[this.state.listenFlag].valor!=null&&<TextInput blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={interpretedData => this.setState({interpretedData})}>{this.state.savedData[this.state.listenFlag].valor}</TextInput>}
              {this.state.savedData[this.state.listenFlag].tipoexp=="E" &&
              (<View><Text style={styles.resumeText}>{this.state.optionalData}</Text>
                <TextInput blurOnSubmit={true} multiline={true} placeholder="CIF no registrado" style={styles.changeTranscript} onChangeText={optionalValue => this.setState({optionalValue})}>{this.state.optionalValue}</TextInput>
              </View>)}
              </View>
              <Text style={styles.transcript}></Text>
              <View style={styles.modalNavBarButtons}>
                <TouchableOpacity onPress={() => this.cancelData()} style={styles.exitButtomModal}><Icon name='check' type='font-awesome' color='white' size={32}/></TouchableOpacity>
              </View>
          </View>
        </View>
      </Modal>)
    }

    showMessage = (message) => {
      if (!this.state.is_recording) {
        return(
          <View style={styles.titleView}>
            <Text style={styles.showTitle}>{message}</Text>
          </View>
        )
      }
      return null
    }
  
    async saveDocument() {
      var list = []
      await AsyncStorage.getItem(this.state.petitionType).then((value) => {
        if (value != null) {
          list = JSON.parse(value) 
        }
      })
      var index = list.findIndex(obj => JSON.stringify(obj.id) == this.state.petitionID)
      list[index].savedData = this.state.savedData
      await AsyncStorage.setItem(this.state.petitionType, JSON.stringify(list))
    }

    documentState = () => {
      var lastSaved = this.state.savedData.findIndex(obj => obj.valor == null)
      if (this.state.savedData.length > 0 && !JSON.parse(this.state.is_recording) && this.state.images.length == 0 && lastSaved==0) {
        return this.showMessage("Adjunte imágenes o pulse el micrófono de voz")
      } else if (this.state.savedData.length > 0 && !JSON.parse(this.state.is_recording) && this.state.images.length > 0 && lastSaved==0) {
        return this.showMessage("Para empezar un documento de voz pulse el micrófono")
      }  else if (this.state.savedData.length > 0 && !JSON.parse(this.state.is_recording) && this.state.savedData.length > 0 && lastSaved>0) {
        return this.showMessage("Documento de voz no finalizado")
      } else if (this.state.savedData.length > 0 && lastSaved==-1) {
        return this.showMessage("Documento de voz terminado")
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
        if (i.id != this.state.petitionID) {
          chargeDocs.push(i)
        }
      })
      await AsyncStorage.setItem(this.state.petitionType, JSON.stringify(chargeDocs))
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
        if (this.state.is_recording) return null
        console.log("aqui")
        return (
        <View style={styles.navBarBackHeader}>
            <View style={{ width: 70,textAlign:'center' }}>
              <TouchableOpacity onPress={() => this.askDeleteDoc()}>
              <Icon
                name='trash'
                type='font-awesome'
                color='#1A5276'
                size={40}
              />
              </TouchableOpacity>
            </View>
            <View style={{ width: 70,textAlign:'center' }}>
            <TouchableOpacity onPress={() => this.takePhoto()}>
              <Icon
                name='camera'
                type='font-awesome'
                color='#1A5276'
                size={40}
              />
              </TouchableOpacity>
              </View>
              {this.setMicrophoneIcon()}
              <View style={{ width: 70,textAlign:'center' }}>
              <TouchableOpacity onPress={() => this.goGallery()}>
              <Icon
                name='image'
                type='font-awesome'
                color='#1A5276'
                size={40}
              />
              </TouchableOpacity>
              </View>
            {(this.state.images.length > 0 || this.state.listenFlag >0) &&
            (<View style={{ width: 70,textAlign:'center' }}>
              <TouchableOpacity onPress={() => this.seeDocument()}>
              <Icon
                name='check-square'
                type='font-awesome'
                color='#5C9E7B'
                size={40}
              />
              </TouchableOpacity>
            </View>)}
          </View>
        )
    }

    render () {
      if (this.state.savedData.length==0) return null // Wait loop
      return (
        <View style={{flex: 1 }}>
            <View style={styles.navBarHeader}>
              <Text style={styles.mainHeader}>{this.state.title}</Text>
            </View>
            <ScrollView
              style={{backgroundColor: "white" }}
              showsVerticalScrollIndicator ={false}
              showsHorizontalScrollIndicator={false}
              persistentScrollbar={false}
              >
              <View style={styles.sections}>
                {this.setImages()}
                {this.state.images.length > 1 && this.setAllFlags()}
                {this.documentState()}
                {this.setVoiceControl()}
                {this.setDataModal()}
              </View>
            </ScrollView>
          {this.setMenu()}
        </View>
      );
    }
  }

  export default createAppContainer(PetitionScreen);

  const styles = StyleSheet.create({
      navBarHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#1A5276", 
        flexDirection:'row', 
        textAlignVertical: 'center',
      },
      navBarBackHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"white", 
        flexDirection:'row', 
        textAlignVertical: 'center',
        height: 65
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
        paddingBottom: 20,
        paddingTop: 20
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
      roundButtonsView: {
        paddingLeft:7,
        paddingRight:7,
        paddingBottom: 5,
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
        fontSize: RFPercentage(4),
      },
      showTitle:{
        paddingTop: 20,
        textAlign: 'center',
        color: '#154360',
        fontWeight: 'bold',
        fontSize: RFPercentage(3),
        width: "100%",
        paddingBottom: 10,
      },
      showListen:{
        textAlign: 'center',
        color: '#B03A2E',
        fontWeight: 'bold',
        fontSize: RFPercentage(4),
        width: "100%",
        paddingBottom: 20,
        paddingTop: 20,
      },
      showSubTitle: {
        textAlign: 'center',
        color: 'black',
        fontWeight: 'bold',
        fontSize: RFPercentage(3),
        width: "100%",
        paddingTop: 10
      },
      showNextData: {
        textAlign: 'center',
        color: '#56A494',
        fontSize: RFPercentage(3),
        width: "100%",
        paddingTop: 20,
        fontWeight: 'bold',
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      modalResult: {
        width:"100%"
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10,
        width:"90%",
        alignItems:"center",
        alignContent: "center",
        textAlign:"center"
      },
      footBar: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#FFF", 
        flexDirection:'row', 
        textAlignVertical: 'center',
      },
      iconsView: {
        backgroundColor: "white",
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
        width:"100%",
      },
      selectedImageView: {
        flex: 1,
        alignItems: 'center',
        textAlign: "center",
        backgroundColor: "#000",
      },
      transcript: {
        color: '#000',
        fontSize: RFPercentage(2.5),
        textAlign: "center",
        width:"100%"
      },
      changeTranscript: {
        color: '#000',
        fontSize: RFPercentage(2.5),
        textAlign:"center",
        width:"100%",
        borderWidth: 0.5,
        borderColor: "lightgray",
        borderRadius: 20
      },
      resumeText: {
        fontSize: RFPercentage(3),
        textAlign: "center",
        paddingTop: 10,
        paddingBottom: 10,
        color: "#000",
        fontWeight: 'bold',
        width:"100%"
      },
      secondsLabel: {
        fontWeight: 'bold',
        color: "#B03A2E",
        fontSize: 20,
        textAlign: "center",
      },
      exitButton: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: 'bold',
        color: "#B03A2E",
        fontWeight: 'bold',
      },
      skipButton: {
        width: "100%",
        fontSize: 20,
        paddingTop: 20,
        textAlign: "center",
        fontWeight: 'bold',
        color: "#761A1B",
        fontWeight: 'bold',
        fontStyle: 'italic',
      },
      saveNewValue: {
        fontSize: 20,
        textAlign: "left",
        color: "#2E8B57",
        fontWeight: 'bold',
      },
      saveButton: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: 'bold',
        color: "#2E8B57",
        fontWeight: 'bold',
      },
      exitNewValue: {
        fontSize: 20,
        textAlign: "left",
        color: "#B03A2E",
        fontWeight: 'bold',
      },
      titleView: {
        paddingTop: 20,
        paddingBottom: 20,
        textAlign:"center",
        width:"80%",
        justifyContent: "center",
        alignItems: "center",
      },
      resumeView: {
        paddingBottom: 20,
        textAlign:"center",
        width:"100%",
        justifyContent: "center"
      },
      sections: {
        flex: 1,
        textAlign: "center",
        justifyContent: "center",
        width: "100%",
        alignItems: "center"
      },
      mainHeader: {
        padding: 10,
        alignItems: 'center',
        textAlign: "center",
        fontWeight: "bold",
        color: "#FFF",
        fontSize: 20,
      },
      roundButton: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 6,
        borderRadius: 50,
        borderWidth:2,
        borderColor: '#1A5276',
      },
      focusRoundButton: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 6,
        borderRadius: 50,
        backgroundColor: '#1A5276',
        borderWidth:2,
        borderColor: '#1A5276',
      },
      fadingContainer: {
        paddingVertical: 5,
        paddingHorizontal: 25,
        backgroundColor: "lightseagreen"
      },
      fadingText: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
        color : "#fff"
      },
      saveButtomModal: {
        backgroundColor: "#922B21",
        borderRadius: 10,
        padding: 10
      },
      exitButtomModal: {
        backgroundColor: "#509080",
        borderRadius: 10,
        padding: 10
      },
      editButtomModal: {
        backgroundColor: "#1B4F72",
        borderRadius: 10,
        padding: 10
      },
      continueButtomModal: {
        backgroundColor: "#2874A6",
        borderRadius: 10,
        padding: 10,
        flexDirection: "row"
      },
      clickImage: {
        padding: 10,
        backgroundColor: "white",
      },
      imagesCount: {
        fontWeight: "bold",
        fontSize: RFPercentage(3),
        color: "#154360"
      }
  })