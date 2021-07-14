import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image, FlatList, BackHandler, ScrollView, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import ImageZoom from 'react-native-image-pan-zoom';

class ResumeViewScreen extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
        id: this.props.navigation.state.params.id,
        entity: this.props.navigation.state.params.interpretedEntity,
        entityKey: this.props.navigation.state.params.entity,
        interpretedEntity: this.props.navigation.state.params.interpretedEntity,
        nif: this.props.navigation.state.params.interpretedNif,
        nifKey: this.props.navigation.state.params.nif,
        interpretedNif: this.props.navigation.state.params.interpretedNif,
        date: this.props.navigation.state.params.interpretedDate,
        dateKey: this.props.navigation.state.params.date,
        interpretedDate: this.props.navigation.state.params.interpretedDate,
        invoice: this.props.navigation.state.params.interpretedInvoice,
        invoiceKey: this.props.navigation.state.params.invoice,
        interpretedInvoice: this.props.navigation.state.params.interpretedInvoice,
        total: this.props.navigation.state.params.interpretedTotal,
        totalKey: this.props.navigation.state.params.total,
        interpretedTotal: this.props.navigation.state.params.interpretedTotal,
        images: this.props.navigation.state.params.images,
        back: this.props.navigation.state.params.back,
        type: this.props.navigation.state.params.type,
        flatlistPos: 0,
        words: [],
        docs: [],
        userid: ""
      }
      this.init()
    }
  
    async init() {
      if (this.state.back == "Buy") {
        prep = "BuyList"
      }
      await AsyncStorage.getItem(this.state.id+"-"+prep).then((value) => {
        if (value != null) {
          this.setState({ docs: JSON.parse(value) })
        }
      })
      await AsyncStorage.getItem(this.state.id+"-words").then((value) => {
        if (value != null) {
          this.setState({ words: JSON.parse(value) })
        }
      })
    }
    
    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }
  
    goBack = () => {
      this.props.navigation.push(this.state.type, {id: this.state.id })
      return true
    }
  
    async deleteDoc() {
      var prep = ""
      var list = "buyList"
      if (this.state.back == "Buy") {
        prep = "BuyList"
      }
      var auxDocs = []
      this.state.docs.forEach((i) => {
        if (i.id != this.state.id) {
          auxDocs.push(i)
        }
      })
      await AsyncStorage.setItem(this.state.userid+"-"+list, JSON.stringify(auxDocs))
      this.props.navigation.push(prep)
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
        back: this.state.back,
        type: this.state.type
      })
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
          cropHeight={Dimensions.get('window').height/2.5}
          imageWidth={Dimensions.get('window').width}
          imageHeight={Dimensions.get('window').height/2.5}>
            <TouchableOpacity onPress={() => this.seeImage(item)}>
            <Image
              source={{
                uri: item.uri.replace(/['"]+/g, ''),
              }}
              resizeMode="cover"
              key={item}
              style={{ width: Dimensions.get('window').width, height: (Dimensions.get('window').height)/2.5, aspectRatio: 1 }}
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
      /*console.log("send document")
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ entity: this.state.interpretedEntity })
      };
      fetch('https://app.dicloud.es/pruebajson.asp', requestOptions)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("respuesta del servidor: " + JSON.stringify(responseJson.error))
        }).catch((error) => {
          console.log("error:"+error)
        });*/
    }
  
    setControlVoice(){
        return(
          <View style={styles.resumeView}>
            {this.state.interpretedEntity.length > 0 && 
            (<View>
              <Text style={styles.resumeText}>Entidad</Text>
              <View style={{flexDirection:'row', width:"90%"}}>
              <TextInput multiline={true} style={styles.changeTranscript} onChangeText={interpretedEntity => this.setState({interpretedEntity})}>{this.state.interpretedEntity}</TextInput>
              <Icon
                name='pencil'
                type='font-awesome'
                color='#000'
                size={30}
              />
              </View>
              </View>
            )}
            {this.state.nif.length > 0 &&
              (<View>
                <Text style={styles.resumeText}>NIF</Text>
              <View style={{flexDirection:'row', width:"90%"}}>
              <TextInput multiline={true} style={styles.changeTranscript} onChangeText={interpretedNif => this.setState({interpretedNif})}>{this.state.interpretedNif}</TextInput>
              <Icon
                name='pencil'
                type='font-awesome'
                color='#000'
                size={30}
              />
              </View>
            </View>
            )}
            {this.state.date.length > 0 &&
              (<View>
                <Text style={styles.resumeText}>Fecha</Text>
                <View style={{flexDirection:'row', width:"90%"}}>
                <TextInput multiline={true} style={styles.changeTranscript} onChangeText={interpretedDate => this.setState({interpretedDate})}>{this.state.interpretedDate}</TextInput>
                <Icon
                  name='pencil'
                  type='font-awesome'
                  color='#000'
                  size={30}
                />
                </View>
                </View>
            )}
            {this.state.invoice.length > 0 &&
              (<View>
                <Text style={styles.resumeText}>Nº factura</Text>
                <View style={{flexDirection:'row', width:"90%"}}>
                <TextInput multiline={true} style={styles.changeTranscript} onChangeText={interpretedInvoice => this.setState({interpretedInvoice})}>{this.state.interpretedInvoice}</TextInput>
                <Icon
                  name='pencil'
                  type='font-awesome'
                  color='#000'
                  size={30}
                />
                </View>
                </View>
            )}
            {this.state.total.length > 0 &&
              (<View>
                <Text style={styles.resumeText}>Total</Text>
                <View style={{flexDirection:'row', width:"90%"}}>
                <TextInput multiline={true} style={styles.changeTranscript} onChangeText={interpretedTotal => this.setState({interpretedTotal})}>{this.state.interpretedTotal}</TextInput>
                <Icon
                  name='pencil'
                  type='font-awesome'
                  color='#000'
                  size={30}
                />
                </View>
                </View>
            )}
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
      var prep = ""
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
      }
    }
  
    render () {
      return (
        <View style={{flex: 1, backgroundColor:"#FFF" }}>
          <ScrollView style={{backgroundColor: "#FFF" }}>
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

    })

