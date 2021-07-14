import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, FlatList, ScrollView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';

class DictionaryViewScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        id: "",
        words: [],
        addKey: "",
        addValue: "",
        showForm: false
      };
      this.init()
    }
  
    async init() {
      await AsyncStorage.getItem("userid").then((value) => {
        this.setState({ id: value })
      })
      await AsyncStorage.getItem(this.state.id+"-words").then((value) => {
        if (value != null) {
          this.setState({ words: JSON.parse(value).reverse() })
        }
      })
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
  
    async pushArrayWords() {
      var arrayWords =  this.state.words
      if (!this.state.words.some(item => item.key.toLowerCase() === this.state.addKey.toLowerCase())) {
        arrayWords.push({
          key: this.state.addKey,
          value: this.state.addValue,
          time: new Date().getTime()
        })
      } else {
        var i = arrayWords.findIndex(obj => obj.key.toLowerCase() === this.state.addKey.toLowerCase());
        arrayWords[i].value = this.state.addValue
        arrayWords[i].time = new Date().getTime()
      }
      this.setState({ words: arrayWords })
      await AsyncStorage.setItem(this.state.id+"-words", JSON.stringify(arrayWords))
    }
  
    _addWord = async () => {
      if (this.state.addKey == "" || this.state.addValue == "") {
        this.showAlert("Error", "Complete todos los campos")
      } else {
        await this.pushArrayWords()
        this.setState({ addKey: "" })
        this.setState({ addValue: "" })
        this.formAction()
      }
    }
  
    formAction = () => {
      this.setState({showForm: !this.state.showForm})
    }
  
    setMenuButtons() {
      if (this.state.showForm) {
        return(
          <View style={styles.dictionaryView}>
            <View style={{ width: "90%", flexDirection:'row', justifyContent: 'flex-end'}}>
              <TouchableOpacity onPress={() => this.formAction()}>
                  <Icon
                    name='times'
                    type='font-awesome'
                    color='#B03A2E'
                    size={30}
                  />
                </TouchableOpacity>
            </View>
            <Text style={styles.resumeText}>Palabra: </Text>
            <TextInput value={this.state.addKey} multiline={true} style={styles.changeTranscript} placeholder="Macro" onChangeText={addKey => this.setState({addKey})}></TextInput>
          
            <Text style={styles.resumeText}>Valor que debe tomar: </Text>
            <TextInput value={this.state.addValue} multiline={true} style={styles.changeTranscript} placeholder="Makro" onChangeText={addValue => this.setState({addValue})}></TextInput>
            
            <Text style={styles.transcript}></Text>
            <TouchableOpacity onPress={this._addWord}>
              <Text style={styles.saveNewValue}>Guardar registro</Text>
            </TouchableOpacity>
            <Text style={styles.transcript}></Text>
          </View>
        )
      }
      return (
        <View style={{ width: "90%", flexDirection:'row', justifyContent: 'flex-end'}}>
        <TouchableOpacity onPress={() => this.formAction()}>
            <Icon
              name='plus'
              type='font-awesome'
              color='#2E8B57'
              size={28}
            />
          </TouchableOpacity>
      </View>
        )
    }
  
    setMenu() {
      return(
        <View style={{backgroundColor:"#FFF"}}>
          <View style={styles.accountingViewShow}>
          <Icon
              name='book'
              type='font-awesome'
              color='#000'
              size={45}
            />
            </View>
          <Text style={styles.mainHeader}>Diccionario</Text>
        </View>
      )
    }
  
    async askDelete(item) {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "Eliminar palabra",
          "¿Desea eliminar esta palabra del diccionario definitivamente?",
          [
            {
              text: 'Sí',
              onPress: () => {
                resolve(this.deleteWord(item));
              },
            },
            {
              text: 'No',
              onPress: () => {
                resolve("No");
              },
            },
          ],
          { cancelable: false },
        );
        });
        await AsyncAlert();
    }
  
  
    deleteWord = async (item) => {
      var arrayWords = []
      for (let i = 0; i < this.state.words.length; i++) {
        if ( this.state.words[i].key != item.key) {
          arrayWords.push({
            key: this.state.words[i].key,
            value: this.state.words[i].value,
            time: this.state.words[i].time
          })
        }
      }
      this.setState({ words: arrayWords })
      await AsyncStorage.setItem(this.state.id+"-words", JSON.stringify(arrayWords))
    }
  
    setWords() {
      if (this.state.words.length > 0) {
        return (
          <View style={styles.resumeView}>
            <Text style={styles.showTitle}>Listado de palabras</Text>
          <FlatList 
            vertical
            showsVerticalScrollIndicator={false}
            data={ this.state.words.sort((a,b) => a.time < b.time) } 
            renderItem={({ item }) => (
              <View style={{paddingBottom: 20}}>
              <View style={styles.wordsBox}>
              <Text style={styles.wordsBoxText}>
              <Text style={styles.dictionaryKeys}>Palabra: </Text> 
              <Text style={styles.dictionaryValues}>{item.key}</Text> 
              </Text>
              <Text style={styles.wordsBoxText}>
              <Text style={styles.dictionaryKeys}>Valor: </Text> 
              <Text style={styles.dictionaryValues}>{item.value}</Text>    
              </Text>   
              <View style={styles.delIcon}>            
                <TouchableOpacity onPress={() => this.askDelete(item)}>
                  <Icon
                    name='trash'
                    type='font-awesome'
                    color='#B03A2E'
                    size={28}
                  />
                </TouchableOpacity>
              </View>
              </View>
            </View>
          )}
        />
        </View>
        )
      }
      return (<View style={styles.resumeView}>
        <Text style={styles.showTitle}>No hay registros</Text>
        </View>)
    }
  
    saveDocument() {
      console.log("saveDocument")
    }
  
    render() {
      return (
        <View style={{flex: 1}}>
          <ScrollView style={{backgroundColor: "#fff"}}>
          {this.setMenu()}
          <View style={{paddingBottom: 50}}>
            {this.setMenuButtons()}
            {this.setWords()}
          </View>
          </ScrollView>
        </View>
      );
    }
  }

  export default createAppContainer(DictionaryViewScreen);

  const styles = StyleSheet.create({
    resumeView: {
        paddingTop: 30,
        paddingLeft: 40,
        backgroundColor: "#FFF",
        paddingBottom: 100
    },
    showTitle:{
        textAlign: 'center',
        color: '#154360',
        fontWeight: 'bold',
        fontSize: 18,
        width: "90%",
        paddingBottom: 20,
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
      transcript: {
        color: '#000',
        fontSize: 20,
        width: "90%"
      },
      mainHeader: {
        paddingTop: 20,
        alignItems: 'center',
        textAlign: "center",
        fontWeight: "bold",
        color: "#000",
        fontSize: 25,
      },
      dictionaryView: {
        paddingLeft: 40,
        backgroundColor: "#FFF",
        width:"100%",
      },
      dictionaryKeys: {
        fontSize: 20,
        textAlign: "justify",
        paddingTop: 15,
        color: "#000",
        width:"90%",
        fontWeight: 'bold',
      },
      dictionaryValues: {
        fontSize: 20,
        textAlign: "justify",
        paddingTop: 15,
        color: "#000",
        width:"90%",
      },
      wordsBox: {
        borderWidth: 0.5,
        borderColor:"#E7E4E4",
        width: "90%",
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 20,
      },
      wordsBoxText: {
        paddingTop: 10,
        paddingRight: 10,
        paddingLeft: 10,
      },
      delIcon: {
        paddingLeft: 10,
        paddingRight: 5,
        flexDirection: "row",
        backgroundColor:"#FFF", 
        justifyContent: 'flex-end',
      },
      accountingViewShow: {
        flexDirection: 'row',
        textAlign: "center",
        alignSelf: "center",
        paddingTop: 30,
      },
      saveNewValue: {
        fontSize: 17,
        textAlign: "left",
        color: "#2E8B57",
        fontWeight: 'bold',
      },
  })