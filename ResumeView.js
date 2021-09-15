import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, FlatList, BackHandler, ScrollView, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import ImageZoom from 'react-native-image-pan-zoom';
import { RFPercentage } from "react-native-responsive-fontsize";

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
        images: [],
        words: [],
        doc: [],
        list: [],
        userid: "",
        cobroData: [],
        isChargeLinked: false,
        isPayLinked: false,
        flag: 0,
        allDocsPerType: [],
        interpretedData: null,
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
      await AsyncStorage.getItem(this.state.petitionType).then((value) => {
        if (value != null) {
          this.setState({ allDocsPerType: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem("type").then((value) => {
        this.setState({ type: value })
      })
      await AsyncStorage.getItem("data").then((value) => {
        this.setState({ title: JSON.parse(value).titulo }) 
      })
      await AsyncStorage.getItem(this.state.petitionID+".savedData").then((value) => {
        if (value != null) {
          this.setState({ doc: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.petitionID+".images").then((value) => {
        if (value != null) {
          this.setState({ images: JSON.parse(value) })
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
      this.props.navigation.push("PetitionList")
    }
  
    async setFlag(i) {
      this.setState({flag: i })
    }
  
    setAllFlags() {
      var lastSaved = this.state.doc.findIndex(obj => obj.valor != null)
        if (lastSaved == -1) {
          var result = []
          if (this.state.images.length > 1) {
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
      }
      return null
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
  
    setUploadedImages () {
      var lastSaved = this.state.doc.findIndex(obj => obj.valor != null)
      if (lastSaved > -1 && this.state.images.length > 0) {
          var denom = "imagen"
          var uplodaded = "adjuntada"
          if (this.state.images.length > 1) { 
            denom = "imágenes"
            uplodaded="adjuntadas"
          }
          return (
            <View style={styles.imagesSection}>
              <Text style={styles.imagesUploaded}>+ {this.state.images.length} {denom} {uplodaded}</Text>
          </View>)
      }
      return null
    }

    setImages() {
      var lastSaved = this.state.doc.findIndex(obj => obj.valor != null)
        if (lastSaved == -1 && this.state.images.length > 0) {
            return (
            <View style={styles.selectedImageView}>
              {this.setImageZoom(this.state.images[this.state.flag])}
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

    async proceedSent() {
      var importe = this.state.doc.findIndex(obj => obj.idcampo.includes("importe"))
      var fecha = this.state.doc.findIndex(obj => obj.idcampo.includes("fecha"))
      importe = this.state.doc[importe].valor
      fecha = this.state.doc[fecha].valor
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ company_padisoft:this.state.company_padisoft, idcliente: this.state.idcliente, titulo: this.state.title, tipopeticion: "guardar", tipo:this.state.type, importe:importe, fecha:fecha, campos: this.state.doc})
      };
      fetch('https://app.dicloud.es/trataconvozapp.asp', requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("Hola")
        console.log("respuesta="+JSON.stringify(responseJson))
        var error = JSON.parse(JSON.stringify(responseJson)).error
        if (error=="true") {
          this.showAlert("Error", "Hubo un error al subir el documento")
        } else {
          this.uploadSucceeded()
        }
      }).catch((error) => {});
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

    async sendDocument() {
      var lastSaved = this.state.doc.findIndex(obj => obj.valor == null)
      if (lastSaved > -1) {
        this.showAlert("Error", "El documento de voz está incompleto")
      } else {
        const AsyncAlert = () => new Promise((resolve) => {
          Alert.alert(
            "Subir documento contable",
            "¿Está seguro que desea enviar este documento finalmente?",
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
    }
    
    async calculateData(index, porcentaje) {
      var importe = this.state.doc.findIndex(obj => obj.idcampo.includes("importe"))
      importe = this.state.doc[importe].valor
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
        {this.state.doc.length > 0 && this.state.doc[index].valor != null && (<View>
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
        return(
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
            <ScrollView style={{backgroundColor: "#FFF" }}>
            <View style={{backgroundColor: "#1A5276"}}>
              <Text style={styles.mainHeader}>{this.state.title} finalizado</Text>
            </View>
            <View style={styles.sections}>
              {this.setImages()}
              {this.setAllFlags()}
              {this.setControlVoice()}
              {this.setUploadedImages()}
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
        paddingLeft: 20,
        textAlign: "center",
        alignSelf: "flex-start",
        paddingBottom: 100
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
        width:"100%"
      },
      resumeView: {
        paddingTop: 30,
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

