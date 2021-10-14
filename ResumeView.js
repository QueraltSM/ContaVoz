import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, FlatList, BackHandler, ScrollView, Dimensions, CheckBox} from 'react-native';
import { createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import ImageZoom from 'react-native-image-pan-zoom';
import { RFPercentage } from "react-native-responsive-fontsize";
import RNFS from 'react-native-fs';
import NetInfo from "@react-native-community/netinfo";

class ResumeViewScreen extends Component {
  
    constructor(props) {
      super(props)
      this.state = {
        company_padisoft: "",
        idcliente: "",
        title: "",
        petitionID: "",
        petitionType: "",
        type:"",
        flatlistPos: 0,
        words: [],
        doc: [],
        list: [],
        data:[],
        userid: "",
        isChargeLinked: false,
        isPayLinked: false,
        flag: 0,
        allDocsPerType: [],
        interpretedData: null,
        imgs:[],
        cifValue: "",
        not_loaded: true,
        conexion: false,
        cifValueLinkedDoc: "",
        showConexion: false,
        conexionDoc: [],
        conexionType: "",
        documentVoice: true
      }
      this.init()
    }
  
    async init() { 
      await AsyncStorage.getItem("petitionID").then((value) => {
        this.setState({ petitionID: JSON.parse(value).id })
      })
      await AsyncStorage.getItem("idempresa").then((value) => {
        this.setState({ company_padisoft: value })
      })
      await AsyncStorage.getItem("userid").then((value) => {
        this.setState({ idcliente: value })
      })
      await AsyncStorage.getItem("petitionType").then((value) => {
        this.setState({ petitionType: value })
      })
      await AsyncStorage.getItem("data").then((value) => {
        this.setState({ title: JSON.parse(value).titulo }) 
        this.setState({ data: JSON.parse(value) })  
      })
      await AsyncStorage.getItem(this.state.petitionType).then((value) => {
        if (value != null) this.setState({ allDocsPerType: JSON.parse(value) })
      })
      await AsyncStorage.getItem(this.state.petitionID+".documentVoice").then((value) => {
        if (value != null) this.setState({ documentVoice: JSON.parse(value) })
      })
      await AsyncStorage.getItem(this.state.petitionID+".showConexion").then((value) => {
        if (value != null) this.setState({ showConexion: JSON.parse(value) })
      })
      await AsyncStorage.getItem(this.state.petitionID+".conexionDoc").then((value) => {
        if (value!=null) this.setState({ conexionDoc: JSON.parse(value) }) 
      })
      await AsyncStorage.getItem("type").then((value) => {
        this.setState({ type: value })
      })
      await AsyncStorage.getItem(this.state.petitionID+".savedData").then((value) => {
        if (value != null) this.setState({ doc: JSON.parse(value) })
      })
      await AsyncStorage.getItem(this.state.petitionID+".cifValue").then((value) => {
        if (value != null) this.setState({ cifValue: value })
      })
      await AsyncStorage.getItem(this.state.petitionID+".cifValueLinkedDoc").then((value) => {
        if (value != "null") this.setState({ cifValueLinkedDoc: value })
      })
      await AsyncStorage.getItem(this.state.petitionID+".images").then((value) => {
        if (value != null) this.setState({ imgs: JSON.parse(value) })
      })
      await AsyncStorage.getItem(this.state.userid+".words").then((value) => {
        if (value != null) this.setState({ words: JSON.parse(value) })
      })
      await this.setState({not_loaded: false})
      this.setState({ conexion: (this.state.doc.findIndex(i=>i.idcampo.includes("conexion"))!=-1) })
    }
    
    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }
  
    goBack = () => {
      this.props.navigation.push("Petition")
      return true
    }
  
    async deleteDoc() {
      var chargeDocs = []
      this.state.list.forEach((i) => {
        if (i.id != this.state.petitionID) chargeDocs.push(i)
      })
      await AsyncStorage.setItem(this.state.petitionType, JSON.stringify(chargeDocs))
      this.props.navigation.push("PetitionHistory")
    }
  
    async setFlag(i) {
      this.setState({flag: i })
    }

    goHome() {
      this.props.navigation.push("Main")
    }

    async changeCheckBoxDoc() {
      await AsyncStorage.setItem(this.state.petitionID+".documentVoice", JSON.stringify(!this.state.documentVoice))
      this.setState({documentVoice: !this.state.documentVoice})
    }
  
    checkBoxDoc() {
      if (this.state.imgs.length>0) return<View style={styles.checkboxContainer}><CheckBox value={this.state.documentVoice} onValueChange={() => this.changeCheckBoxDoc()}/><Text style={styles.checkbox}>Añadir datos del documento contable</Text></View>
      return null
    }

    setAllFlags() {
      if (this.state.imgs.length<=1) return null
      var result = []
      for (let i = 0; i < this.state.imgs.length; i++) {
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
      this.props.navigation.push('ImageViewer', {image: image,back: "ResumeView"})
    }
    
    setImageZoom() {
      return (<ImageZoom
        cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height/2.5}
        imageWidth={Dimensions.get('window').width}
        imageHeight={Dimensions.get('window').height/2.5}>
          <TouchableOpacity onPress={() => this.seeImage(this.state.imgs[this.state.flag])}>
            <Image
              source={{
                uri: this.state.imgs[this.state.flag].uri,
              }}
              resizeMode="cover"
              key={this.state.flag}
              style={{ width: Dimensions.get('window').width, height: (Dimensions.get('window').height)/2.5 }}
          />
        </TouchableOpacity>
      </ImageZoom>)
    } 

    setImages() {
      if (this.state.imgs.length > 0) {
        return (<View style={styles.imagesSection}>
          <View style={styles.selectedImageView}>
          {this.setImageZoom()}
        </View>
        </View>)
        }
      return null
    }
  
    async uploadSucceeded() {
      await this.showAlert("Éxito", "El documento se ha enviado correctamente")
      var newDocs = this.state.allDocsPerType.filter(obj => obj.id != this.state.petitionID)
      await AsyncStorage.setItem(this.state.petitionType, JSON.stringify(newDocs))
      this.props.navigation.push("PetitionHistory")
    }

    /*async getBase64(j, uri) {
      await RNFS.readFile(uri, 'base64')
      .then(res =>{
        this.state.imgs[j].urid = ""//res
      })
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ imgs: this.state.imgs })
       };
      await fetch('https://app.dicloud.es/trataimagen.asp', requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("respuesta del servidor = " + JSON.stringify(responseJson))
      }).catch((error) => {
        console.log("error: "+error)
      });
    }

    async uploadImages() {
      var j = 0
      this.state.imgs.forEach(i => {
        this.getBase64(j, i.uri)
        j++;
      })
    }*/
''
    async uploadImages() {}

    async sentLinkedDoc() {
      var importe = ""
      var fecha = ""
      importe = this.state.conexionDoc.campos.findIndex(obj => obj.idcampo.includes("importe"))
      var fechaIndex = this.state.conexionDoc.campos.findIndex(obj => obj.idcampo.includes("fecha"))
      importe = this.state.conexionDoc.campos[importe].valor
      fecha = this.state.conexionDoc.campos[fechaIndex].valor
      var newDate = fecha.split("/")
      fecha = newDate[2]+"/"+newDate[1]+"/"+newDate[0]
      this.state.conexionDoc.campos[fechaIndex].valor = fecha
      this.state.conexionDoc.tipo=this.state.conexionDoc.tipo
      this.state.conexionDoc.importe=importe
      this.state.conexionDoc.fecha=fecha
      this.state.conexionDoc.company_padisoft=this.state.company_padisoft 
      this.state.conexionDoc.idcliente=this.state.idcliente 
      this.state.conexionDoc.tipopeticion="guardar"
      this.state.conexionDoc.titulo=this.state.conexionDoc.titulo
      this.state.conexionDoc.cif=this.state.cifValueLinkedDoc 
      this.state.conexionDoc.campos=this.state.conexionDoc.campos
      this.state.conexionDoc.img = []
      const requestOptions = { method: 'POST', body: JSON.stringify(this.state.conexionDoc) };
      fetch('https://app.dicloud.es/trataconvozapp.asp', requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        var error = JSON.parse(JSON.stringify(responseJson)).error
        if (error=="true") this.showAlert("Error", "Hubo un error al subir el documento")
        else this.uploadDoc()
      }).catch((error) => {});
    }

    async proceedSent() {
      if (this.state.imgs.length>0) this.uploadImages()
      if (this.state.showConexion) this.sentLinkedDoc()
      else if (this.state.documentVoice) this.uploadDoc()
    }

    async uploadDoc() {
      var importe = ""
      var fecha = ""
      importe = this.state.doc.findIndex(obj => obj.idcampo.includes("importe"))
      var fechaIndex = this.state.doc.findIndex(obj => obj.idcampo.includes("fecha"))
      importe = this.state.doc[importe].valor
      fecha = this.state.doc[fechaIndex].valor
      var newDate = fecha.split("/")
      fecha = newDate[2]+"/"+newDate[1]+"/"+newDate[0]
      this.state.doc[fechaIndex].valor = fecha
      this.state.data.tipo=this.state.type
      this.state.data.importe=importe
      this.state.data.fecha=fecha
      this.state.data.company_padisoft=this.state.company_padisoft 
      this.state.data.idcliente=this.state.idcliente 
      this.state.data.tipopeticion="guardar"
      this.state.data.titulo=this.state.data.titulo
      this.state.data.cif=this.state.cifValue
      this.state.data.campos=this.state.doc
      this.state.data.img=[]
      const requestOptions = {method: 'POST', body: JSON.stringify(this.state.data) };
      fetch('https://app.dicloud.es/trataconvozapp.asp', requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        var error = JSON.parse(JSON.stringify(responseJson)).error
        if (error=="true") {
          this.showAlert("Error", "Hubo un error al subir el documento")
        } else this.uploadSucceeded()
      }).catch((error) => {});
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

    async showAskDoc(){
      var message = "este documento"
      if (this.state.showConexion) message = "estos documentos"
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "Enviar contabilidad",
          "¿Está seguro que desea enviar "+message+"?",
          [
            {
              text: 'Sí',
              onPress: () => {
                resolve(this.proceedSent());
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

    async checkLinkedDoc() {
      var noFieldCompleted = this.state.conexionDoc.campos.findIndex(obj => obj.valor == null && obj.obligatorio=="S" && !obj.idcampo.includes("contrapartida") && !obj.idcampo.includes("conexion"))
      var thereIs = this.state.conexionDoc.campos.findIndex(obj => obj.valor != null && obj.obligatorio=="S" && !obj.idcampo.includes("contrapartida") && !obj.idcampo.includes("conexion"))
      if (thereIs==-1 || (noFieldCompleted>-1 && thereIs>-1)) {
        return this.showAlert("Atención", "Hay campos obligatorios que deben completarse en el " + this.state.conexionType)
      } else if (this.state.cifValueLinkedDoc.length==0) {
        return this.showAlert("Atención", "Indica el CIF de la entidad del " + this.state.conexionType)
      } else this.showAskDoc()
    }

    async checkDoc() {
      var noFieldCompleted = this.state.doc.findIndex(obj => obj.valor == null && obj.obligatorio=="S" && !obj.idcampo.includes("contrapartida") && !obj.idcampo.includes("conexion"))
      var thereIs = this.state.doc.findIndex(obj => obj.valor != null && obj.obligatorio=="S" && !obj.idcampo.includes("contrapartida") && !obj.idcampo.includes("conexion"))
      if (thereIs==-1 || (noFieldCompleted>-1 && thereIs>-1)) {
        return this.showAlert("Atención", "Hay campos obligatorios que deben completarse")
      } else if (this.state.cifValue.length==0) {
        return this.showAlert("Atención", "Indica el CIF de la entidad")
      } else if (this.state.showConexion) {
        this.checkLinkedDoc()
      } else this.showAskDoc()
    }

    async askSaveDoc() {
      NetInfo.addEventListener(networkState => {
        if (networkState.isConnected) {
          if (this.state.documentVoice) {
            this.checkDoc()
          } else if (this.state.imgs.length>0) this.showAskDoc()
        } else this.showAlert("Error", "No hay conexión a Internet")
      })
    }
    
    async calculateData(index, porcentaje) {
      var importe = this.state.doc.findIndex(obj => obj.idcampo.includes("importe"))
      importe = this.state.doc[importe].valor
      if (importe.includes(",")) {
        importe = importe.replace(",",".")
      }
      var x = 100 + Number(porcentaje)
      var result = ( importe * 100 ) / x
      var base = Math.round(result * 100) / 100
      var cuota = base*porcentaje
      cuota = Math.round(cuota* 100) / 100
      this.state.doc[index].valor = porcentaje
      this.state.doc[index+1].valor = base
      this.state.doc[index+2].valor = cuota
    }

    async onSubmitLinkedDocText(index) {
      if (this.state.cifValue.length>0) await AsyncStorage.setItem(this.state.petitionID+".cifValueLinkedDoc", this.state.cifValueLinkedDoc)
      if (this.state.interpretedData != null) {
        if (this.state.conexionDoc.campos[index].obligatorio == "S" && this.state.interpretedData.length==0) {
          this.showAlert("Error", "Este campo es obligatorio, no puede estar vacío")
        } else {
          var idcampo = this.state.conexionDoc.campos[index].idcampo
          if (idcampo.includes("importe")) {
            if (!this.state.interpretedData.includes(",") && !this.state.interpretedData.includes(".")) {
              await this.setState({interpretedData: this.state.interpretedData + ",00" })
            }
            this.state.conexionDoc.campos[index].valor = this.state.interpretedData
            this.state.conexionDoc.campos.filter(obj => obj.idcampo.includes("porcentaje")).forEach(i => {
              var item = this.state.conexionDoc.campos.findIndex(obj => obj == i)
              this.setState({ conexionDoc: this.state.conexionDoc})
              this.calculateData(item, this.state.conexionDoc.campos[item].valor)
            })
          } else if (idcampo.includes("porcentaje")) {
            this.calculateData(index, this.state.interpretedData)
          } else if (idcampo.includes("fecha")) {
            if (this.state.interpretedData.toLowerCase() == "hoy") {
              this.state.conexionDoc.campos[index].valor = ("0" + (new Date().getDate())).slice(-2)+ "/"+ ("0" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear()
            } else if (this.state.interpretedData.toLowerCase() == "ayer") {
              var yesterday = new Date()
              yesterday.setDate(new Date().getDate() - 1)
              this.state.conexionDoc.campos[index].valor = ("0" + (yesterday.getDate())).slice(-2)+ "/"+ ("0" + (yesterday.getMonth() + 1)).slice(-2) + "/" + yesterday.getFullYear()
            }
          } else if (idcampo.includes("factura")) {
            this.state.conexionDoc.campos[index].valor = this.state.interpretedData.toUpperCase().split(' ').join("")
          } else {
            this.state.conexionDoc.campos[index].valor = this.state.interpretedData
          }
          this.setState({ conexionDoc: this.state.conexionDoc})
          await AsyncStorage.setItem(this.state.petitionID+".conexionDoc", JSON.stringify(this.state.conexionDoc))
        }
      }
    }

    async onSubmitText(index) {
      if (this.state.cifValue.length>0) await AsyncStorage.setItem(this.state.petitionID+".cifValue", this.state.cifValue)
      if (this.state.interpretedData != null) {
        if (this.state.doc[index].obligatorio == "S" && this.state.interpretedData.length==0) {
          this.showAlert("Error", "Este campo es obligatorio, no puede estar vacío")
        } else {
          var idcampo = this.state.doc[index].idcampo
          if (idcampo.includes("importe")) {
            if (!this.state.interpretedData.includes(",") && !this.state.interpretedData.includes(".")) {
              await this.setState({interpretedData: this.state.interpretedData + ",00" })
            }
            this.state.doc[index].valor = this.state.interpretedData
            this.state.doc.filter(obj => obj.idcampo.includes("porcentaje")).forEach(i => {
              var item = this.state.doc.findIndex(obj => obj == i)
              this.setState({ doc: this.state.doc})
              this.calculateData(item, this.state.doc[item].valor)
            })
          } else if (idcampo.includes("porcentaje")) {
            this.calculateData(index, this.state.interpretedData)
          } else if (idcampo.includes("fecha")) {
            if (this.state.interpretedData.toLowerCase() == "hoy") {
              this.state.doc[index].valor = ("0" + (new Date().getDate())).slice(-2)+ "/"+ ("0" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear()
            } else if (this.state.interpretedData.toLowerCase() == "ayer") {
              var yesterday = new Date()
              yesterday.setDate(new Date().getDate() - 1)
              this.state.doc[index].valor = ("0" + (yesterday.getDate())).slice(-2)+ "/"+ ("0" + (yesterday.getMonth() + 1)).slice(-2) + "/" + yesterday.getFullYear()
            }
          } else if (idcampo.includes("factura")) {
            this.state.doc[index].valor = this.state.interpretedData.toUpperCase().split(' ').join("")
          } else {
            this.state.doc[index].valor = this.state.interpretedData
          }
          this.setState({ doc: this.state.doc})
          await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(this.state.doc))
        }
      }
    }

    setConexionData = (item, index) => {
      return (<View>
        {this.state.doc.length > 0 && !item.idcampo.includes("conexion") && !item.idcampo.includes("contrapartidageneral") && (<View>
        <Text style={styles.resumeText}>{item.titulo} {item.obligatorio=="S" && <Text style={styles.resumeText}>*</Text>}</Text>
        <View style={{flexDirection:'row', width:"90%"}}>
        <TextInput onSubmitEditing={() => { this.onSubmitLinkedDocText(index); }}  blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={result => this.setState({interpretedData: result})}>{this.state.conexionDoc.campos[index].valor}</TextInput>
        </View>
      </View>)}
      {item.tipoexp.includes("E") && <View>
        <Text style={styles.resumeText}>CIF de la entidad *</Text>
        <View style={{flexDirection:'row', width:"90%"}}>
        <TextInput onSubmitEditing={() => { this.onSubmitLinkedDocText(index); }}  blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={result => this.setState({cifValueLinkedDoc: result})}>{this.state.cifValueLinkedDoc}</TextInput>
        </View>
      </View>}
      </View>)
    }

    setData = (item, index) => {
      return (<View style={{paddingBottom: 10}}>
        {this.state.doc.length > 0 && !item.idcampo.includes("conexion") && !item.idcampo.includes("contrapartidageneral") && (<View>
        <Text style={styles.resumeText}>{item.titulo} {item.obligatorio=="S" && <Text style={styles.resumeText}>*</Text>}</Text>
        <View style={{flexDirection:'row', width:"90%"}}>
        <TextInput onSubmitEditing={() => { this.onSubmitText(index); }}  blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={result => this.setState({interpretedData: result})}>{this.state.doc[index].valor}</TextInput>
        </View>
      </View>)}  
        {item.tipoexp.includes("E") && <View>
        <Text style={styles.resumeText}>CIF de la entidad *</Text>
        <View style={{flexDirection:'row', width:"90%"}}>
        <TextInput onSubmitEditing={() => { this.onSubmitText(index); }}  blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={result => this.setState({cifValue: result})}>{this.state.cifValue}</TextInput>
        </View>
      </View>}
      </View>)
    }

    setControlConexion() {
      if (!this.state.showConexion) return null
      return (
        <View style={styles.resumeView}>
          <Text style={styles.resumeLinkedDoc}>Documento de {this.state.conexionType}</Text>
          <FlatList 
            vertical
            showsVerticalScrollIndicator={false}
            data={this.state.conexionDoc.campos}
            renderItem={({ item, index }) => (<View>{this.setConexionData(item, index)}</View>)}
          /></View>
        )
    }

    setControlVoice(){
      if (!this.state.documentVoice) return null
      return (
        <View style={styles.resumeView}>
          <FlatList 
            vertical
            showsVerticalScrollIndicator={false}
            data={this.state.doc}
            renderItem={({ item, index }) => (<View>{this.setData(item, index)}</View>)}
          /></View>
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
  
    async saveWord(key, value) {
      await AsyncStorage.setItem(key, value)
    }

    async unlinkDoc() {
      this.setState({showConexion: false })
      this.setState({cifValueLinkedDoc:""})
      await AsyncStorage.setItem(this.state.petitionID+".conexionDoc", JSON.stringify([]))
      await AsyncStorage.setItem(this.state.petitionID+".cifValueLinkedDoc", JSON.stringify(null))
      await AsyncStorage.setItem(this.state.petitionID+".showConexion", JSON.stringify(this.state.showConexion))
    }

    async linkDoc() {
      var conexionID = this.state.doc.find(obj => obj.idcampo.includes("conexion")).xdefecto
      var conexionType = "cobro"
      var config = ""
      if (this.state.type=="compra") {
        conexionType = "pago"
      }
      await AsyncStorage.getItem("allConfigs").then((value) => {
        config = JSON.parse(JSON.stringify(value))
      })
      var array = JSON.parse(config)
      array.forEach(i => {
        if (i.tipo == conexionType && i.idcfg == conexionID) {
          this.state.conexionDoc = i
          this.setState({conexionType:i.titulo})
        }
      });
      this.setState({ showConexion: true })
      await AsyncStorage.setItem(this.state.petitionID+".conexionDoc", JSON.stringify(this.state.conexionDoc))
      await AsyncStorage.setItem(this.state.petitionID+".showConexion", JSON.stringify(this.state.showConexion))
    }
  
    async askSaveWord(msn, key, value) {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "Atención",
          "¿Desea guardar '" + value + "' como " + msn + "?",
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
  
      setLink() {
        if (!this.state.conexion) return null
        var title = this.state.doc[this.state.doc.findIndex(i=>i.idcampo.includes("conexion"))].titulo
        return <View style={styles.navBarLinkDoc}>
          {!this.state.showConexion && <TouchableOpacity onPress={() => this.linkDoc()} style={styles.linkButton}>
            <Text style={styles.button}>Conectar con {title.toLowerCase()}</Text>
          </TouchableOpacity>}
          {this.state.showConexion && <TouchableOpacity onPress={() => this.unlinkDoc()} style={styles.linkButton}>
            <Text style={styles.button}>Desconectar con {title.toLowerCase()}</Text>
          </TouchableOpacity>}
        </View>
      }

      setFootbar() {
        return (<View style={styles.navBarBackHeader}>
          <View style={{textAlign:'center', paddingLeft: 30, paddingRight: 30 }}>
            <TouchableOpacity onPress={() => this.goHome()} style={styles.deleteButton}>
              <Text style={styles.button}>Guardar y salir</Text>
            </TouchableOpacity>
          </View>
          <View style={{textAlign:'center', paddingLeft: 30, paddingRight: 30 }}>
            <TouchableOpacity onPress={() => this.askSaveDoc()} style={styles.sendButton}>
              <Text style={styles.button}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>)
      }

      render () {
        if (this.state.not_loaded) return null
        return (
          <View style={{flex: 1, backgroundColor:"#FFF" }}>
            <ScrollView 
              showsVerticalScrollIndicator ={false}
              showsHorizontalScrollIndicator={false}
              persistentScrollbar={false}
              style={{backgroundColor: "#FFF" }}>
            <View style={{backgroundColor: "#1A5276"}}>
              <Text style={styles.mainHeader}>{this.state.title}</Text>
            </View>
            <View style={styles.sections}>
              {this.setImages()}
              {this.setAllFlags()}
              {this.checkBoxDoc()}
              {this.setControlVoice()}
              {this.setControlConexion()}
            </View> 
            {this.setLink()}
            {this.setFootbar()}
            </ScrollView>  
          </View>
        );
      }
    }

  export default createAppContainer(ResumeViewScreen);

  const styles = StyleSheet.create({
      navBarBackHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"white", 
        flexDirection:'row', 
        textAlignVertical: 'center',
        paddingTop: 30,
        paddingBottom: 50
      },
      navBarLinkDoc: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"white", 
        flexDirection:'row', 
        textAlignVertical: 'center',
        paddingTop: 30
      },
      roundButtonsView: {
        paddingLeft:7,
        paddingRight:7,
        paddingBottom: 5,
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
      imagesSection: {
        flex: 1,
        alignItems: 'center',
        textAlign: "center",
      },
      imagesUploaded: {
        fontSize: RFPercentage(2.5),
        padding: 10,
        color: "#267A4E",
        fontWeight:"bold",
        borderRadius: 20,
      },
      flatlistView: {
        paddingBottom: 20,
        paddingTop: 10, 
        backgroundColor:"#FFF", 
        flexDirection: "row", 
        justifyContent: 'center',
      },
      selectedImageView: {
        flex: 1,
        alignItems: 'center',
        textAlign: "center",
        backgroundColor: "#1A5276",
      },
      sections: {
        flex: 1,
        backgroundColor:"#FFF",
        width:"100%"
      },
      resumeView: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 40,
        backgroundColor: "#FFF"
      },
      resumeText: {
        fontSize: RFPercentage(3),
        textAlign: "justify",
        paddingTop: 20,
        color: "#000",
        fontWeight: 'bold',
      },
      resumeLinkedDoc: {
        fontSize: RFPercentage(3),
        textAlign: "justify",
        paddingTop: 20,
        color: "#922B21",
        fontWeight: 'bold',
      },
      changeTranscript: {
        color: '#000',
        fontSize: RFPercentage(2.5),
        textAlign:"left",
        width:"100%",
        borderWidth: 0.5,
        borderColor: "darkgray",
        borderRadius: 20,
        padding: 10
      },
      mainHeader: {
        padding: 10,
        alignItems: 'center',
        textAlign: "center",
        fontWeight: "bold",
        color: "#FFF",
        fontSize: 20,
      },
      saveButton: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: 'bold',
        color: "#2E8B57",
        fontWeight: 'bold',
      },
      linkButton:{
        textAlign: "center",
        backgroundColor: "#1A5276",
        borderRadius: 10,
        padding: 10
      },
      deleteButton: {
        textAlign: "center",
        backgroundColor: "#761A1B",
        borderRadius: 10,
        padding: 10
      },
      sendButton: {
        textAlign: "center",
        backgroundColor: "#509080",
        borderRadius: 10,
        padding: 10
      },
      transcript: {
        color: '#000',
        fontSize: 20,
        width: "90%"
      },
      showTitle:{
        textAlign: 'center',
        color: '#154360',
        fontWeight: 'bold',
        fontSize: 22,
        width: "90%",
        paddingBottom: 20,
        paddingTop: 20
      },
      button: {
        fontWeight: 'bold',
        color: "white",
        fontSize: RFPercentage(2.5)
      },
      checkbox: {
        color: '#154360',
        fontSize: RFPercentage(2.5),
        width: "100%",
        fontWeight: 'bold',
      },
      checkboxContainer: {
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: "row"
      }
    })

