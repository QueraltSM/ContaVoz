import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, FlatList, BackHandler, ScrollView, Modal, Dimensions, PermissionsAndroid} from 'react-native';
import Voice from 'react-native-voice';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import ImageZoom from 'react-native-image-pan-zoom';

class BuyScreen extends Component {

    constructor(props) {
      super(props);
      this.state = {
        id: this.props.navigation.state.params.id,
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
        buyList: [],
        flatlistPos: 0,
        userid: ""
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
      this.props.navigation.push('BuyList')
      return true
    }
  
    async init() {
      await AsyncStorage.getItem("userid").then((value) => {
        this.setState({ userid: value })
      })
      await AsyncStorage.getItem(this.state.id+"saved").then((value) => {
        if (value != null) {
          this.setState({ saved: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.id+"interpretedEntity").then((value) => {
        if (value != null) {
          this.setState({ interpretedEntity: value })
        }
      })
      await AsyncStorage.getItem(this.state.id+"interpretedNif").then((value) => {
        if (value != null) {
          this.setState({ interpretedNif: value })
        }
      })
      await AsyncStorage.getItem(this.state.id+"interpretedDate").then((value) => {
        if (value != null) {
          this.setState({ interpretedDate: value })
        }
      })
      await AsyncStorage.getItem(this.state.id+"interpretedInvoice").then((value) => {
        if (value != null) {
          this.setState({ interpretedInvoice: value })
        }
      })
      await AsyncStorage.getItem(this.state.id+"interpretedTotal").then((value) => {
        if (value != null) {
          this.setState({ interpretedTotal: value })
        }
      })
      await AsyncStorage.getItem(this.state.id+"setEntity").then((value) => {
        if (value != null) {
          this.setState({ setEntity: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.id+"setNIF").then((value) => {
        if (value != null) {
          this.setState({ setNIF: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.id+"setDate").then((value) => {
        if (value != null) {
          this.setState({ setDate: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.id+"setInvoice").then((value) => {
        if (value != null) {
          this.setState({ setInvoice: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.id+"setTotal").then((value) => {
        if (value != null) {
          this.setState({ setTotal: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.id+"entity").then((value) => {
        if (value != null) {
          this.setState({ entity: value })
        }
      })
      await AsyncStorage.getItem(this.state.id+"nif").then((value) => {
        if (value != null) {
          this.setState({ nif: value })
        }
      })
      await AsyncStorage.getItem(this.state.id+"date").then((value) => {
        if (value != null) {
          this.setState({ date: value })
        }
      })
      await AsyncStorage.getItem(this.state.id+"invoice").then((value) => {
        if (value != null) {
          this.setState({ invoice: value })
        }
      })
      await AsyncStorage.getItem(this.state.id+"total").then((value) => {
        if (value != null) {
          this.setState({ total: value })
        }
      })
      await AsyncStorage.getItem(this.state.userid+"-words").then((value) => {
        if (value != null) {
          this.setState({ words: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.id+"-images").then((value) => {
        if (value != null) {
          this.setState({ images: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.userid+"-buyList").then((value) => {
        if (value != null) {
          this.setState({ buyList: JSON.parse(value) })
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
      this.saveInMemory(this.state.id+"interpretedEntity", this.state.interpretedEntity)
    }
  
    setInterpretedNif() {
      var str = this.state.nif 
      for (let i = 0; i < this.state.words.length; i++) {
        if (this.state.nif.toLowerCase().includes(this.state.words[i].key.toLowerCase())) {
          str = str.toLocaleLowerCase().replace(this.state.words[i].key.toLocaleLowerCase(), this.state.words[i].value)
        }
      }
      this.setState({ interpretedNif: str })
      this.saveInMemory(this.state.id+"interpretedNif", this.state.interpretedNif)
    }
  
    async showDateError() {
      await this.showAlert("Fecha errónea", this.state.date + " es incorrecto")
      this.cancelDate()
    }
  
  
    calculateDate() {
    
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
  
      var indexL = daysL.findIndex((i) => this.state.date.toLowerCase().includes(i.toLowerCase()))
      var indexN = daysN.findIndex((i) => this.state.date.toLowerCase().includes(i.toLowerCase()))
      var indexM = months.findIndex((i) => this.state.date.toLowerCase().includes(i.name.toLowerCase()))
      var aux = this.state.date.split(" ")
  
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
        this.setState({ interpretedDate: d + "/" + m + "/" + new Date().getFullYear() })
      } else if (indexN > -1 && indexM > -1 && day != "") {
        indexM++
        var d = ("0" + day).slice(-2)
        var m = ("0" + indexM).slice(-2)
        if (months[indexM-1].last < day) {
          this.showDateError()
        } else {
          this.setState({ interpretedDate: d + "/" + m + "/" + new Date().getFullYear() })
        }
      } else if (indexL > -1) {
        var d = ("0" + daysN[indexL]).slice(-2)
        if (d > new Date().getDate()) {
          this.setState({ interpretedDate: d + "/" + (("0" + (new Date().getMonth())).slice(-2)) + "/" + new Date().getFullYear() })
        } else {
          this.setState({ interpretedDate: d + "/" + (("0" + (new Date().getMonth() + 1)).slice(-2)) + "/" + new Date().getFullYear() })
        }
      } else if (indexN > -1 && day != "") {
        var d = ("0" + day).slice(-2)
        if (d > new Date().getDate()) {
          this.setState({ interpretedDate: d + "/" + (("0" + (new Date().getMonth())).slice(-2)) + "/" + new Date().getFullYear() })
        } else {
          this.setState({ interpretedDate: d + "/" + (("0" + (new Date().getMonth() + 1)).slice(-2)) + "/" + new Date().getFullYear() })
        }
      } else {
        this.showDateError()
      }
    }
  
    setInterpretedDate() {
      if (this.state.date.toLowerCase() == "hoy") { // Today's case: ok
        this.setState({ interpretedDate: ("0" + (new Date().getDate())).slice(-2)+ "/"+ ("0" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear() })
      } else if (this.state.date.toLowerCase() == "ayer") {
        this.setState({ interpretedDate: ("0" + (new Date().getDate()-1)).slice(-2)+ "/"+ ("0" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear() })
      } else {
        this.calculateDate()
      }
      this.saveInMemory(this.state.id+"interpretedDate", this.state.interpretedDate)
    }
  
    setInterpretedInvoice() {
      var str = this.state.invoice
      for (let i = 0; i < this.state.words.length; i++) {
        if (this.state.invoice.toLowerCase().includes(this.state.words[i].key.toLowerCase())) {
          str = str.toLocaleLowerCase().replace(this.state.words[i].key.toLocaleLowerCase(), this.state.words[i].value)
        }
      }
      this.setState({ interpretedInvoice: str })
      this.saveInMemory(this.state.id+"interpretedInvoice", this.state.interpretedInvoice)
    }
  
    setInterpretedTotal() {
      var str = this.state.total
      for (let i = 0; i < this.state.words.length; i++) {
        if (this.state.total.toLowerCase().includes(this.state.words[i].key.toLowerCase())) {
          str = str.toLocaleLowerCase().replace(this.state.words[i].key.toLocaleLowerCase(), this.state.words[i].value)
        }
      }
      this.setState({ interpretedTotal: str })
      this.saveInMemory(this.state.id+"interpretedTotal", this.state.interpretedTotal)
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
  
    setMicrophoneBarIcon() {
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
  
    setMicrophoneIcon() {
      if (JSON.parse(this.state.is_recording) && !JSON.parse(this.state.saved)) {
        return <Icon
          name='microphone-slash'
          type='font-awesome'
          color='#1A5276'
          size={30}
          onPress={this._stopRecognition.bind(this)}
        />
      }
      return <Icon
        name='microphone'
        type='font-awesome'
        color='#1A5276'
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
      await AsyncStorage.setItem(this.state.userid+"-words", JSON.stringify(arrayWords))
      this.storeTotal()
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
      await AsyncStorage.setItem(this.state.userid+"-words", JSON.stringify(arrayWords))
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
      await AsyncStorage.setItem(this.state.userid+"-words", JSON.stringify(arrayWords))
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
      await AsyncStorage.setItem(this.state.userid+"-words", JSON.stringify(arrayWords))
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
      await AsyncStorage.setItem(this.state.userid+"-words", JSON.stringify(arrayWords))
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
      this.saveInMemory(this.state.id+"setEntity", JSON.stringify(true))
      this.saveInMemory("isBuy", JSON.stringify(true))
      this.saveInMemory(this.state.id+"entity", this.state.entity)
      this.saveInMemory(this.state.id+"interpretedEntity", this.state.interpretedEntity)
      this.setState({is_recording: true})
      this._continue()
    }
  
    async storeNif() {
      this.setState({setNIF: true})
      this.saveInMemory(this.state.id+"setNIF", JSON.stringify(true))
      this.saveInMemory(this.state.id+"nif", this.state.nif)
      this.saveInMemory(this.state.id+"interpretedNif", this.state.interpretedNif)
      this.setState({is_recording: true})
      this._continue()
    }
  
    async storeDate() {
      this.setState({setDate: true})
      this.saveInMemory(this.state.id+"setDate", JSON.stringify(true))
      this.saveInMemory(this.state.id+"date", this.state.date)
      this.saveInMemory(this.state.id+"interpretedDate", this.state.interpretedDate)
      this.setState({is_recording: true})
      this._continue()
    }
  
    async storeInvoice() {
      this.setState({setInvoice: true})
      this.saveInMemory(this.state.id+"setInvoice", JSON.stringify(true))
      this.setState({is_recording: true})
      this.saveInMemory(this.state.id+"invoice", this.state.invoice)
      this.saveInMemory(this.state.id+"interpretedInvoice", this.state.interpretedInvoice)
      this._continue()
    }
  
    async storeTotal() {
      this.setState({setTotal: true})
      this.saveInMemory(this.state.id+"setTotal", JSON.stringify(true))
      this.saveInMemory(this.state.id+"total", this.state.total)
      this.saveInMemory(this.state.id+"interpretedTotal", this.state.interpretedTotal)
      this.setState({saved: true})
      this.saveInMemory(this.state.id+"saved", JSON.stringify(true))
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
      this.setState({setInvoice: false})
      this.setState({is_recording: true})
      this.setState({invoice: ""})
      this.setState({getInvoice: false})
      this.setState({interpretedInvoice: ""})
      this._startRecognition()
    }
  
    cancelTotal = async() => {
      this.setState({setTotal: false})
      this.setState({is_recording: true})
      this.setState({total: ""})
      this.setState({saved: false})
      this.setState({getTotal: false})
      this.setState({interpretedTotal: ""})
      this.saveInMemory(this.state.id+"saved", JSON.stringify(false))
      this._startRecognition()
    }
  
    setEntity = async() => {
      await AsyncStorage.getItem(this.state.id+"interpretedEntity").then((value) => {
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
      await AsyncStorage.getItem(this.state.id+"interpretedNif").then((value) => {
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
      this.storeDate()
    }
  
    setInvoice = async() => {
      await AsyncStorage.getItem(this.state.id+"interpretedInvoice").then((value) => {
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
      await AsyncStorage.getItem(this.state.id+"interpretedTotal").then((value) => {
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
                  this.saveInMemory(this.state.id+"-images", JSON.stringify(arrayImages))
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
            this.saveInMemory(this.state.id+"-images", JSON.stringify(arrayImages))
          }
        })
      } else {
        this.showAlert("Error", "Solo puede adjuntar 10 imágenes")
      }
    }
  
    async deleteBuyDoc() {
      var buyDocs = []
      this.state.buyList.forEach((i) => {
        if (i.id != this.state.id) {
          buyDocs.push(i)
        }
      })
      await AsyncStorage.setItem(this.state.userid+"-buyList", JSON.stringify(buyDocs))
      this.props.navigation.push("BuyList")
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
              resolve(this.deleteBuyDoc());
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
  
    saveEnterprise = () => {
      if (this.state.interpretedEntity != "") {
        console.log("entro")
        this.setEntityModal()
      }
    }
    
    startVoiceControl() {
      return (
          <View style={styles.startVoiceControlView}>
          <Text>
          <Text style={styles.resumeText}>Entidad </Text>
          <Icon
            name='pencil'
            type='font-awesome'
            color='#000'
            size={25}
          />
          </Text>
          <View style={{flexDirection:'row', width:"90%"}}>
          <TextInput multiline={true} style={styles.changeTranscript} placeholder="Disoft" onChangeText={interpretedEntity => this.setState({interpretedEntity})} value={this.state.interpretedEntity}></TextInput>
          {this.setMicrophoneIcon()}
          </View>
          <Text style={styles.transcript}></Text>
          <Text>
          <Text style={styles.resumeText}>NIF </Text>
          <Icon
            name='pencil'
            type='font-awesome'
            color='#000'
            size={25}
          />
          </Text>
          <View style={{flexDirection:'row', width:"90%"}}>
          <TextInput multiline={true} style={styles.changeTranscript} placeholder="B35222249" onChangeText={interpretedNif => this.setState({interpretedNif})} value={this.state.interpretedEntiinterpretedNifty}></TextInput>
          {this.setMicrophoneIcon()}
          </View>
          {(this.state.interpretedEntity != "" || this.state.interpretedNif != "") &&
          (<View>
          <Text style={styles.transcript}></Text>
            <TouchableOpacity onPress={this.saveEnterprise}>
              <Text style={styles.saveNewValue}>Guardar empresa</Text>
            </TouchableOpacity>
          </View>)}
        </View>
      )
    }
  
    setEntityVoiceControl() {
      if (this.state.started.length>0 && this.state.entity.length == 0 && JSON.parse(this.state.is_recording)) {
        return (<View style={styles.voiceControlView}>
          <Text style={styles.listening}>Escuchando entidad...</Text>
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
          <Text style={styles.listening}>Escuchando NIF...</Text>
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
          <Text style={styles.listening}>Escuchando fecha...</Text>
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
          <Text style={styles.listening}>Escuchando nº de factura...</Text>
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
          <Text style={styles.listening}>Escuchando total...</Text>
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
            <Text style={styles.showTitle}></Text>
            <Text style={styles.showTitle}>Debe adjuntar una imagen</Text>
            <Text style={styles.showTitle}>o establecer entidad y/o NIF</Text>
          </View>
        )
      } else if (!JSON.parse(this.state.is_recording) && JSON.parse(this.state.setEntity) && !JSON.parse(this.state.setTotal)) {
        return(
          <View style={styles.resumeView}>
            <Text style={styles.showTitle}>Hay un documento por voz no terminado</Text>
          </View>
        )
      } else if (JSON.parse(this.state.setEntity) && JSON.parse(this.state.setTotal)) {
        return(
          <View style={styles.resumeView}>
            <Text style={styles.showTitle}>Hay un documento por voz terminado</Text>
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
  
    async deleteBuyDoc() {
      var buyDocs = []
      this.state.buyList.forEach((i) => {
        if (i.id != this.state.id) {
          buyDocs.push(i)
        }
      })
      await AsyncStorage.setItem(this.state.userid+"-buyList", JSON.stringify(buyDocs))
      this.props.navigation.push("BuyList")
    }
  
  
    askDeleteBuyDoc = async () => {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "Borrar documento",
          "¿Está seguro que desea borrar permanentemente este documento?",
          [
            {
              text: 'Sí',
              onPress: () => {
                resolve(this.deleteBuyDoc());
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
        <View style={{flex: 1, backgroundColor: "#fff" }}>
          <ScrollView style={{backgroundColor: "#fff", paddingBottom: 100 }}>
            <View style={styles.sections}>
              {this.setImages()}
              {this.startProgramm()}
              {this.startVoiceControl()}
              {this.setEntityVoiceControl()}
              {this.setNIFVoiceControl()}
              {this.setDateVoiceControl()}
              {this.setInvoiceVoiceControl()}
              {this.setTotalVoiceControl()}
            </View>
          </ScrollView>
          <View style={styles.navBarBackHeader}>
         <View style={{ width: 60,textAlign:'center', borderColor:"white", paddingTop:10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10, borderWidth:1 }}>
              <Icon
                name='shopping-cart'
                type='font-awesome'
                color='#FFF'
                size={30}
              />
            </View>
          <View style={{ width: 60,textAlign:'center' }}>
              <Icon
                name='trash'
                type='font-awesome'
                color='#FFF'
                size={30}
                onPress={this.askDeleteBuyDoc}
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
              {this.state.setEntity || this.state.setNIF &&
              (<View style={styles.iconsView}>
                {this.setMicrophoneBarIcon()}
              </View>)
              }
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
                name='check-square'
                type='font-awesome'
                color='#FFF'
                size={30}
                onPress={this.seeDocument}
              />
            </View>)}
          </View>
        </View>
      );
    }
  }

  export default createAppContainer(BuyScreen);

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
        maxHeight:"60%"
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
      startVoiceControlView: {
        flex: 1,
        backgroundColor: "#FFF",
        paddingTop: 40,
        alignContent: "center",
        alignSelf: "center",
        width: "80%",
        paddingBottom:50
      },
  })