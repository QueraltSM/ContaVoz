import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, FlatList, BackHandler, ScrollView, Dimensions, PermissionsAndroid, Modal, Animated } from 'react-native';
import Voice from 'react-native-voice';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import ImageZoom from 'react-native-image-pan-zoom';
import evaluate from 'words-to-numbers-es';

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
          fadeAnimation: new Animated.Value(0),
          timer: 0,
          seconds: 10
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
          array.push({
            idcampo:i.idcampo,
            titulo: i.titulo,
            tipoexp: i.tipoexp,
            xdefecto: i.xdefecto,
            valor: null
          })
        })
        await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(array))
        this.setState({ savedData: array })
      }
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
    }

    async setFixedNumber() {
      if (this.state.listenedData.includes("con")) this.setState({ listenedData: this.state.listenedData.replace("con", ".")})
      var number = evaluate(this.state.listenedData);
      if (number==0) {
        if (isNaN(this.state.listenedData)) this.showAlert("Error", "El dato aportado no es numérico")
        else this.setState({ interpretedData: this.state.listenedData.split(' ').join("").replace("/",".") })
      } else {
        this.setState({ listenedData: number + "" })
        this.setState({ interpretedData: number + "" })
      }
    }

    setOptionalData(d,v){
      this.setState({optionalData: d})
      this.setState({optionalValue: v})
      this.setState({lastOptionalValue: v})
    }

    setFixedData() {
      var listenedData = this.state.listenedData.toLowerCase()
      var interpretedKey = this.state.words.findIndex(obj => obj.key.toLowerCase().includes(listenedData))
      var interpretedValue = this.state.words.findIndex(obj => obj.value.toLowerCase().includes(listenedData))
      if (interpretedKey > -1) {
        var interpretedData = this.state.words[interpretedKey].value.toLowerCase()
        var dataValue = this.state.words.findIndex(obj => obj.key.toLowerCase().includes(interpretedData))
        if (dataValue == -1) {
          this.setState({ interpretedData: this.state.words[interpretedKey].key })
          this.setOptionalData("NIF asociado", this.state.words[interpretedKey].value)
        } else {
          this.setState({ interpretedData: this.state.words[interpretedKey].value })
          this.setOptionalData("NIF asociado", this.state.words[dataValue].value)
        }
      } else if (interpretedValue > -1) {
        var interpretedData = this.state.words[interpretedValue].value.toLowerCase()
        var dataValue = this.state.words.findIndex(obj => obj.value.toLowerCase().includes(interpretedData))
        if (dataValue == -1) {
          this.setState({ interpretedData: this.state.words[interpretedValue].key })
          this.setOptionalData("Entidad asociada", this.state.words[interpretedValue].key)
        } else {
          this.setState({ interpretedData: this.state.words[interpretedValue].value })
          this.setOptionalData("Entidad asociada", this.state.words[dataValue].key)
        }
      } else {
        this.setState({ interpretedData: this.state.listenedData })
        this.setOptionalData("Empresa no encontrada", "")
      }
    }

    async setListenedData() {
      var lastSaved = this.state.savedData.findIndex(obj => obj.valor == null)
      if (this.state.data[lastSaved].tipoexp == "F") {
        this.setFixedDate()
      } else if (this.state.data[lastSaved].tipoexp == "N") {
        this.setFixedNumber()
      } else {
        this.setFixedData()
      }
    }
  
    onSpeechResults(e) {
      var res = e.value + ""
      var word = res.split(",")
      if (word[0].length>0) {
        this._stopRecognition(e)
      }
      this.setState({
        listenedData: word[0],
      });
      var lastSaved = this.state.savedData.findIndex(obj => obj.valor == null)
      if (this.state.data[lastSaved].idcampo=="factura") {
        this.setState({listenedData:this.state.listenedData.toUpperCase()})
      }
      if (this.state.data[lastSaved].tipoexp != "E" && this.state.data[lastSaved].tipoexp != "F") {
        this.setState({listenedData:this.state.listenedData.split(' ').join("")})
      }
      this.setState({getData: true})
      this.setListenedData()
    }
  
    async _startRecognition(e) {
      var lastSaved = this.state.savedData.findIndex(obj => obj.valor == null)
      this.setState({is_recording: JSON.stringify(true)})
      var idcampo = this.state.data[lastSaved].idcampo
      if ((!idcampo.includes("base") && !idcampo.includes("cuota") && this.state.data[lastSaved].xdefecto == "") || 
      (idcampo.includes("base") && idcampo.includes("cuota") && this.state.data[lastSaved].xdefecto != "")) {
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
        this.setTimer(e)
      } else {
        this.setState({ interpretedData : this.state.data[lastSaved].xdefecto })
      }
    }

    async setTimer (e) {
      if (this.state.seconds > 0 ) {
        var timer = setTimeout(() => {
          this.setState({ seconds: this.state.seconds-1})
          this.setTimer(e)
        },1000);
      } else {
          if (this.state.listenedData.length == 0) {
            this.showAlert("Atención", "El tiempo de escucha ha expirado")
          }
          this._stopRecognition(e)
          clearTimeout(this.state.timer)
      }
      this.setState({ timer: timer })
    }
  
    async _stopRecognition(e) {
      await this.setState({ is_recording: JSON.stringify(false) })
      await this.setState({ seconds: 10 })
      clearTimeout(this.state.timer)
      try {
        await Voice.stop()
      } catch (e) {}
    }
  
    noMoreAudio() {
      this.showAlert("Atención", "El documento de voz ha sido completado")
    }

    setMicrophoneIcon() {
      var lastSaved = this.state.savedData.findIndex(obj => obj.valor == null)
      if (this.state.savedData.length>0 && lastSaved==-1) {
        return <Icon
          name='microphone'
          type='font-awesome'
          color='#1A5276'
          size={35}
          onPress={() => this.noMoreAudio()}
        />
      } else if (this.state.savedData.length>0) {
        var idcampo = this.state.data[lastSaved].idcampo
        var xdefecto = this.state.data[lastSaved].xdefecto
        if ((idcampo.includes("base") && this.state.data[lastSaved+1].xdefecto != "")
        || (idcampo.includes("porcentaje") && this.state.data[lastSaved].xdefecto != "")
        || (idcampo.includes("cuota")) || xdefecto != "") {
          return <Icon
          name='microphone'
          type='font-awesome'
          color='#1A5276'
          size={35}
          onPress={this._startRecognition.bind(this)}
        />
        } else if (JSON.parse(this.state.is_recording) && !JSON.parse(this.state.saved)) {
          return <Animated.View style={[ { opacity: this.state.fadeAnimation }]}>
            <Icon
              name='microphone-slash'
              type='font-awesome'
              color='#B03A2E'
              size={35}
          />
          </Animated.View>
        }
        return <Icon
          name='microphone'
          type='font-awesome'
          color='#1A5276'
          size={35}
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
              message:"Necesitamos permisos para acceder a su cámara",
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
      return (<ImageZoom
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
        )}
      return (
        <View style={styles.imagesSection}>
        <Text style={styles.transcript}></Text>
        <Image source={require('./assets/no-photo.png')} resizeMode="contain" key="0" style={{ width: 180, height: 180 }} />
        </View>
      )
    }
  
    async setNullData(){
      var lastSaved = this.state.savedData.findIndex(obj => obj.valor == null)
      var percentageIndexes = this.state.savedData.map((item, i) => item.idcampo.includes("porcentaje") ? i : null).filter(i => i !== null)
      var array = this.state.savedData
      array[lastSaved].valor = ""
      if (array[lastSaved].idcampo.includes("porcentaje")) {
        percentageIndexes.forEach((i) => {
          array[i].valor = ""
          array[i+1].valor = ""
          array[i+2].valor = ""
        })
      }
      await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(array))
      this.setState({ savedData: array })
      this.setState({ listenedData: "" })
      this.setState({ interpretedData: "" })
      this.setState({ is_recording: JSON.parse(false) })
      this.saveDocument()
    }

    askSkip() {
      this._stopRecognition(null)
      var lastSaved = this.state.savedData.findIndex(obj => obj.valor == null)
      var message = "¿Está seguro de que desea omitir este dato?"
      if (this.state.savedData[lastSaved].idcampo.includes("porcentaje")) {
        message = "Si omite este dato no se incluirán en el documento ni la base ni la cuota. ¿Está seguro de que desea omitirlo?"
      }
      return this.skipData("Omitir " + this.state.savedData[lastSaved].titulo.toLowerCase(), message)
    }

    async skipData(title, message) {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(title, message,
          [
            {
              text: 'Sí',
              onPress: () => {
                resolve(this.setNullData());
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
      var lastSaved = this.state.savedData.findIndex(obj => obj.valor == null)
      if (this.state.savedData[lastSaved].idcampo.includes("base") || this.state.savedData[lastSaved].idcampo.includes("cuota")) {
        return this.setDisplayDataModal(lastSaved)
      }
      if (this.state.savedData[lastSaved].xdefecto != "") {
        return this.setDefaultData(this.state.savedData[lastSaved])
      }
      this.fadeIn()
      return (<View style={styles.titleView}>
          <Animated.View style={[ { opacity: this.state.fadeAnimation }]}>
            <Text style={styles.showListen}>Escuchando {this.state.data[lastSaved].titulo.toLowerCase()}</Text>
          </Animated.View>
          <Text style={styles.secondsLabel}>({this.state.seconds})</Text>
        {lastSaved+1 < this.state.savedData.length && <Text style={styles.showNextData}>Siguiente dato: {this.state.data[lastSaved+1].titulo}</Text>}
        {this.state.data[lastSaved].obligatorio=="N" &&
        (<View><TouchableOpacity onPress={() => this.askSkip()}><Text style={styles.skipButton}>Omitir</Text></TouchableOpacity></View>)}
      </View>)
    }

    setVoiceControl() {
      var lastSaved = this.state.savedData.findIndex(obj => obj.valor == null)
      if (JSON.parse(this.state.is_recording) && lastSaved>-1) {
        return this.setVoiceControlView()
      } else if (lastSaved>-1 && JSON.parse(this.state.getData) && !JSON.parse(this.state.setData)) {
        return this.setDataModal()
      }
      return null
    }

    async saveEnterprise() {
      var arrayWords =  this.state.words
      if (!this.state.words.some(item => item.key.toLowerCase() === this.state.interpretedData.toLowerCase())) {
        arrayWords.push({
          key: this.state.interpretedData,
          value: this.state.optionalValue,
          time: new Date().getTime(),
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
      this.setState({ is_recording: JSON.stringify(false) })
      this.setState({ listenedData: "" })
      this.setState({ interpretedData: "" })
    }

    saveNextData = async () => {
      this.saveData()
      this._startRecognition()
    }

    saveData = async () => {
      if (this.state.lastOptionalValue != this.state.optionalValue) {
        this.askSaveEnterprise()
      } else {
        this.storeData()
      }
    }

    cancelData = () => {
      this.setState({is_recording: false})
      this.setState({listenedData: ""})
      this.setState({interpretedData: ""})
    }

    setDefaultData(data) {
      var result = data.xdefecto
      return(<Modal
        animationType = {"slide"}
        transparent={true}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Text style={styles.showTitle}>{data.titulo}</Text>
          <View>
            <Text style={styles.resumeText}>Valor por defecto <Icon name='pencil' type='font-awesome' color='#000' size={20}/></Text>
            <TextInput blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={result => this.state.interpretedData=result}>{result}</TextInput>
          </View>
            <Text style={styles.transcript}></Text>
            <View style={styles.modalNavBarButtons}>
              <TouchableOpacity onPress={() => this.saveData()} style={styles.saveButtomModal}><Icon name='save' type='font-awesome' color='white' size={32}/></TouchableOpacity>
              <Icon name='times' type='font-awesome' color='white' size={32}/>
              <TouchableOpacity onPress={() => this.cancelData()} style={styles.exitButtomModal}><Icon name='times' type='font-awesome' color='white' size={32}/></TouchableOpacity>
              <Icon name='times' type='font-awesome' color='white' size={32}/>
              <TouchableOpacity onPress={() => this.saveNextData()} style={styles.continueButtomModal}><Text><Icon name='save' type='font-awesome' color='white' size={32}/> <Icon name='arrow-right' type='font-awesome' color='white' size={32}/></Text></TouchableOpacity>
              </View>
          </ScrollView>
        </View>
      </View>
    </Modal>)
    }

    setDisplayDataModal(lastSaved) {
      var porcentaje = this.state.savedData[lastSaved-1].valor
      var lastPercentage = this.state.savedData.findIndex(obj => obj.idcampo.includes("porcentaje"))
      var importe = this.state.savedData[lastPercentage-1].valor
      var result = ""
      if (this.state.savedData[lastSaved].idcampo.includes("base")) {
        var x = 100 + Number(porcentaje)
        result = ( importe * 100 ) / x
        result = Math.round(result * 100) / 100
      } else {
        var base = Number(this.state.savedData[lastSaved-1].valor) 
        var porcentaje = Number(this.state.savedData[lastSaved-2].valor) 
        result = base*porcentaje
        result = Math.round(result * 100) / 100
      }
      this.state.interpretedData=result
      return(<Modal
        animationType = {"slide"}
        transparent={true}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Text style={styles.showTitle}>{this.state.savedData[lastSaved].titulo}</Text>
          <View>
            <Text style={styles.resumeText}>Resultado <Icon name='pencil' type='font-awesome' color='#000' size={20}/></Text>
            <TextInput blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={result => this.state.interpretedData=result}>{result}</TextInput>
          </View>
            <Text style={styles.transcript}></Text>
            <View style={styles.modalNavBarButtons}>
              <TouchableOpacity onPress={() => this.saveData()} style={styles.saveButtomModal}><Icon name='save' type='font-awesome' color='white' size={32}/></TouchableOpacity>
              <Icon name='times' type='font-awesome' color='white' size={32}/>
              <TouchableOpacity onPress={() => this.cancelData()} style={styles.exitButtomModal}><Icon name='times' type='font-awesome' color='white' size={32}/></TouchableOpacity>
              <Icon name='times' type='font-awesome' color='white' size={32}/>
              <TouchableOpacity onPress={() => this.saveNextData()} style={styles.continueButtomModal}><Text><Icon name='save' type='font-awesome' color='white' size={32}/> <Icon name='arrow-right' type='font-awesome' color='white' size={32}/></Text></TouchableOpacity>
              </View>
          </ScrollView>
        </View>
      </View>
    </Modal>)
    }

    setDataModal(){
      if (this.state.listenedData.length == 0 || this.state.interpretedData.length == 0) return null
      var lastSaved = this.state.savedData.findIndex(obj => obj.valor == null)
      return(<Modal
        animationType = {"slide"}
        transparent={true}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Text style={styles.listening}>{this.state.data[lastSaved].titulo}</Text>
          <View>
            <Text style={styles.resumeText}>Texto escuchado</Text><Text multiline={true} style={styles.transcript}>{this.state.listenedData}</Text>
            <Text style={styles.resumeText}>Texto interpretado <Icon name='pencil' type='font-awesome' color='#000' size={20}/></Text>
            <TextInput blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={interpretedData => this.setState({interpretedData})}>{this.state.interpretedData}</TextInput>
            {this.state.data[lastSaved].tipoexp=="E" &&
            (<View><Text style={styles.resumeText}>{this.state.optionalData}</Text>
              <TextInput blurOnSubmit={true} multiline={true} placeholder="NIF no registrado" style={styles.changeTranscript} onChangeText={optionalValue => this.setState({optionalValue})}>{this.state.optionalValue}</TextInput>
            </View>)}
            </View>
            <Text style={styles.transcript}></Text>
            <View style={styles.modalNavBarButtons}>
              <TouchableOpacity onPress={() => this.saveData()} style={styles.saveButtomModal}><Icon name='save' type='font-awesome' color='white' size={32}/></TouchableOpacity>
              <Icon name='times' type='font-awesome' color='white' size={32}/>
              <TouchableOpacity onPress={() => this.cancelData()} style={styles.exitButtomModal}><Icon name='times' type='font-awesome' color='white' size={32}/></TouchableOpacity>
              <Icon name='times' type='font-awesome' color='white' size={32}/>
              <TouchableOpacity onPress={() => this.saveNextData()} style={styles.continueButtomModal}><Text><Icon name='save' type='font-awesome' color='white' size={32}/> <Icon name='arrow-right' type='font-awesome' color='white' size={32}/></Text></TouchableOpacity>
              </View>
          </ScrollView>
        </View>
      </View>
    </Modal>)
    }

    showMessage = (message) => {
      return(
        <View style={styles.titleView}>
          <Text style={styles.showTitle}>{message}</Text>
        </View>
      )
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
        var lastSaved = this.state.savedData.findIndex(obj => obj.valor == null)
        return (
        <View style={styles.navBarBackHeader}>
            <View style={{ width: 60,textAlign:'center' }}>
              <Icon
                name='trash'
                type='font-awesome'
                color='#1A5276'
                size={35}
                onPress={this.askDeleteDoc}
              />
            </View>
            <View style={styles.iconsView}>
                {this.setMicrophoneIcon()}
              </View>
            <View style={{ width: 60,textAlign:'center' }}>
              <Icon
                name='camera'
                type='font-awesome'
                color='#1A5276'
                size={35}
                onPress={this.takePhoto}
              />
              </View>
              <View style={styles.iconsView}>
              <Icon
                name='image'
                type='font-awesome'
                color='#1A5276'
                size={35}
                onPress={this.goGallery}
              />
              </View>
            {(this.state.images.length > 0 || this.state.savedData.length>0 && lastSaved==-1) &&
            (<View style={{ width: 60,textAlign:'center' }}>
              <Icon
                name='check-square'
                type='font-awesome'
                color='#1A5276'
                size={35}
                onPress={this.seeDocument}
              />
            </View>)}
          </View>
        )
    }

    render () {
      if (this.state.savedData.length==0) return null // Wait loop
      return (
        <View style={{flex: 1 }}>
            <View style={{backgroundColor: "#1A5276"}}>
              <Text style={styles.mainHeader}>{this.state.title}</Text>
            </View>
            <ScrollView
              style={{backgroundColor: "#fff" }}>
              <View style={styles.sections}>
                {this.setImages()}
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
    navBarBackHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"white", 
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
        paddingTop: 20,
        textAlign: 'center',
        color: '#154360',
        fontWeight: 'bold',
        fontSize: 25,
        width: "100%",
        paddingBottom: 10,
      },
      showListen:{
        textAlign: 'center',
        color: '#B03A2E',
        fontWeight: 'bold',
        fontSize: 30,
        width: "100%",
        paddingBottom: 20,
        paddingTop: 20
      },
      showSubTitle: {
        textAlign: 'center',
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        width: "100%",
        paddingTop: 10
      },
      showNextData: {
        textAlign: 'center',
        color: '#56A494',
        fontSize: 20,
        width: "100%",
        paddingTop: 20,
        fontWeight: 'bold',
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        width: "100%",
        textAlign: "center"
      },
      changeTranscript: {
        color: '#000',
        fontSize: 20,
        width: "100%",
        textAlign:"center"
      },
      resumeText: {
        fontSize: 20,
        textAlign: "center",
        paddingTop: 20,
        color: "#000",
        fontWeight: 'bold',
      },
      secondsLabel: {
        fontWeight: 'bold',
        color: "#B03A2E",
        fontSize: 22,
        textAlign: "center",
      },
      exitButton: {
        fontSize: 22,
        textAlign: "center",
        fontWeight: 'bold',
        color: "#B03A2E",
        fontWeight: 'bold',
      },
      skipButton: {
        width: "100%",
        fontSize: 22,
        paddingTop: 20,
        textAlign: "center",
        fontWeight: 'bold',
        color: "#761A1B",
        fontWeight: 'bold',
        fontStyle: 'italic',
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
        fontSize: 22,
      },
      exitNewValue: {
        fontSize: 17,
        textAlign: "left",
        color: "#B03A2E",
        fontWeight: 'bold',
        fontSize: 22,
      },
      titleView: {
        paddingTop: 20,
        paddingBottom: 20,
        textAlign:"center",
        width:"90%",
        justifyContent: "center",
        alignItems: "center"
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
      fadingContainer: {
        paddingVertical: 5,
        paddingHorizontal: 25,
        backgroundColor: "lightseagreen"
      },
      fadingText: {
        fontSize: 28,
        textAlign: "center",
        margin: 10,
        color : "#fff"
      },
      saveButtomModal: {
        backgroundColor: "#509080",
        borderRadius: 10,
        padding: 10
      },
      exitButtomModal: {
        backgroundColor: "#922B21",
        borderRadius: 10,
        padding: 10
      },
      continueButtomModal: {
        backgroundColor: "#2874A6",
        borderRadius: 10,
        padding: 10,
        flexDirection: "row"
      }
  })