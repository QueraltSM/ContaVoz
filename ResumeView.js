import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, FlatList, BackHandler, ScrollView, Dimensions, SafeAreaView} from 'react-native';
import { createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import ImageZoom from 'react-native-image-pan-zoom';
import { RFPercentage } from "react-native-responsive-fontsize";
import NetInfo from "@react-native-community/netinfo";
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import { CheckBox } from 'react-native-elements';
import ImgToBase64 from 'react-native-image-base64';

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
        interpretedData: "",
        interpretedIndex: 0,
        imgs:[],
        cifValue: "",
        not_loaded: true,
        thereIsConexion: false,
        conexionDoc: [],
        conexionType: "",
        documentVoice: true,
        payment: "",
        payments: [],
        wifi: true,
        waitingTitle: "",
        waiting: "",
        isSending: false,
        openDatePicker: false,
        success: false,
        fulldate: "Ej: " + ("0" + (new Date().getDate())).slice(-2)+ "/"+ ("0" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear() + ""
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
      await AsyncStorage.getItem("type").then((value) => {
        this.setState({ type: value })
      })
      await AsyncStorage.getItem(this.state.petitionID+".savedData").then((value) => {
        if (value != null) this.setState({ doc: JSON.parse(value) })
      })
      await AsyncStorage.getItem(this.state.petitionID+".payment").then((value) => {
        if (value != null) this.setState({ payment: value })
      })
      await AsyncStorage.getItem(this.state.petitionID+".cifValue").then((value) => {
        if (value != null) this.setState({ cifValue: value })
      })
      await AsyncStorage.getItem(this.state.petitionID+".images").then((value) => {
        if (value != null) this.setState({ imgs: JSON.parse(value) })
      })
      await AsyncStorage.getItem(this.state.userid+".words").then((value) => {
        if (value != null) this.setState({ words: JSON.parse(value) })
      })
      await this.setState({not_loaded: false})
      await this.linkDoc()
      this.calculateData()
      NetInfo.addEventListener(networkState => {
        this.setState({ wifi: networkState.isConnected })
      })
    }
    
    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }
  
    goBack = () => {
      this.props.navigation.push("Petition")
      return true
    }

    calculateData() {
      for (let i = 0; i<this.state.doc.length; i++){
        if (this.state.doc[i].idcampo.includes("porcentaje")) this.calculateResult(this.state.doc[i], i)
      }
    }

    async setCuota(porcentaje, base, i) {
      var cuota = (base*porcentaje)/100
      cuota = cuota.toFixed(2) + "" 
      this.state.doc[i+2].valor = cuota
      this.setState({doc: this.state.doc})
      await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(this.state.doc))
    }

    async setResultRetencion(importe, porcentajeImpuesto, porcentajeRetencion,i) {
      var x = 100-(porcentajeRetencion-porcentajeImpuesto)
      var base = 0
      var cuota = 0
      var bases = this.state.doc.filter(i => i.idcampo.includes("base") && !i.idcampo.includes("retencion"))
      if (bases.length>1) { // Retenciones con más de 1 impuesto
        if (this.state.doc[i].idcampo.includes("retencion")) {
          bases.forEach(i => {
            base = Number(i.valor) + base
          })
        } else if (this.state.doc[i+1].valor!=null) base = this.state.doc[i+1].valor
        
      } else {
        if (!this.state.doc[i].idcampo.includes("retencion")) {
          base = (importe*100)/x // Retenciones con 1 impuesto
        } else {
          // cuando hay 1 impuesto, baseretencion = base
          var baseret = this.state.doc.find(i=>i.idcampo.includes("base") && !i.idcampo.includes("retencion"))
          base = baseret.valor
        }
      }
      cuota = (base*this.state.doc[i-2].valor)/100
      base = parseFloat(base).toFixed(2) + ""
      this.state.doc[i+1].valor = base
      if (this.state.doc[i].idcampo.includes("retencion")) this.setCuota(porcentajeRetencion,base,i)
      else this.setCuota(porcentajeImpuesto, base, i)
    }

    async setResult(importe, porcentaje,i) {
      var base = this.state.doc[i+1].valor + ""
      if (base !="null" && base.includes(",")) {
        base = base.replace(",",".") 
        base = Number(base)
      }
      var cuota = 0
      var bases = this.state.doc.filter(i => i.idcampo.includes("base") && !i.idcampo.includes("retencion"))
      if (bases.length==1) { 
        var x = 100 + Number(porcentaje)
        base = (importe*100)/x
        base = Math.round(base * 100) / 100
      }
       if (base != "null") {
        cuota = (base*porcentaje)/100
        cuota = cuota.toFixed(2) + "" 
        base = parseFloat(base).toFixed(2) + ""
        this.state.doc[i+1].valor = base
        await this.setCuota(base, porcentaje, i)
      }
    }

    async calculateResult(item, i) {
      var index = this.state.doc.findIndex(i => i.idcampo.includes("importe"))
      var thereIsRetenciones = this.state.doc.findIndex(i => i.idcampo.includes("retencion"))
      var porcentajeImpuesto = item.valor
      var porcentajeRetencion = 0
      if (thereIsRetenciones>-1) porcentajeRetencion = this.state.doc[thereIsRetenciones].valor
      var importe = this.state.doc[index].valor
      if (importe != null && importe.includes(",")) importe = importe.replace(",",".") 
      if (importe!=null && porcentajeImpuesto!=null && thereIsRetenciones==-1) this.setResult(importe, porcentajeImpuesto, i) // calculos SIN retenciones
      else if (importe!=null && porcentajeImpuesto!=null && thereIsRetenciones>-1) this.setResultRetencion(importe, porcentajeImpuesto, porcentajeRetencion, i) // calculos CON retenciones
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

    async goHome() {
      var list = []
      await AsyncStorage.getItem(this.state.petitionType + "").then((value) => {
        if (value != null) list = JSON.parse(value) 
      })
      var index = list.findIndex(obj => obj.id == this.state.petitionID)
      list[index].doc = this.state.doc
      await AsyncStorage.setItem(this.state.petitionType, JSON.stringify(list))
      this.props.navigation.push("Main")
    }

    async changeCheckBoxDoc() {
      await AsyncStorage.setItem(this.state.petitionID+".documentVoice", JSON.stringify(!this.state.documentVoice))
      await this.setState({documentVoice: !this.state.documentVoice})
      if (!this.state.documentVoice) {
        await AsyncStorage.setItem(this.state.petitionID+".cifValue", "")
        this.state.doc.forEach(i => { i.valor = null })
        await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(this.state.doc))
      }
    }
  
    checkBoxDoc() {
      if (this.state.isSending) return null
      if (this.state.imgs.length>0) return <View style={styles.checkboxContainer}><CheckBox checked={this.state.documentVoice} onPress={() => this.changeCheckBoxDoc()}/><Text style={styles.checkbox}>Añadir datos del documento</Text></View>
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

    async setSelectedPayment(itemValue) {
      var index = this.state.conexionDoc.campos.findIndex(i=>i.idcampo.includes("formapc"))
      this.state.conexionDoc.campos[index].valores = itemValue
      await this.setState({conexionDoc:this.state.conexionDoc})
      await this.setState({payment:itemValue})
      await AsyncStorage.setItem(this.state.petitionID+".payment", itemValue)
    }

    async updateState(isSending,waiting,success) {
      await this.setState({isSending: isSending})
      await this.setState({waiting: waiting})
      await this.setState({success: success })
    }

    async uploadImages() {
      var j = 0
      await Promise.all(this.state.imgs.map(async i => {
        var img = {
          uri: Platform.OS === "android"
            ? i.uri
            : i.uri.replace("file:///", ""),
          name: i.nombre,
          id: i.id,
          data: ""
        }
        await ImgToBase64.getBase64String(img.uri).then(base64String => {
          img.data = base64String
        }).catch(err => console.log("ImgToBase64_error:"+err));
        this.state.imgs[j] = img
        j = j + 1
      }))
      await this.setState({isSending: true})
      await this.setState({waitingTitle: "Por favor, no cierre esta pantalla"})
      await this.setState({waiting: "Enviando imágenes al servidor. Este proceso puede tardar algunos minutos..."})
      await Promise.all(this.state.imgs.map(async i => {
        await this.postImages(i)
      }))
    }

    async postImages(i) {
      var postData = {
        method: 'POST',
        headers: {'Content-Type': 'multipart/form-data'},
        body: JSON.stringify({company_padisoft:this.state.company_padisoft, imgs:[i]})
      }
      await fetch("https://app.dicloud.es/trataimagen.asp", postData)
      .then((response) => response.json())
        .then((responseJson) => {
          this.updateState(false,"",true)
        }).catch((error) => {
          this.updateState(false,"",false)
        });
    }

    async sentLinkedDoc() {
      var importe = ""
      importe = this.state.conexionDoc.campos.findIndex(obj => obj.idcampo.includes("importe"))
      importe = this.state.conexionDoc.campos[importe].valor
      var fecha = ""
      var fechaIndex = this.state.conexionDoc.campos.findIndex(obj => obj.idcampo.includes("fecha"))
      fecha = this.state.conexionDoc.campos[fechaIndex].valor
      this.state.conexionDoc.campos[fechaIndex].valor = fecha
      this.state.conexionDoc.tipo=this.state.conexionDoc.tipo
      this.state.conexionDoc.importe=importe
      this.state.conexionDoc.fecha=fecha
      if (!this.state.documentVoice) this.state.conexionDoc.campos[fechaIndex].valor = null
      this.state.conexionDoc.company_padisoft=this.state.company_padisoft 
      this.state.conexionDoc.idcliente=this.state.idcliente 
      this.state.conexionDoc.tipopeticion="guardar"
      this.state.conexionDoc.titulo=this.state.conexionDoc.titulo
      this.state.conexionDoc.cif=this.state.cifValue 
      this.state.conexionDoc.campos=this.state.conexionDoc.campos
      this.state.conexionDoc.img = this.state.imgs
      const requestOptions = { method: 'POST', body: JSON.stringify(this.state.conexionDoc) };
      await fetch('https://app.dicloud.es/trataconvozapp.asp', requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        var error = JSON.parse(JSON.stringify(responseJson)).error
        if (error=="true") {
          this.showAlert("Error", "Hubo un error al subir el documento")
          this.updateState(false,"",false)
        } else this.updateState(false,"",true)
      }).catch((error) => {});
    }

    async proceedSent() {
      if (this.state.imgs.length>0 && !this.state.success) await this.uploadImages()
      if (this.state.imgs.length>0 && this.state.success && this.state.documentVoice || this.state.imgs.length==0 && this.state.documentVoice) {
        if (this.state.thereIsConexion) await this.sentLinkedDoc()
        await this.uploadDoc()
      }
      if (this.state.success) await this.uploadSucceeded()
    }

    async uploadDoc() {
      await this.setState({isSending: true})
      await this.setState({waitingTitle: "Por favor, no cierre esta pantalla"})
      await this.setState({waiting: "Enviando documento al servidor"})
      var importe = ""
      importe = this.state.doc.findIndex(obj => obj.idcampo.includes("importe"))
      importe = this.state.doc[importe].valor
      var fecha = ""
      var fechaIndex = this.state.doc.findIndex(obj => obj.idcampo.includes("fecha"))
      fecha = this.state.doc[fechaIndex].valor
      this.state.doc[fechaIndex].valor = fecha
      this.state.data.tipo=this.state.type
      this.state.data.importe=importe
      this.state.data.fecha=fecha
      if (!this.state.documentVoice) this.state.doc[fechaIndex].valor = null
      this.state.data.company_padisoft=this.state.company_padisoft 
      this.state.data.idcliente=this.state.idcliente 
      this.state.data.tipopeticion="guardar"
      this.state.data.titulo=this.state.data.titulo
      this.state.data.cif=this.state.cifValue
      this.state.data.campos=this.state.doc
      this.state.data.img=this.state.imgs
      const requestOptions = {method: 'POST', body: JSON.stringify(this.state.data) };
      await fetch('https://app.dicloud.es/trataconvozapp.asp', requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        var error = JSON.parse(JSON.stringify(responseJson)).error
        if (error=="true") {
          this.showAlert("Error", "Hubo un error al subir el documento")
          this.updateState(false,"",false)
        } else this.updateState(false,"",true)
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
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "Enviar contabilidad",
          "¿Está seguro que desea enviar este documento?",
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

    async saveDocument() {
      var list = []
      await AsyncStorage.getItem(this.state.petitionType + "").then((value) => {
        if (value != null) list = JSON.parse(value) 
      })
      var index = list.findIndex(obj => obj.id == this.state.petitionID)
      list[index].savedData = this.state.doc
      await AsyncStorage.setItem(this.state.petitionType, JSON.stringify(list))
    }

    docIsCompleted() {
      var index = this.state.doc.findIndex(i => i.valor == null && i.obligatorio == "S")
      var indexNotNull = this.state.doc.findIndex(i => i.valor != null)
      if (this.state.imgs.length>0 && indexNotNull==-1 && this.state.cifValue.length==0) return true 
      if (index==-1 && this.state.cifValue.length>0) return true
      return false
    }

    async checkDoc() {
      if (this.docIsCompleted()) this.showAskDoc()
      else return this.showAlert("Atención", "Hay campos obligatorios que deben completarse")
    }

    async askSaveDoc() {
      if (this.state.documentVoice) this.checkDoc()
      else if (this.state.imgs.length>0) this.showAskDoc()
    }

    setDate = async (index, date) => {
      var d = ("0" + (date.getDate())).slice(-2)+"/"+("0" + (date.getMonth() + 1)).slice(-2)+"/"+date.getFullYear()
      this.state.doc[index].valor = d
      this.setState({doc:this.state.doc})
      await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(this.state.doc))
    }

    openDatePicker = (value) => {
      this.setState({openDatePicker: value})
    }

    setDatePicker(index) {
      if (!this.state.openDatePicker) return <TouchableOpacity onPress={() => this.openDatePicker(true)} style={{width:"100%"}}><TextInput placeholderTextColor="darkgray" editable={false} style={styles.changeTranscript} placeholder={this.state.fulldate}>{this.state.doc[index].valor}</TextInput></TouchableOpacity>
      return <View><TouchableOpacity onPress={() => this.openDatePicker(true)} style={{width:"100%"}}><TextInput placeholderTextColor="darkgray" editable={false} style={styles.changeTranscript} placeholder={this.state.fulldate}>{this.state.doc[index].valor}</TextInput></TouchableOpacity><DatePicker
      modal
      mode="date"
      open={this.state.openDatePicker}
      date={new Date()}
      onConfirm={(date) => {
        this.openDatePicker(false)
        this.setDate(index,date)
      }}
      onCancel={() => {
        this.openDatePicker(false)
      }}/></View> 
    }

    setInput(item, index) {
      var importe = this.state.doc.findIndex(i=>i.idcampo.includes("importe"))
      importe = this.state.doc[importe].valor
      if (item.idcampo.includes("cuenta")) return <TextInput placeholderTextColor="darkgray" blurOnSubmit={true} multiline={true} style={styles.changeTranscript} placeholder="Ej: Disoft Servicios Informáticos S.L." onChangeText={result => this.setState({interpretedData: result, interpretedIndex: index})}>{this.state.doc[index].valor}</TextInput>
      if (item.idcampo.includes("fecha")) return this.setDatePicker(index)
      if (item.idcampo.includes("factura")) return <TextInput placeholderTextColor="darkgray" blurOnSubmit={true} multiline={true} style={styles.changeTranscript} placeholder="Ej: 1217 o F-1217" onChangeText={result => this.setState({interpretedData: result, interpretedIndex: index})}>{this.state.doc[index].valor}</TextInput>
      if (item.idcampo.includes("importe")) return <TextInput placeholderTextColor="darkgray" keyboardType='numeric' blurOnSubmit={true} multiline={true} style={styles.changeTranscript} placeholder="Ej: 0,00" onChangeText={result => this.setState({interpretedData: result, interpretedIndex: index})}>{this.state.doc[index].valor}</TextInput>
      if (item.idcampo.includes("base")) return <TextInput placeholderTextColor="darkgray" keyboardType='numeric' blurOnSubmit={true} multiline={true} style={styles.changeTranscript} placeholder="Ej: 0" onChangeText={result => this.setState({interpretedData: result, interpretedIndex: index})}>{this.state.doc[index].valor}</TextInput>
      if (item.idcampo.includes("cuota")) return <TextInput placeholderTextColor="darkgray" keyboardType='numeric' blurOnSubmit={true} multiline={true} style={styles.changeTranscript} placeholder="Ej: 0" onChangeText={result => this.setState({interpretedData: result, interpretedIndex: index})}>{this.state.doc[index].valor}</TextInput>
      if (item.idcampo.includes("porcentaje")) return <View style={{width:"100%"}}>
      <TextInput placeholderTextColor="darkgray" keyboardType='numeric' blurOnSubmit={true} multiline={true} style={styles.changeTranscript} placeholder="Ej: 7 o 3" onChangeText={result => this.setState({interpretedData: result, interpretedIndex: index})}>{this.state.doc[index].valor}</TextInput>
      <TouchableOpacity onPressIn={() => this.calculateResult(item, index)}><Text style={styles.calculateButton}>Calcular resultados</Text></TouchableOpacity>
      </View>
      return <TextInput placeholderTextColor="darkgray" blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={result => this.setState({interpretedData: result, interpretedIndex: index})}>{this.state.doc[index].valor}</TextInput> 
    }

    setData = (item, index) => {
      var importe = this.state.doc.findIndex(i=>i.idcampo.includes("importe"))
      importe = this.state.doc[importe].valor
      return (<View style={{paddingBottom: 10}}>
        {this.state.doc.length > 0 && !item.idcampo.includes("conexion") && !item.idcampo.includes("formapc") && (<View>
        <Text style={styles.resumeText}>{item.titulo}{item.obligatorio=="S" && <Text style={styles.resumeText}>*</Text>}</Text>
        <View style={{flexDirection:'row', width:"90%"}}>{this.setInput(item, index)}</View></View>)}   
        {item.tipoexp.includes("E") && <View>
        <Text style={styles.resumeText}>CIF de la empresa*</Text>
        <View style={{flexDirection:'row', width:"90%"}}>
        <TextInput placeholderTextColor="darkgray" placeholder="Ej: B35222249" blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={result => this.setState({cifValue: result})}>{this.state.cifValue}</TextInput>
        </View>
      </View>}
      {this.state.doc.length > 0 && (item.idcampo.includes("formapc") || item.idcampo.includes("conexion")) && (<View>
        <Text style={styles.resumeText}>{item.titulo}{item.obligatorio=="S" && <Text style={styles.resumeText}>*</Text>}</Text>
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

    async saveDoc() {
      if (this.state.doc[this.state.interpretedIndex].idcampo.includes("factura")) this.state.doc[this.state.interpretedIndex].valor = this.state.interpretedData.toUpperCase().split(' ').join("")
      this.state.doc[this.state.interpretedIndex].valor = this.state.interpretedData
      await this.setState({interpretedData: ""})
      await this.setState({interpretedIndex: -1})
      await this.setState({doc: this.state.doc})
      await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(this.state.doc))
      await AsyncStorage.setItem(this.state.petitionID+".cifValue", this.state.cifValue)
      await this.saveDocument()
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

    async linkDoc() {
      var conexionIndex = this.state.doc.findIndex(i=>i.idcampo.includes("conexion"))
      var formapc = this.state.doc.findIndex(i=>i.idcampo.includes("formapc"))
      await this.setState({ thereIsConexion: conexionIndex>-1 })
      if (conexionIndex>-1) {
        var config = []
        await AsyncStorage.getItem("allConfigs").then((value) => {
          config = JSON.parse(JSON.stringify(value))
        })
        var array = JSON.parse(config)
        array.forEach(c=> {
          if (c.idcfg == this.state.doc[conexionIndex].valor) {
            this.state.doc.forEach(x => {
              var sameidcampo = c.campos.findIndex(i=>i.idcampo.includes(x.idcampo))
              if (sameidcampo>-1) c.campos[sameidcampo].valores = x.valor
            })
            this.setState({conexionDoc:c})
            this.setState({conexionType:c.titulo})
            var formapc = c.campos.findIndex(i=>i.idcampo.includes("formapc"))
            if (formapc>-1) {
              var newPayments = c.campos[formapc].valores.split(',')
              this.setState({payments: newPayments})
            }
          }
        });
        this.state.doc.forEach(i=> {
          var index = this.state.conexionDoc.findIndex(obj=>obj.idcampo==i.idcampo)
          if (index > -1) this.state.conexionDoc.campos[index].valor = i.valor
        })
      } else if (formapc>-1) {
        var newPayments = this.state.doc[formapc].valor.split(',')
        this.setState({payments: newPayments})
      }
    }

      setFootbar() {
        return (<View style={styles.navBarBackHeader}>
          {!this.state.isSending && <View style={{textAlign:'center', paddingLeft: 30, paddingRight: 30 }}>
            <TouchableOpacity onPress={() => this.goHome()} style={styles.deleteButton}>
              <Text style={styles.button}>Guardar y salir</Text>
            </TouchableOpacity>
          </View>}
          {this.state.wifi && !this.state.isSending && <View style={{textAlign:'center', paddingLeft: 30, paddingRight: 30 }}>
            <TouchableOpacity onPress={() => this.askSaveDoc()} style={styles.sendButton}>
              <Text style={styles.button}>Enviar</Text>
            </TouchableOpacity>
          </View>}
        </View>)
      }

      setTitle() {
        if (this.state.interpretedData.length>0) this.saveDoc()
        return <View style={styles.navBarHeader}>
        <Text style={styles.mainHeader}>{this.state.title}</Text>
      </View>
      }

      waitingBox() {
        if (this.state.waiting.length==0) return null
        return <View style={styles.waitingBox}><Text style={styles.waitingText}>{this.state.waiting}</Text><Text style={styles.waitingTitle}>{this.state.waitingTitle}</Text></View>
      }

      render () {
        if (this.state.not_loaded) return null
        return (
          <SafeAreaView style={{flex: 1,backgroundColor:"white"}}>
          <View style={{flex: 1, backgroundColor:"#FFF" }}>
            <ScrollView 
              showsVerticalScrollIndicator ={false}
              showsHorizontalScrollIndicator={false}
              persistentScrollbar={false}
              style={{backgroundColor: "#FFF" }}>
            {this.setTitle()}
            <View style={styles.sections}>
              {this.setImages()}
              {this.setAllFlags()}
              {this.checkBoxDoc()}
              {this.setControlVoice()}
              {this.waitingBox()}
            </View>
            {!this.state.wifi && <Text style={styles.wifiText}>Para enviar el documento debe tener conexión a Internet</Text>}
            {this.setFootbar()}
            </ScrollView>  
          </View></SafeAreaView>
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
        borderRadius:20*0.125*0.5,
        borderWidth:2,
        borderColor: '#1A5276',
      },
      focusRoundButton: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 6,
        borderRadius:20*0.125*0.5,
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
      calculateButton: {
        paddingTop: 10,
        fontWeight: 'bold',
        fontSize: RFPercentage(2.5),
        color: "#509080"
      },
      notCalculateButton: {
        paddingTop: 10,
        paddingBottom: 10,
        fontWeight: 'bold',
        fontSize: RFPercentage(2.5),
        color: "#8A8887"
      },
      resumeView: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        width:"100%",
        backgroundColor: "#FFF"
      },
      resumeText: {
        fontSize: RFPercentage(3),
        textAlign: "left",
        paddingTop: 20,
        color: "#154360",
        fontWeight: 'bold',
        width:"90%"
      },
      changeTranscript: {
        color: '#000',
        fontSize: RFPercentage(2.5),
        textAlign:"left",
        width:"100%",
        borderWidth: 0.5,
        borderColor: "darkgray",
        borderRadius: 15,
        paddingLeft: 5,
      },
      pickerView: {
        color: '#000',
        fontSize: RFPercentage(2.5),
        textAlign:"center",
        width:"90%",
        borderWidth: 0.5,
        borderColor: "darkgray",
        borderRadius: 20
      },
      mainHeader: {
        padding: 10,
        alignItems: 'center',
        textAlign: "center",
        fontWeight: "bold",
        color: "black",
        fontSize: RFPercentage(3),
        paddingTop: 20
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
      waitingBox: {
        width:"100%",
        alignContent: "center",
        alignItems: 'center',
        justifyContent: 'center',
      },
      waitingTitle: {
        textAlign: 'center',
        color: '#C70039',
        fontWeight: 'bold',
        fontSize: 20,
        width: "100%",
        paddingBottom: 20,
        paddingTop: 20
      },
      waitingText: {
        textAlign: 'center',
        color: '#154360',
        fontWeight: 'bold',
        fontSize: 20,
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
        flexDirection: "row",
        alignContent:"center",
        alignItems:"center",
        paddingLeft: 10,
        paddingRight: 10,
      },
      wifiText: {
        textAlign:"center",
        color: '#154360',
        fontSize: RFPercentage(2.5),
        width: "100%",
        paddingLeft: 20,
        paddingRight: 20,
        fontWeight: 'bold',
      },
      navBarHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"white", 
        flexDirection:'row',
        textAlign: 'center',
        width: "100%",
        paddingLeft:10,
        paddingRight:10
      },
    })