import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, FlatList, BackHandler, ScrollView, Dimensions, CheckBox} from 'react-native';
import { createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import ImageZoom from 'react-native-image-pan-zoom';
import { RFPercentage } from "react-native-responsive-fontsize";
import NetInfo from "@react-native-community/netinfo";
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker'

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
        openDatePicker: false
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
      this.setState({fulldate: "Ej: " + ("0" + (new Date().getDate())).slice(-2)+ "/"+ ("0" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear()})
      await this.setState({not_loaded: false})
      await this.linkDoc()
      NetInfo.addEventListener(networkState => {
        this.setState({ wifi: networkState.isConnected })
      })
      /*var newID = this.state.petitionID+"_"+(this.state.imgs.length+1)
      this.state.imgs.push({
        id: newID,
        nombre: newID,
        id_drive:"1qdFovzRbbT2rBKm2WdOMEXmO5quFHDgX",
        urid: "1o4klNg4jXvJSOQ4_VAFKSFsUPOKWoMBR",
        uri: "file:///data/user/0/com.contavoz/cache/rn_image_picker_lib_temp_17ac4003-f056-4d7c-b66b-d35174385156.jpg"
      })*/
    }
    
    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }
  
    goBack = () => {
      this.props.navigation.push("Petition")
      return true
    }

    async setResultRetencion(importe, i) {
      var porcentaje = this.state.doc[i].valor
      var bases = this.state.doc.filter(i => i.idcampo.includes("base") && !i.idcampo.includes("retencion"))
      var result = 0
      if (bases.length>0) { // si no hay IGIC es la suma de las bases
        for (let i = 0; i<bases.length; i++) {
          console.log("todas las bases son: " + JSON.stringify(bases[i]))
          result += Number(bases[i].valor)
        }
        var base = result
        var cuota = (base*porcentaje)/100
        cuota = cuota.toFixed(2) + ""
        this.state.doc[i+1].valor = base
        this.state.doc[i+2].valor = cuota

      } else { // x=100-%retencion; x=importe*100/x
        var x = (100-porcentaje)/100
        var base = (importe*100)/x
        var cuota = (base*porcentaje)/100
        cuota = cuota.toFixed(2) + ""
        this.state.doc[i+1].valor = base
        this.state.doc[i+2].valor = cuota
      }
      this.setState({doc: this.state.doc})
      await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(this.state.doc))
    }

    async setResult(importe, i) {
      var bases = this.state.doc.filter(i => i.idcampo.includes("base") && !i.idcampo.includes("retencion"))
      if (bases.length==1) {
        var porcentaje = this.state.doc[i].valor
        var result = 100 + Number(porcentaje)
        result = (importe*100)/result
        result = Math.round(result * 100) / 100
        var base = result.toFixed(2) + ""
        result = Number(base)*Number(porcentaje)
        result = Math.round(result/100)
        var cuota = result.toFixed(2) + ""
        this.state.doc[i+1].valor = base
        this.state.doc[i+2].valor = cuota
      } else {
        var porcentaje = this.state.doc[i].valor
        var base = this.state.doc[i+1].valor
        var result = (base*porcentaje)/100
        var cuota = result.toFixed(2) + ""
        this.state.doc[i+2].valor = cuota
      }
      this.setState({doc: this.state.doc})
      await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(this.state.doc))
    }

    async calculateResult() {
      var index = this.state.doc.findIndex(i => i.idcampo.includes("importe"))
      var importe = this.state.doc[index].valor
      if (importe.includes(",")) importe = importe.replace(",",".") 
      for (let i = index; i<this.state.doc.length; i++) {
        if (this.state.doc[i].idcampo.includes("porcentaje") && !this.state.doc[i].idcampo.includes("retencion") && this.state.doc[i].valor != null) this.setResult(importe, i) // calculos SIN retenciones
        if (this.state.doc[i].idcampo.includes("porcentaje") && this.state.doc[i].idcampo.includes("retencion") && this.state.doc[i].valor != null) this.setResultRetencion(importe, i) // calculos CON retenciones
        
      }
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
      await AsyncStorage.getItem(this.state.petitionType).then((value) => {
        if (value != null) list = JSON.parse(value) 
      })
      var index = list.findIndex(obj => JSON.stringify(obj.id) == this.state.petitionID)
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
      if (this.state.imgs.length>0) return<View style={styles.checkboxContainer}><CheckBox value={this.state.documentVoice} onValueChange={() => this.changeCheckBoxDoc()}/><Text style={styles.checkbox}>Añadir datos del documento</Text></View>
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
      await this.setState({payment:itemValue})
      await AsyncStorage.setItem(this.state.petitionID+".payment", itemValue)
    }

    async uploadImages() {
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'multipart/form-data', 'Accept': "application/json"}, 
        body: JSON.stringify({ img: this.state.imgs })
      };
      console.log(JSON.stringify(requestOptions.body))
      fetch("https://app.dicloud.es/trataimagen.asp", requestOptions)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log('responseJson',responseJson);
          })
          .catch((error) => {  
            console.log('error',error);
          });
    }


    async sentLinkedDoc() {
      var importe = ""
      var fecha = ""
      var fechaIndex = this.state.conexionDoc.campos.findIndex(obj => obj.idcampo.includes("fecha"))
      if (this.state.documentVoice) {
        importe = this.state.conexionDoc.campos.findIndex(obj => obj.idcampo.includes("importe"))
        importe = this.state.conexionDoc.campos[importe].valor
        fecha = this.state.conexionDoc.campos[fechaIndex].valor
        var newDate = fecha.split("/")
        fecha = newDate[2]+"/"+newDate[1]+"/"+newDate[0]
      } else fecha = new Date().getFullYear() + "/" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "/" + ("0" + (new Date().getDate())).slice(-2)
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
      console.log("Documento linkeado : " +requestOptions.body)
      fetch('https://app.dicloud.es/trataconvozapp.asp', requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        var error = JSON.parse(JSON.stringify(responseJson)).error
        if (error=="true") this.showAlert("Error", "Hubo un error al subir el documento")
      }).catch((error) => {});
    }

    async proceedSent() {
      //if (this.state.imgs.length>0) await this.uploadImages()
      if (this.state.thereIsConexion) await this.sentLinkedDoc()
      await this.uploadDoc()
    }

    async uploadDoc() {
      var importe = ""
      var fecha = ""
      var fechaIndex = this.state.doc.findIndex(obj => obj.idcampo.includes("fecha"))
      if (this.state.documentVoice) {
        importe = this.state.doc.findIndex(obj => obj.idcampo.includes("importe"))
        importe = this.state.doc[importe].valor
        fecha = this.state.doc[fechaIndex].valor
        var newDate = fecha.split("/")
        fecha = newDate[2]+"/"+newDate[1]+"/"+newDate[0]
      } else fecha = new Date().getFullYear() + "/" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "/" + ("0" + (new Date().getDate())).slice(-2)
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
      console.log("Documento original:"+requestOptions.body)
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

    async checkDoc() {
      var noFieldCompleted = this.state.doc.findIndex(obj => obj.valor == null && obj.obligatorio=="S")
      var thereIs = this.state.doc.findIndex(obj => obj.valor != null && obj.obligatorio=="S")
      if (thereIs==-1 || (noFieldCompleted>-1 && thereIs>-1)) return this.showAlert("Atención", "Hay campos obligatorios que deben completarse")
      else if (this.state.cifValue.length==0) return this.showAlert("Atención", "Indica el NIF/CIF")
      else this.showAskDoc()
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
      if (!this.state.openDatePicker) return <TouchableOpacity onPress={() => this.openDatePicker(true)} style={{width:"100%"}}><TextInput editable={false} style={styles.changeTranscript} placeholder={this.state.fulldate}>{this.state.doc[index].valor}</TextInput></TouchableOpacity>
      return <View><TouchableOpacity onPress={() => this.openDatePicker(true)} style={{width:"100%"}}><TextInput editable={false} style={styles.changeTranscript} placeholder={this.state.fulldate}>{this.state.doc[index].valor}</TextInput></TouchableOpacity><DatePicker
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
      // NO RETENCIONES 1 impuesto formula
      // NO RETENCIONES 2 impuestos base la meto a mano, cuota = base * porcentaje
      // SI RETENCIONES si hay impuestos suma de las bases
      // SI RETENCIONES si no hay impuestos formula
      var importe = this.state.doc.findIndex(i=>i.idcampo.includes("importe"))
      importe = this.state.doc[importe].valor
      var bases = this.state.doc.filter(i => i.idcampo.includes("base") && !i.idcampo.includes("retencion"))
      if (item.idcampo.includes("cuenta")) return <TextInput blurOnSubmit={true} multiline={true} style={styles.changeTranscript} placeholder="Ej: Disoft Servicios Informáticos S.L." onChangeText={result => this.setState({interpretedData: result, interpretedIndex: index})}>{this.state.doc[index].valor}</TextInput>
      if (item.idcampo.includes("fecha")) return this.setDatePicker(index)
      if (item.idcampo.includes("factura")) return <TextInput blurOnSubmit={true} multiline={true} style={styles.changeTranscript} placeholder="Ej: 1217 o F-1217" onChangeText={result => this.setState({interpretedData: result, interpretedIndex: index})}>{this.state.doc[index].valor}</TextInput>
      if (item.idcampo.includes("importe")) return <TextInput keyboardType='numeric' blurOnSubmit={true} multiline={true} style={styles.changeTranscript} placeholder="Ej: 0,00" onChangeText={result => this.setState({interpretedData: result, interpretedIndex: index})}>{this.state.doc[index].valor}</TextInput>
      
      if (item.idcampo.includes("porcentaje")) return <View style={{width:"100%"}}>
      <TextInput keyboardType='numeric' blurOnSubmit={true} multiline={true} style={styles.changeTranscript} placeholder="Ej: 7 o 3" onChangeText={result => this.setState({interpretedData: result, interpretedIndex: index})}>{this.state.doc[index].valor}</TextInput>
      {item.valor != null && bases.length==1 && this.state.doc[index+1].valor == null && this.state.doc[index+2].valor == null && <TouchableOpacity onPressIn={() => this.calculateResult()}><Text style={styles.calculateButton} >Obtener {this.state.doc[index+1].titulo.toLowerCase()} y {this.state.doc[index+2].titulo.toLowerCase()}</Text></TouchableOpacity>}
      {item.valor == null && bases.length==1 && <TouchableOpacity><Text style={styles.notCalculateButton}>Introduzca {this.state.doc[index].titulo.toLowerCase()} para calcular {this.state.doc[index+1].titulo.toLowerCase()} y {this.state.doc[index+2].titulo.toLowerCase()}</Text></TouchableOpacity>}
      </View>
      if (item.idcampo.includes("base") && item.valor != null) return <View style={{width:"100%"}}>
      <TextInput keyboardType='numeric' blurOnSubmit={true} multiline={true} style={styles.changeTranscript} placeholder="Ej: 7 o 3" onChangeText={result => this.setState({interpretedData: result, interpretedIndex: index})}>{this.state.doc[index].valor}</TextInput>
      {this.state.doc[index-1].valor != null && bases.length>1 && this.state.doc[index+1].valor == null && <TouchableOpacity onPressIn={() => this.calculateResult()}><Text style={styles.calculateButton} >Obtener {this.state.doc[index+1].titulo.toLowerCase()}</Text></TouchableOpacity>}
      {this.state.doc[index-1].valor == null && bases.length>1 && <TouchableOpacity><Text style={styles.notCalculateButton}>Introduzca {this.state.doc[index-1].titulo.toLowerCase()} para calcular {this.state.doc[index+1].titulo.toLowerCase()}</Text></TouchableOpacity>}
      </View>
      return <TextInput blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={result => this.setState({interpretedData: result, interpretedIndex: index})}>{this.state.doc[index].valor}</TextInput> 
    }

    setData = (item, index) => {
      var importe = this.state.doc.findIndex(i=>i.idcampo.includes("importe"))
      importe = this.state.doc[importe].valor
      if (importe == null && item.idcampo.includes("porcentaje")) return null 
      if (importe == null && item.idcampo.includes("base")) return null 
      if (importe == null && item.idcampo.includes("cuota")) return null 
      if (importe == null && item.idcampo.includes("retencion")) return null 
      if (importe != null && item.idcampo.includes("base") && item.valor == null) return null
      if (importe != null && item.idcampo.includes("cuota") && item.valor == null) return null
      if (item.idcampo.includes("contrapartida")) return null
      return (<View style={{paddingBottom: 10}}>
        {this.state.doc.length > 0 && !item.idcampo.includes("conexion") && !item.idcampo.includes("contrapartida") && (<View>
        <Text style={styles.resumeText}>{item.titulo}{item.obligatorio=="S" && <Text style={styles.resumeText}>*</Text>}</Text>
        <View style={{flexDirection:'row', width:"90%"}}>{this.setInput(item, index)}</View></View>)}   
        {item.tipoexp.includes("E") && <View>
        <Text style={styles.resumeText}>CIF de la empresa*</Text>
        <View style={{flexDirection:'row', width:"90%"}}>
        <TextInput placeholder="Ej: B35222249" blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={result => this.setState({cifValue: result})}>{this.state.cifValue}</TextInput>
        </View>
      </View>}
      {this.state.doc.length > 0 && item.idcampo.includes("conexion") && (<View>
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
      await this.setState({ thereIsConexion: conexionIndex>-1 })
      if (conexionIndex>-1) {
        var config = []
        await AsyncStorage.getItem("allConfigs").then((value) => {
          config = JSON.parse(JSON.stringify(value))
        })
        var array = JSON.parse(config)
        array.forEach(c=> {
          if (c.idcfg == this.state.doc[conexionIndex].valor) {
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
          var index = this.state.conexionDoc.campos.findIndex(obj=>obj.idcampo==i.idcampo)
          if (index > -1) this.state.conexionDoc.campos[index].valor = i.valor
        })
      }
    }

      setFootbar() {
        return (<View style={styles.navBarBackHeader}>
          <View style={{textAlign:'center', paddingLeft: 30, paddingRight: 30 }}>
            <TouchableOpacity onPress={() => this.goHome()} style={styles.deleteButton}>
              <Text style={styles.button}>Guardar y salir</Text>
            </TouchableOpacity>
          </View>
          {this.state.wifi && <View style={{textAlign:'center', paddingLeft: 30, paddingRight: 30 }}>
            <TouchableOpacity onPress={() => this.askSaveDoc()} style={styles.sendButton}>
              <Text style={styles.button}>Enviar</Text>
            </TouchableOpacity>
          </View>}
        </View>)
      }

      setTitle() {
        if (this.state.interpretedData.length>0) this.saveDoc()
        return <View style={{backgroundColor: "#1A5276"}}>
        <Text style={styles.mainHeader}>{this.state.title}</Text>
      </View>
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
            {this.setTitle()}
            <View style={styles.sections}>
              {this.setImages()}
              {this.setAllFlags()}
              {this.checkBoxDoc()}
              {this.setControlVoice()}
            </View>
            {!this.state.wifi && <Text style={styles.wifiText}>Para enviar el documento debe tener conexión a Internet</Text>}
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
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 30,
        width:"100%",
        backgroundColor: "#FFF"
      },
      resumeText: {
        fontSize: RFPercentage(3),
        textAlign: "justify",
        paddingTop: 20,
        color: "#000",
        fontWeight: 'bold',
        width:"90%"
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
        flexDirection: "row",
        alignContent:"center",
        alignItems:"center",
        paddingTop: 20,
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
      }
    })