import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, FlatList, BackHandler, ScrollView, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import ImageZoom from 'react-native-image-pan-zoom';

class ResumeViewScreen extends Component {
  
    constructor(props) {
      super(props)
      this.state = {
        id: "",
        listid: "",
        interpreptedData1: "",
        interpreptedData2: "",
        flatlistPos: 0,
        images: [],
        words: [],
        doc: [],
        list: [],
        userid: "",
        type: "",
        cobroData: [],
        isCobroLinked: false
      }
      this.init()
    }
  
    async init() { 
      await AsyncStorage.getItem("id").then((value) => {
        this.setState({ id: value })
      })
      await AsyncStorage.getItem("listid").then((value) => {
        this.setState({ listid: value })
      })
      await AsyncStorage.getItem("type").then((value) => {
        this.setState({ type: value })
      })
      await AsyncStorage.getItem(this.state.id+".savedData").then((value) => {
        if (value != null) {
          this.setState({ doc: JSON.parse(value) })
          console.log(value)
        }
      })
      await AsyncStorage.getItem("cobros").then((value) => {
        this.setState({ cobroData: JSON.parse(JSON.parse(value))[0].campos })
      })
      await AsyncStorage.getItem(this.state.id+".isCobroLinked").then((value) => {
        if (value != null) {
          this.setState({ isCobroLinked: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.id+".images").then((value) => {
        if (value != null) {
          this.setState({ images: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.id+".words").then((value) => {
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
        if (i.id != this.state.id) {
          chargeDocs.push(i)
        }
      })
      await AsyncStorage.setItem(this.state.listid, JSON.stringify(chargeDocs))
      this.props.navigation.push("PetitionList")
    }
  
    seeImage (image) {
      this.props.navigation.push('ImageViewer',{image: image, back:"ResumeView"})
    }
  
    setFlatlistPos(i) {
      this.setState({ flatlistPos: i })
    }
  
    setFlatlistButtons(pos) {
      var result = []
      for (let i = 0; i < this.state.images.length; i++) {
        if (pos == i) {
          this.setImageZoom(this.state.images[pos])
          result.push(<View style={styles.roundButtonsView}><Text
            style={styles.roundButton}>
          </Text></View>)
        } else {
          this.setImageZoom(this.state.images[i])
          result.push(<View style={styles.roundButtonsView}><Text
            style={styles.focusRoundButton}>
          </Text></View>)
        }
      }
      return (<View style={styles.flatlistView}>{result}</View>)
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
                  { this.state.images.length > 1 && this.setFlatlistButtons(index)}
                </View>) 
              )}
            />
          </View>
        </View>)
      }
      return null
    }
  
    sendDocument = async () => {
      alert("Accion desactivada por el momento")
      // check when data is empty, because it will not be sent
    }
  
    setData = (item, index) => {
      return (<View>
        {this.state.doc.length > 0 && this.state.doc[index].valor != "" && (<View>
        <Text style={styles.resumeText}>{item.titulo} <Icon name='pencil' type='font-awesome' color='#000' size={25}
        /></Text>
        <View style={{flexDirection:'row', width:"90%"}}>
        <TextInput multiline={true} style={styles.changeTranscript} onChangeText={interpreptedData => this.setState({interpreptedData})}>{this.state.doc[index].valor}</TextInput>
        </View>
      </View>)}  
      </View>)
    }

    setCobroData = (item, index) => {
      if (JSON.stringify(this.state.doc[index].idcampo == JSON.stringify(this.state.cobroData[index].idcampo))) {
        return (<View>
          {this.state.doc[index] != "" && (<View>
          <Text style={styles.resumeText}>{item.titulo} <Icon name='pencil' type='font-awesome' color='#000' size={25}
          /></Text>
          <View style={{flexDirection:'row', width:"90%"}}>
          <TextInput multiline={true} style={styles.changeTranscript} onChangeText={interpreptedData => this.setState({interpreptedData})}>{this.state.doc[index].valor}</TextInput>
          </View>
        </View>)}  
        </View>)
      }
      return null
    }

    linkToCobro = () => {
      if (this.state.isCobroLinked) {
        return(
          <View>
            <Text style={styles.showTitle}>Documento de cobro asociado</Text>
            <FlatList 
              vertical
              showsVerticalScrollIndicator={false}
              data={this.state.cobroData}
              renderItem={({ item, index }) => (<View>{this.setCobroData(item, index)}</View>)}
            />
            <Text style={styles.transcript}></Text>
          </View>
        )
      }
      return null
    }

    deleteCobro = async () => {
      await AsyncStorage.setItem(this.state.id+".isCobroLinked", JSON.stringify(false))
      this.setState({ isCobroLinked: false })
    }

     saveCobro = async () => {
      await AsyncStorage.setItem(this.state.id+".isCobroLinked", JSON.stringify(true))
      this.setState({ isCobroLinked: true })
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
            <Text style={styles.showTitle}>Documento de {this.state.type}</Text>
            <FlatList 
              vertical
              showsVerticalScrollIndicator={false}
              data={this.state.doc}
              renderItem={({ item, index }) => (<View>{this.setData(item, index)}</View>)}
            />
            <Text style={styles.transcript}></Text>
            {this.state.type == "compras" && (<View style={{flexDirection:'row', width:"90%"}}><TouchableOpacity onPress={this.skipData}><Text style={styles.saveButton}>Vincular con pago</Text></TouchableOpacity></View>)}
            {this.state.type == "ventas" && !this.state.isCobroLinked && (<View style={{flexDirection:'row', width:"90%"}}><TouchableOpacity onPress={() => this.askLinkCobro()}><Text style={styles.saveButton}>Vincular con cobro</Text></TouchableOpacity></View>)}
            {this.linkToCobro()}
            {this.state.type == "ventas" && this.state.isCobroLinked && (<View style={{flexDirection:'row', width:"90%"}}><TouchableOpacity onPress={() => this.askUnlinkCobro()}><Text style={styles.deleteButton}>Desvincular con cobro</Text></TouchableOpacity></View>)}
          </View>
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
  
  
    _save = async () => {
      alert("Esta acción está desactivada temporalmente")
      /*var prep = ""
      if (this.state.type == "Buy") {
        prep = this.state.id+""
      }
      if (this.state.entity == this.state.interpretedEntity && this.state.nif == this.state.interpretedNif
        && this.state.date == this.state.interpretedDate && this.state.invoice == this.state.interpretedInvoice && 
        this.state.total == this.state.interpretedTotal) {
          this.sendDocument()
      }
      if (this.state.entity != this.state.interpretedEntity) {
        await this.askSaveWord("entidad", prep+"interpretedEntity", this.state.interpretedEntity)
      }
      if (this.state.date != this.state.interpretedDate) {
        await this.askSaveWord("fecha", prep+"interpretedDate", this.state.interpretedDate)
      }
      if (this.state.nif != this.state.interpretedNif) {
        await this.askSaveWord("NIF", prep+"interpretedNif", this.state.interpretedNif)
      }
      if (this.state.invoice != this.state.interpretedInvoice) {
        await this.askSaveWord("nº de factura", prep+"interpretedInvoice", this.state.interpretedInvoice)
      }
      if (this.state.total != this.state.interpretedTotal) {
        await this.askSaveWord("total", prep+"interpretedTotal", this.state.interpretedTotal)
      }*/
    }
  
    render () {
      return (
        <View style={{flex: 1, backgroundColor:"#FFF" }}>
          <ScrollView style={{backgroundColor: "#FFF" }}>
          <View style={{backgroundColor: "#1A5276"}}>
            <Text style={styles.mainHeader}>Documento finalizado</Text>
          </View>
          <View style={styles.sections}>
            {this.setImages()}
            {this.setControlVoice()}
          </View>
          </ScrollView>   
          <View style={styles.navBarBackHeader}>
          <View style={{ width: 70,textAlign:'center' }}>
              <Icon
                name='trash'
                type='font-awesome'
                color='#FFF'
                size={30}
                onPress={this._delete}
              />
            </View>
            <View style={{ width: 70,textAlign:'center' }}>
              <Icon
                name='save'
                type='font-awesome'
                color='#FFF'
                size={30}
                onPress={this._save}
              />
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
      roundButtonsView:{
        paddingLeft:7,
        paddingRight:7,
        paddingBottom: 5
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
      imagesSection: {
        flex: 1,
        alignItems: 'center',
        textAlign: "center",
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
      },
      resumeView: {
        paddingTop: 30,
        paddingLeft: 40,
        backgroundColor: "#FFF",
        paddingBottom: 100
      },
      resumeText: {
        fontSize: 20,
        textAlign: "justify",
        paddingTop: 20,
        color: "#000",
        fontWeight: 'bold',
      },
      changeTranscript: {
        color: '#000',
        fontSize: 20,
        fontStyle: 'italic',
        width: "90%"
      },
      mainHeader: {
        padding: 20,
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

