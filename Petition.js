import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, BackHandler, ScrollView, Dimensions, PermissionsAndroid, Animated } from 'react-native';
import Voice from 'react-native-voice';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import ImageZoom from 'react-native-image-pan-zoom';
import evaluate from 'words-to-numbers-es';
import { RFPercentage } from "react-native-responsive-fontsize";
import DatePicker from 'react-native-date-picker'
import { Picker } from '@react-native-picker/picker';

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
        cifValue: "",
        images: [],
        words: [],
        list: [],
        savedData: [],
        userid: "",
        saved: false,
        flag: 0,
        fadeAnimation: new Animated.Value(0),
        listenFlag: 0,
        write_data: false,
        placeholder: "",
        payment: "",
        payments: [],
        savedDataCopy: [],
        openDatePicker: false,
        fulldate: "Ej: " + ("0" + (new Date().getDate())).slice(-2)+ "/"+ ("0" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear() + ""
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
      await AsyncStorage.getItem(this.state.petitionID+".saved").then((value) => {
        if (value != null) this.setState({ saved: JSON.parse(value) })
      })
      await AsyncStorage.getItem(this.state.petitionID+".savedData").then((value) => {
        if (value != null) this.setState({ savedData: JSON.parse(value) })
      })
      this.setState({savedData:this.state.savedData})
      if (this.state.savedData.length == 0) {
        var array = []
        this.state.data.forEach((i) => {
          var result = null
          if (i.xdefecto != "") {
            if (i.xdefecto.toLowerCase() == "hoy") {
              result = ("0" + (new Date().getDate())).slice(-2)+ "/"+ ("0" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear()
            } else if (i.xdefecto.toLowerCase() == "ayer") {
              var yesterday = new Date()
              yesterday.setDate(new Date().getDate() - 1)
              result = ("0" + (yesterday.getDate())).slice(-2)+ "/"+ ("0" + (yesterday.getMonth() + 1)).slice(-2) + "/" + yesterday.getFullYear()
            } else {
              result = i.xdefecto
            }
          }
          array.push({
            idcampo:i.idcampo,
            titulo: i.titulo,
            tipoexp: i.tipoexp,
            xdefecto: i.xdefecto,
            obligatorio: i.obligatorio,
            escuchado: "",
            solicitado: i.solicitado,
            valor: result
          })
        })
        await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(array))
        await this.setState({ savedData: array })
      }
      var savedDataCopy = []
      this.state.savedData.forEach(i=> {
        if (i.solicitado == "S" && !i.idcampo.includes("conexion")) savedDataCopy.push(i)
      })
      this.setState({savedDataCopy: savedDataCopy})
      var formapc = this.state.savedDataCopy.findIndex(i=>i.idcampo.includes("formapc"))
      if (formapc>-1) {
        var newPayments = this.state.savedDataCopy[formapc].valor.split(',')
        this.setState({payments: newPayments})
      }
      await AsyncStorage.getItem(this.state.petitionID+".cifValue").then((value) => {
        if (value != null) {
          this.setState({ cifValue: value })
        }
      })
      await AsyncStorage.getItem(this.state.petitionID+".payment").then((value) => {
        if (value != null) this.setState({ payment: value })
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
      this.setState({is_recording:false})
      await this.showAlert("Fecha errónea", "La fecha '" + this.state.listenedData.toLowerCase() + "' es incorrecta")
    }

    setFixedDate() {
      if (this.state.listenedData.toLowerCase() == "hoy") {
        this.setState({ interpretedData: ("0" + (new Date().getDate())).slice(-2)+ "/"+ ("0" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear() })
      } else if (this.state.listenedData.toLowerCase() == "ayer") {
        var yesterday = new Date()
        yesterday.setDate(new Date().getDate() - 1)
        this.setState({ interpretedData: ("0" + (yesterday.getDate())).slice(-2)+ "/"+ ("0" + (yesterday.getMonth() + 1)).slice(-2) + "/" + yesterday.getFullYear() })
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
            var year = /[0-9]{4}/
            if (year.test(this.state.listenedData)) {
              var interpretedYear = RegExp(year).exec(this.state.listenedData)
              this.setState({ interpretedData: d + "/" + m + "/" + interpretedYear })
            } else this.setState({ interpretedData: d + "/" + m + "/" + new Date().getFullYear() })
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
        } else {
          if (this.state.listenedData.includes(".")) this.setState({listenedData: this.state.listenedData.replace(".", ",")})
          if (!this.state.savedData[this.state.listenFlag].idcampo.includes("porcentaje") && this.state.savedData[this.state.listenFlag].tipoexp=="N" && !this.state.listenedData.includes(",")) this.setState({ listenedData: this.state.listenedData + ",00" })
          this.setState({ interpretedData: this.state.listenedData.split(' ').join("").replace("/",".") })
          this.resetListening()
        }
      } else {
        this.setState({ listenedData: number + "" })
        this.setState({ interpretedData: number + "" })
        this.resetListening()
      }
    }

    async saveCIF(cif){
      await this.setState({cifValue: cif})
      await AsyncStorage.setItem(this.state.petitionID+".cifValue", cif)
    }

    setFixedData() {
      var listenedData = this.state.listenedData.toLowerCase()
      var sameKeywords = this.state.words.findIndex(obj => obj.keywords.toLowerCase().includes(listenedData))
      var sameEntity = this.state.words.findIndex(obj => obj.entity.toLowerCase().includes(listenedData))
      if (sameKeywords > -1) {
        this.setState({ interpretedData: this.state.words[sameKeywords].entity })
        this.saveCIF(this.state.words[sameKeywords].cifValue)
      } else if (sameEntity > -1) {
        this.setState({ interpretedData: this.state.words[sameEntity].entity })
        this.saveCIF(this.state.words[sameEntity].cifValue)
      } else {
        this.setState({ interpretedData: this.state.listenedData })
        this.saveCIF("")
      }
      this.resetListening()
    }

    async setListenedData() {
      if (this.state.interpretedData.length==0 && this.state.listenedData.length>0) await this.setState({interpretedData: this.state.listenedData}) 
      if (this.state.savedData[this.state.listenFlag].tipoexp == "F") this.setFixedDate()
      else if (this.state.savedData[this.state.listenFlag].tipoexp == "N") this.setFixedNumber()
      else if (this.state.savedData[this.state.listenFlag].tipoexp == "E") this.setFixedData()
      else if (this.state.savedData[this.state.listenFlag].idcampo.includes("factura")) await this.setState({interpretedData: this.state.interpretedData.toUpperCase()}) 
      this.resetListening()
    }
  
    onSpeechResults(e) {
      var res = e.value + ""
      var word = res.split(",")
      this.setState({listenedData: word[0]});
      if (this.state.savedData[this.state.listenFlag].idcampo=="factura") this.setState({listenedData:this.state.listenedData.toUpperCase().split(' ').join("")})
      if (this.state.savedData[this.state.listenFlag].tipoexp == "E") {
        var sameKeywords = this.state.words.findIndex(item => item.keywords.toLowerCase().includes(this.state.listenedData.toLowerCase()))
        if (sameKeywords>-1) {
          this.state.savedData[this.state.listenFlag].valor = this.state.words[sameKeywords].entity
          this.setState({ cif: this.state.words[sameKeywords].cifValue })
        } 
      }
      if (this.state.savedData[this.state.listenFlag].tipoexp != "1" && this.state.savedData[this.state.listenFlag].tipoexp != "E" && this.state.savedData[this.state.listenFlag].tipoexp != "F") {
        this.setState({listenedData:this.state.listenedData.split(' ').join("")})
      }
      this.setListenedData()
    }
  
    async _startRecognition(e) {
      this.setState({ listenedData: "" })
      this.setState({ interpretedData: "" })
      this.setState({ recognized: '', started: '', results: []});
      if (this.state.listenFlag<this.state.savedData.length) {
        this.setState({is_recording: true })
        if (this.state.savedData[this.state.listenFlag].valor != null) this.setState({ interpretedData: this.state.savedData[this.state.listenFlag].valor })
        try {
          await Voice.start('es');
        } catch (e) {}
      }
    }

    async _stopRecognition(e) {
      await this.setState({ is_recording: false })
      try {
        if (this.state.listenedData.length>0 && this.state.listenFlag < this.state.savedDataCopy.length) await this.updateListen(1)
        await Voice.stop()
      } catch (e) {}
    }

    setMicrophoneIcon() {
      if (this.state.is_recording) return (<View style={{ width: 70,textAlign:'center' }}><TouchableOpacity onPressOut={this._stopRecognition.bind(this)}><Icon name='microphone' type='font-awesome' color='#1A5276' size={40} /></TouchableOpacity></View>)
      return (<View style={{ width: 70,textAlign:'center' }}><TouchableOpacity onPressIn={this._startRecognition.bind(this)}><Icon name='microphone' type='font-awesome' color='#1A5276' size={40} /></TouchableOpacity></View>)
    }

     takePhoto = async() =>{
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA, { title: "ContaVoz", message:"Necesitamos permisos para acceder a su cámara", buttonNegative: "Cancelar", buttonPositive: "Aceptar" }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            let options = {
              title: 'Hacer una foto',
              quality: 0.5,
              aspect:[4,3],
              customButtons: [ { name: 'customOptionKey', title: 'Choose Photo from Custom Option' }, ],
              storageOptions: {
                skipBackup: true,
                path: 'images',
                privateDirectory: true,
              },
              includeBase64: false
            };
            if (this.state.images.length <= 9) {
              ImagePicker.launchCamera(options, (response) => {
                if (response.didCancel || response.error || response.customButton) {
                } else {
                  var arrayImages = this.state.images
                  var uri = JSON.stringify(response.assets[0]["uri"])
                  var newID = this.state.petitionID+"_"+(this.state.images.length+1)
                  arrayImages.push({
                    id: newID,
                    nombre: newID,
                    id_drive:'1qdFovzRbbT2rBKm2WdOMEXmO5quFHDgX',
                    urid: "1o4klNg4jXvJSOQ4_VAFKSFsUPOKWoMBR",
                    uri: uri.replace(/['"]+/g, '')
                  })
                  this.setState({images: arrayImages})
                  this.saveImages()
                }
              })
            } else {
              this.showAlert("Error", "Solo puede adjuntar 10 imágenes")
            }
          }
        } catch (err) {}
    }
  
    async saveImages() {
      var list = []
      await AsyncStorage.getItem(this.state.petitionType).then((value) => {
        if (value != null) list = JSON.parse(value) 
      })
      var index = list.findIndex(obj => JSON.stringify(obj.id) == this.state.petitionID)
      list[index].images = this.state.images
      await AsyncStorage.setItem(this.state.petitionType, JSON.stringify(list))
      await AsyncStorage.setItem(this.state.petitionID+".images", JSON.stringify(this.state.images))
    }
  
    goGallery = async() =>{
      let options = {
        title: 'Foto desde la galería',
        customButtons: [
          { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
        ],
        includeBase64: false,
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      if (this.state.images.length <= 9) {
        ImagePicker.launchImageLibrary(options, (response) => {
          if (response.didCancel || response.error || response.customButton) {
          } else {
            var arrayImages = this.state.images
            var uri = JSON.stringify(response.assets[0]["uri"])
            var newID = this.state.petitionID+"_"+(this.state.images.length+1)
            arrayImages.push({
              id: newID,
              nombre: newID,
              id_drive:'1qdFovzRbbT2rBKm2WdOMEXmO5quFHDgX',
              urid: "1o4klNg4jXvJSOQ4_VAFKSFsUPOKWoMBR",
              uri: uri.replace(/['"]+/g, '')
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
      if (this.state.images.length<=1) return null
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
          cropHeight={Dimensions.get('window').height/3}
          imageWidth={Dimensions.get('window').width}
          imageHeight={Dimensions.get('window').height/3}>
            <TouchableOpacity onPress={() => this.seeImage(this.state.images[this.state.flag])}>
            <Image
              source={{
                uri: this.state.images[this.state.flag].uri,
              }}
              resizeMode="cover"
              key={this.state.flag}
              style={{ width: Dimensions.get('window').width, height: (Dimensions.get('window').height)/3}}
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
      /*return (
        <View style={styles.imagesSection}>
          <Image source={require('./assets/no-photo.png')} resizeMode="contain" key="0" style={{ width: 150, height: 150 }} />
        </View>
      )*/
      return null
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

    setModalButtons(){
      return (<View style={styles.modalNavBarButtons}>
        {this.state.listenFlag>0 && (<View style={{paddingRight: 20, paddingLeft: 20}}><TouchableOpacity onPress={() => this.updateListen(-1)} style={styles.saveButtomModal}><Icon name='arrow-left' type='font-awesome' color='white' size={32}/></TouchableOpacity></View>)}
        {this.state.listenFlag < this.state.savedDataCopy.length-1 && this.state.listenFlag>-1 && (<View style={{paddingRight: 20, paddingLeft: 20}}><TouchableOpacity onPress={() => this.updateListen(1)} style={styles.exitButtomModal}><Icon name='arrow-right' type='font-awesome' color='white' size={32}/></TouchableOpacity></View>)}
      </View>)
    }

    setVoiceControlView() {
      this.fadeIn()
      return (<View style={styles.titleView}>
          <Animated.View style={[ { opacity: this.state.fadeAnimation, width:"90%" }]}>
            {this.state.listenedData.length==0 && <Text style={styles.showListen}>Escuchando {this.state.savedDataCopy[this.state.listenFlag].titulo.toLowerCase()}</Text>}
          </Animated.View>
          {this.state.listenedData.length>0 && <Text style={styles.showSubNextData}>Ha dicho {this.state.savedDataCopy[this.state.listenFlag].escuchado.toLowerCase()}</Text>}
          {this.state.listenedData.length == 0 && <Text style={styles.infoListen}>Mantenga pulsado el micrófono y espere</Text>}
          {this.state.listenedData.length > 0 && <Text style={styles.infoListen}>Deje de pulsar el micrófono</Text>}
      </View>)
    }

    async updateSavedData() {
      for (let i = 0; i<this.state.savedData.length;i++) {
        if (this.state.savedData[i].idcampo == this.state.savedDataCopy[this.state.listenFlag].idcampo) {
          this.state.savedData[i].valor = this.state.savedDataCopy[this.state.listenFlag].valor
        }
      }
      await this.setState({ savedData: this.state.savedData })
      await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(this.state.savedData))
    }

    async updateListen(value) {
      await this.setState({ listenedData: "" })
      if (this.state.listenFlag < this.state.savedDataCopy.length-1) {
      if (this.state.interpretedData.length>0) this.state.savedData[this.state.listenFlag].valor = this.state.interpretedData
      await this.setState({ interpretedData: "" })
      await this.setState({ listenFlag: Number(this.state.listenFlag) + Number(value) })
      this.updateSavedData()
      await AsyncStorage.setItem(this.state.petitionID+".listenFlag", JSON.stringify(this.state.listenFlag))
      if (this.state.cifValue.length>0) await AsyncStorage.setItem(this.state.petitionID+".cifValue",this.state.cifValue) 
    } else if (value<0) {
      this.setState({ is_recording: false})
      await this.setState({ listenFlag: Number(this.state.listenFlag) - 1})
    }
    await this.saveDocument()
  }

    setVoiceControl() {
      if (JSON.parse(this.state.is_recording & this.state.listenFlag>=0 && this.state.listenFlag<=this.state.savedDataCopy.length-1)) return this.setVoiceControlView()
      return this.setModalButtons()
    }

    async resetListening() {
      this.state.savedData[this.state.listenFlag].escuchado = this.state.listenedData
      this.state.savedData[this.state.listenFlag].valor = this.state.interpretedData
      this.updateSavedData()
    }

    async saveCalculation(result) {
      this.state.savedData[this.state.listenFlag].escuchado = result
      this.state.savedData[this.state.listenFlag].valor = result
      await this.setState({ interpretedData: result })
    }

    // si retencion impiesti=retten+%igic
    // si no rettem=0
    // baes imp=formula
    // si hay impiesto = +baes imponibles 
    async setBaseRetencion(){
      var result = 0
      var importeIndex = this.state.savedData.findIndex(obj => obj.idcampo.includes("importe"))
      var importe = this.state.savedData[importeIndex].valor
      if (importe.includes(",")) importe = importe.replace(",",".") 
      var retencion = this.state.savedData[this.state.listenFlag-1].valor
      result = 100 - Number(retencion) //+ porcentaje si hay igic = 920*100/92  base impo
      result = importe*100/result
      result = result.toFixed(2) + ""
      this.saveCalculation(result)
    }

    async setBase() {
      var result = 0
      var importeIndex = this.state.savedData.findIndex(obj => obj.idcampo.includes("importe"))
      var importe = this.state.savedData[importeIndex].valor
      if (importe.includes(",")) importe = importe.replace(",",".") 
      var porcentaje =  this.state.savedData[this.state.listenFlag-1].valor
      var x = 100 + Number(porcentaje)
      result = (importe*100)/x
      result = Math.round(result * 100) / 100
      result = result.toFixed(2) + ""
      this.saveCalculation(result)
    }

    async setCuota() {
      var result = 0
      var porcentaje =  this.state.savedData[this.state.listenFlag-2].valor
      var base = this.state.savedData[this.state.listenFlag-1].valor + ""
      if (base.includes(",")) base = base.replace(",",".") 
      result = Number(base)*Number(porcentaje)
      result = Math.round(result/100)
      result = result.toFixed(2) + ""
      this.saveCalculation(result)
    }

    async calculateResult() {
      var bases = this.state.savedData.filter(i => i.idcampo.includes("base") && !i.idcampo.includes("retencion"))
      if (this.state.savedData[this.state.listenFlag].idcampo.includes("base") && this.state.savedData[this.state.listenFlag].idcampo.includes("retencion")) this.setBaseRetencion()
      else if (this.state.savedData[this.state.listenFlag].idcampo.includes("base") && bases.length == 1) this.setBase()
      else if (this.state.savedData[this.state.listenFlag].idcampo.includes("cuota")) this.setCuota()
    }

    async setSelectedPayment(itemValue) {
      await this.setState({payment:itemValue})
      await AsyncStorage.setItem(this.state.petitionID+".payment", itemValue)
    }

    setDate = async (date) => {
      var d = ("0" + (date.getDate())).slice(-2)+"/"+("0" + (date.getMonth() + 1)).slice(-2)+"/"+date.getFullYear()
      this.state.savedData[this.state.listenFlag].valor = d
      this.state.savedDataCopy[this.state.listenFlag].valor = d
      this.setState({savedDataCopy:this.state.savedDataCopy})
      this.updateSavedData()
    }

    openDatePicker = (value) => {
      this.setState({openDatePicker: value})
    }

    setDatePicker() {
      if (!this.state.openDatePicker) return <TouchableOpacity onPress={() => this.openDatePicker(true)} style={{width:"100%"}}><TextInput editable={false} style={styles.changeTranscript} placeholder={this.state.fulldate}>{this.state.savedDataCopy[this.state.listenFlag].valor}</TextInput></TouchableOpacity>
      return <View><TouchableOpacity onPress={() => this.openDatePicker(true)} style={{width:"100%"}}><TextInput editable={false} style={styles.changeTranscript} placeholder={this.state.fulldate}>{this.state.savedDataCopy[this.state.listenFlag].valor}</TextInput></TouchableOpacity><DatePicker
      modal mode="date" title="Selecciona fecha" confirmText="OK" cancelText="Cancelar" open={this.state.openDatePicker} date={new Date()}
      onConfirm={(date) => {
        this.openDatePicker(false)
        this.setDate(date)
      }}
      onCancel={() => {
        this.openDatePicker(false)
      }}/></View>
    }

    setWrittenData() {
      if (this.state.savedDataCopy.length==0) return null
      return (<View style={styles.modalResult}>
        <Text style={styles.defaultDataTitle}>{this.state.savedDataCopy[this.state.listenFlag].titulo}</Text>
        {!this.state.savedDataCopy[this.state.listenFlag].idcampo.includes("formapc") && this.state.savedDataCopy[this.state.listenFlag].idcampo.includes("fecha") && this.setDatePicker()}
        {!this.state.savedDataCopy[this.state.listenFlag].idcampo.includes("formapc") && this.state.savedDataCopy[this.state.listenFlag].tipoexp== "N" && <TextInput keyboardType='numeric' placeholder={this.state.placeholder}  blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={listenedData => this.setState({listenedData: listenedData})}>{this.state.savedDataCopy[this.state.listenFlag].valor}</TextInput>}
        {!this.state.savedDataCopy[this.state.listenFlag].idcampo.includes("formapc") && !this.state.savedDataCopy[this.state.listenFlag].idcampo.includes("fecha") && this.state.savedDataCopy[this.state.listenFlag].tipoexp!= "N" && <TextInput placeholder={this.state.placeholder}  blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={listenedData => this.setState({listenedData: listenedData})}>{this.state.savedDataCopy[this.state.listenFlag].valor}</TextInput>}
        {this.state.savedDataCopy[this.state.listenFlag].tipoexp=="E" &&
          (<View><Text style={styles.defaultDataTitle}>CIF de la empresa</Text>
            <TextInput blurOnSubmit={true} multiline={true} placeholder="CIF no registrado" style={styles.changeTranscript} onChangeText={cifValue => this.setState({cifValue})}>{this.state.cifValue}</TextInput>
          </View>)}
        {this.state.savedDataCopy.length > 0 && this.state.savedDataCopy[this.state.listenFlag].idcampo.includes("formapc") && (<View>
        <View style={styles.pickerView}>
          <Picker
          selectedValue={this.state.payment}
          onValueChange={(itemValue) =>
            this.setSelectedPayment(itemValue)}>
            {this.state.payments.map((i) => {
              return <Picker.Item label={i} value={i} key={i} />
          })}
        </Picker>
        </View>
      </View>)}
      </View>)
    }

    showMessage = (message) => {
      if (this.state.savedData.length==0) return null
      if (this.state.is_recording) return null
      return(<View style={styles.titleView}>
          <Text style={styles.stateDoc}>{message}</Text>
          <Text style={styles.showHeader}>Adjunte imágenes, diga o introduzca datos</Text>
          {this.setWrittenData()}
        </View>)
    }
  
    async saveDocument() {
      var list = []
      await AsyncStorage.getItem(this.state.petitionType).then((value) => {
        if (value != null) list = JSON.parse(value) 
      })
      var index = list.findIndex(obj => JSON.stringify(obj.id) == this.state.petitionID)
      list[index].savedData = this.state.savedData
      await AsyncStorage.setItem(this.state.petitionType, JSON.stringify(list))
    }

    saveListenedData = async() => {
      this.state.savedData[this.state.listenFlag].valor = this.state.listenedData
      this.state.savedDataCopy[this.state.listenFlag].valor = this.state.listenedData
      this.updateSavedData()
      if (!this.state.is_recording) await this.setState({listenedData: ""})
    }

    documentState = () => {
      if (this.state.savedDataCopy.length==0) return null
      if (this.state.savedDataCopy[this.state.listenFlag].tipoexp == "E") this.state.placeholder = "Ej: Disoft Servicios Informáticos S.L."
      else if (this.state.savedDataCopy[this.state.listenFlag].tipoexp == "F") this.state.placeholder = this.state.fulldate
      else if (this.state.savedDataCopy[this.state.listenFlag].idcampo.includes("factura")) this.state.placeholder = "Ej: 1217 o F-1217"
      else if (this.state.savedDataCopy[this.state.listenFlag].idcampo.includes("importe")) this.state.placeholder = "Ej: 1070 o 1070,00"
      else if (this.state.savedDataCopy[this.state.listenFlag].idcampo.includes("porcentaje")) this.state.placeholder = "Ej: 3 o 7"
      else if (!this.state.savedDataCopy[this.state.listenFlag].idcampo.includes("base") &&  !this.state.savedDataCopy[this.state.listenFlag].idcampo.includes("cuota") && this.state.savedDataCopy[this.state.listenFlag].tipoexp == "N") this.state.placeholder = "Ej: 10 o 10,5"
      else if (!this.state.savedDataCopy[this.state.listenFlag].idcampo.includes("base") &&  !this.state.savedDataCopy[this.state.listenFlag].idcampo.includes("cuota")) this.state.placeholder = "Diga o introduzca dato"
      if (this.state.listenedData!=null && this.state.listenedData.length>0) this.saveListenedData()
      if (this.docIsCompleted()) return this.showMessage("Documento con datos solicitados completo")
      return this.showMessage("Documento no finalizado")
    }
  
    seeDocument = async () => {
      if (this.state.cifValue.length>0) await AsyncStorage.setItem(this.state.petitionID+".cifValue",this.state.cifValue) 
      this.props.navigation.push('ResumeView')
    }

    async deleteDoc() {
      var chargeDocs = []
      this.state.list.forEach((i) => {
        if (i.id != this.state.petitionID) chargeDocs.push(i)
      })
      await AsyncStorage.setItem(this.state.petitionType, JSON.stringify(chargeDocs))
      this.goBack()
    }
  
    askDeleteDoc = async () => {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "Borrar documento", "¿Está seguro que desea borrar permanentemente este documento?",
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

    docIsCompleted() {
      var index = this.state.savedDataCopy.findIndex(i => i.valor == null)
      var indexNotNull = this.state.savedDataCopy.findIndex(i => i.valor != null)
      if (this.state.images.length>0 && indexNotNull==-1 && this.state.cifValue.length==0) return true 
      if (index==-1 && this.state.cifValue.length>0) return true
      return false
    }

    endDocument() {
      this.showAlert("Error", "Debe finalizar el documento adjuntando imágenes o completando el documento de voz")
    }

    setMenu() {
        return (
        <View style={styles.navBarBackHeader}>
           {!this.state.is_recording &&
            <View style={{ width: 70,textAlign:'center' }}>
              <TouchableOpacity onPress={() => this.askDeleteDoc()}>
              <Icon
                name='trash'
                type='font-awesome'
                color="#B03A2E"
                size={40}
              />
              </TouchableOpacity>
            </View>
            }
            {!this.state.is_recording &&
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
              }
              {this.setMicrophoneIcon()}
              {!this.state.is_recording &&
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
            }
            {!this.state.is_recording && this.docIsCompleted() &&
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
            {!this.state.is_recording && !this.docIsCompleted() &&
            (<View style={{ width: 70,textAlign:'center' }}>
              <TouchableOpacity onPress={() => this.endDocument()}>
              <Icon
                name='check-square'
                type='font-awesome'
                color='#8A8887'
                size={40}
              />
              </TouchableOpacity>
            </View>)}
          </View>
        )
    }

    render () {
      if (this.state.savedData.length==0) return null
      return (
        <View style={{ flex: 1 }}>
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
                {this.setAllFlags()}
                {this.documentState()}
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
      navBarHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#1A5276", 
        flexDirection:'row', 
        textAlignVertical: 'center',
      },
      navBarBackHeader: {
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"white", 
        flexDirection:'row', 
        textAlignVertical: 'center',
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
      showHeader: {
        paddingTop: 20,
        textAlign: 'center',
        color: '#117864',
        fontWeight: 'bold',
        fontSize: RFPercentage(3),
        width: "100%",
      },
      stateDoc: {
        paddingTop: 20,
        textAlign: 'center',
        color: '#922B21',
        fontWeight: 'bold',
        fontSize: RFPercentage(3.2),
        width: "100%",
      },
      showTitle:{
        paddingTop: 20,
        textAlign: 'center',
        color: '#154360',
        fontWeight: 'bold',
        fontSize: RFPercentage(3),
        width: "100%",
      },
      defaultDataTitle: {
        paddingTop: 20,
        textAlign: 'center',
        color: '#154360',
        fontWeight: 'bold',
        fontSize: RFPercentage(3),
        width: "100%",
        paddingBottom: 10,
        textDecorationLine: 'underline'
      },
      showListen:{
        textAlign: 'center',
        color: '#154360',
        fontWeight: 'bold',
        fontSize: RFPercentage(4),
        width: "100%",
        paddingBottom: 10,
        paddingTop: 10,
      },
      showSubTitle: {
        textAlign: 'center',
        color: 'black',
        fontWeight: 'bold',
        fontSize: RFPercentage(3),
        width: "100%",
        paddingTop: 10
      },
      showSubNextData: {
        textAlign: 'center',
        color: '#117A65',
        fontSize: RFPercentage(4),
        width: "100%",
        paddingTop: 20,
        fontWeight: 'bold',
      },
      showNextData: {
        textAlign: 'center',
        color: '#3498DB',
        fontSize: RFPercentage(2.5),
        width: "100%",
        paddingTop: 20,
        fontWeight: 'bold',
      },
      infoListen:{
        textAlign: 'center',
        color: '#C0392B',
        fontSize: RFPercentage(4),
        width: "100%",
        paddingTop: 20,
        fontWeight: 'bold'
      },
      pickerView: {
        color: '#000',
        fontSize: RFPercentage(2.5),
        textAlign:"center",
        width:"100%",
        borderWidth: 0.5,
        borderColor: "darkgray",
        borderRadius: 20
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
        backgroundColor: "#1A5276",
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
        borderColor: "darkgray",
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
        alignItems: "center",
        paddingBottom: 20
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
  })