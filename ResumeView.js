import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, FlatList, BackHandler, ScrollView, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import ImageZoom from 'react-native-image-pan-zoom';
import { RFPercentage } from "react-native-responsive-fontsize";

import GDrive from "react-native-google-drive-api-wrapper";
import RNFS from "react-native-fs"
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

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
        cobroData: [],
        isChargeLinked: false,
        isPayLinked: false,
        flag: 0,
        allDocsPerType: [],
        interpretedData: null,
        imgs:[],
        cifValue: ""
      }
      this.init()
    }
  
    async init() { 
      //this.state.imgs.push({id_drive:'1MKyHwJQmBdtsfLrY0v-dnCERQJHq7coA'})
      //this.state.imgs.push({id_drive:'1qdFovzRbbT2rBKm2WdOMEXmO5quFHDgX'})
      //this.state.imgs.push({id_drive:'1trA1rdkTmxa1u4n2L5d10F9PJc0moWZD'})
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
        if (value != null) {
          this.setState({ allDocsPerType: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem("type").then((value) => {
        this.setState({ type: value })
      })
      await AsyncStorage.getItem(this.state.petitionID+".savedData").then((value) => {
        if (value != null) {
          this.setState({ doc: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.petitionID+".cifValue").then((value) => {
        if (value != null) {
          this.setState({ cifValue: value })
        }
      })
      await AsyncStorage.getItem(this.state.petitionID+".images").then((value) => {
        if (value != null) {
          this.setState({ imgs: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.userid+".words").then((value) => {
        if (value != null) {
          this.setState({ words: JSON.parse(value) })
        }
      })
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
        if (i.id != this.state.petitionID) {
          chargeDocs.push(i)
        }
      })
      await AsyncStorage.setItem(this.state.petitionType, JSON.stringify(chargeDocs))
      this.props.navigation.push("PetitionHistory")
    }
  
    async setFlag(i) {
      this.setState({flag: i })
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
          cropHeight={Dimensions.get('window').height/2}
          imageWidth={Dimensions.get('window').width}
          imageHeight={Dimensions.get('window').height/2}>
            <TouchableOpacity onPress={() => this.seeImage(this.state.imgs[this.state.flag])}>
            <Image
              source={{
                uri: this.state.imgs[this.state.flag].uri,
              }}
              resizeMode="cover"
              key={this.state.flag}
              style={{ width: Dimensions.get('window').width, height: (Dimensions.get('window').height)/2 }}
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

    async uploadImageDrive(i) {
      var contents = "data:image/png;base64," + i.urid
      console.log("contents:"+contents)
      let result = await GDrive.files.createFileMultipart(
        contents,
        "image/png", {
            parents: ["root"],
            name: "foto.png"
        },
        true);
        console.log("result:"+JSON.stringify(result))
    }

    async proceedSent() {
      var noFieldCompleted = this.state.doc.findIndex(obj => obj.valor == null && obj.obligatorio=="S")
      var importe = ""
      var fecha = ""
      var cif = ""
      if (noFieldCompleted==-1) {
        importe = this.state.doc.findIndex(obj => obj.idcampo.includes("importe"))
        var fechaIndex = this.state.doc.findIndex(obj => obj.idcampo.includes("fecha"))
        importe = this.state.doc[importe].valor
        fecha = this.state.doc[fechaIndex].valor
        var newDate = fecha.split("-")
        fecha = newDate[2]+"-"+newDate[1]+"-"+newDate[0]
        cif=this.state.cifValue 
        this.state.doc[fechaIndex].valor = fecha
      }
      this.state.data.tipo=this.state.type
      this.state.data.importe=importe
      this.state.data.fecha=fecha
      this.state.data.company_padisoft=this.state.company_padisoft 
      this.state.data.idcliente=this.state.idcliente 
      this.state.data.tipopeticion="guardar"
      this.state.data.titulo=this.state.title
      this.state.data.cif=cif
      this.state.data.campos=this.state.doc
      this.state.data.img=this.state.imgs
      /*GoogleSignin.configure({
          scopes: ['https://www.googleapis.com/auth/drive'], // We want   read and write access
          webClientId: "AIzaSyBhxd_UsTJtnYut1Ac7v9Lo3ekiJyLQk4c", // REPLACE WITH YOUR ACTUAL  CLIENT ID !
          offlineAccess: true
      });
      await GDrive.setAccessToken("AIzaSyBhxd_UsTJtnYut1Ac7v9Lo3ekiJyLQk4c");
      await GDrive.init();
      
      this.state.imgs.forEach(i => {
        this.uploadImageDrive(i)
      })*/
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify(this.state.data) };
      
      console.log("body="+requestOptions.body)
      /*fetch('https://app.dicloud.es/trataconvozapp.asp', requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("respuesta del servidor = " + JSON.stringify(responseJson))
        var error = JSON.parse(JSON.stringify(responseJson)).error
        if (error=="true") {
          this.showAlert("Error", "Hubo un error al subir el documento")
        } else {
          this.uploadSucceeded()
        }
      }).catch((error) => {});*/
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

    async askSaveDoc() {
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

    async sendDocument() {
      var noFieldCompleted = this.state.doc.findIndex(obj => obj.valor == null && obj.obligatorio=="S")
      if (noFieldCompleted>-1 && this.state.imgs.length==0) {
        this.showAlert("Error", this.state.doc[noFieldCompleted].titulo + " debe completarse")
      } else this.askSaveDoc()
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

    async onSubmitText(index) {
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
          } else {
            this.state.doc[index].valor = this.state.interpretedData
          }
          this.setState({ doc: this.state.doc})
          await AsyncStorage.setItem(this.state.petitionID+".savedData", JSON.stringify(this.state.doc))
        }
      }
    }

    setData = (item, index) => {
      return (<View>
        {this.state.doc.length > 0 && (<View>
        <Text style={styles.resumeText}>{item.titulo} </Text>
        <View style={{flexDirection:'row', width:"90%"}}>
        <TextInput onSubmitEditing={() => { this.onSubmitText(index); }}  blurOnSubmit={true} multiline={true} style={styles.changeTranscript} onChangeText={result => this.setState({interpretedData: result})}>{this.state.doc[index].valor}</TextInput>
        </View>
      </View>)}  
      </View>)
    }

    async askUnlinkCobro() {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "¿Desvincular con cobro",
          "¿Está seguro que desea desvincular esta venta con un documento cobro?",
          [
            {
              text: 'Sí',
              onPress: () => {
                resolve(this.deleteCobro());
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

    async askLinkCobro() {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "¿Vincular con cobro",
          "¿Está seguro que desea vincular esta venta con un documento cobro?",
          [
            {
              text: 'Sí',
              onPress: () => {
                resolve(this.saveCobro());
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

    setControlVoice(){
      var noFieldCompleted = this.state.doc.findIndex(obj => obj.valor == null && obj.obligatorio=="S")
      if (noFieldCompleted>-1) return null
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
  
      render () {
        return (
          <View style={{flex: 1, backgroundColor:"#FFF" }}>
            <ScrollView 
              showsVerticalScrollIndicator ={false}
              showsHorizontalScrollIndicator={false}
              persistentScrollbar={false}
              style={{backgroundColor: "#FFF" }}>
            <View style={{backgroundColor: "#1A5276"}}>
              <Text style={styles.mainHeader}>{this.state.title} finalizado</Text>
            </View>
            <View style={styles.sections}>
              {this.setControlVoice()}
              {this.setImages()}
              {this.setAllFlags()}
            </View>
            </ScrollView>   
            <View style={styles.navBarBackHeader}>
              <View style={{ width: 70,textAlign:'center' }}>
                <Icon name='save' type='font-awesome' color='#FFF' size={35} onPress={() => this.sendDocument()} />
              </View>
              <View style={{ width: 70,textAlign:'center' }}>
                <Icon name='trash' type='font-awesome' color='#FFF' size={35} onPress={this._delete} />
              </View>
            </View>
          </View>
        );
      }
    }

  export default createAppContainer(ResumeViewScreen);

  const styles = StyleSheet.create({
    navBarBackHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#1A5276", 
        flexDirection:'row', 
        textAlignVertical: 'center',
        height: 60
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
        borderRadius: 20
      },
      flatlistView: {
        paddingTop:20, 
        backgroundColor:"#FFF", 
        flexDirection: "row", 
        justifyContent: 'center',
      },
      selectedImageView: {
        flex: 1,
        alignItems: 'center',
        textAlign: "center",
        backgroundColor: "#000",
      },
      sections: {
        flex: 1,
        backgroundColor:"#FFF",
        width:"100%",
        paddingBottom: 100
      },
      resumeView: {
        paddingTop: 20,
        paddingLeft: 40,
        paddingBottom: 70,
        backgroundColor: "#FFF"
      },
      resumeText: {
        fontSize: RFPercentage(3),
        textAlign: "justify",
        paddingTop: 20,
        color: "#000",
        fontWeight: 'bold',
      },
      changeTranscript: {
        color: '#000',
        fontSize: RFPercentage(2.5),
        textAlign:"left",
        width:"90%",
        borderWidth: 0.5,
        borderColor: "lightgray",
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
      deleteButton: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: 'bold',
        color: "#761A1B",
        fontWeight: 'bold',
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
    })

