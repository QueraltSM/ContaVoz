import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, BackHandler, FlatList, ScrollView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';

class DictionaryViewScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        userid: "",
        words: [],
        addKeywords: "",
        addEntity: "",
        addCIF: "",
        updateKeywords: undefined,
        updateEntity: undefined,
        updateCIF: undefined,
        showForm: false,
        showSeach: false,
        keyword: "",
        isSearching: true,
        message: "No hay entidades registradas"
      };
      this.init()
    }
  
    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }
  
    goBack = () => {
      this.props.navigation.push('Main')
      return true
    }

    async init() {
      await AsyncStorage.getItem("userid").then((value) => {
        this.setState({ userid: value })
      })
      await AsyncStorage.getItem(this.state.userid+".words").then((value) => {
        if (value != null) {
          this.setState({ words: JSON.parse(value).reverse() })
        }
      })
      console.log(JSON.stringify(this.state.words))
      if (this.state.words != null) {
        this.setState({isSearching: false})
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
  
    async pushArrayWords() {
      var arrayWords =  this.state.words
      if (!this.state.words.some(item => item.cifValue.toLowerCase() === this.state.addCIF.toLowerCase())) {
        arrayWords.push({
          keywords: this.state.addKeywords,
          entity: this.state.addEntity,
          cifValue: this.state.addCIF,
          time: new Date().getTime()
        })
        this.setState({ words: arrayWords })
        await AsyncStorage.setItem(this.state.userid+".words", JSON.stringify(arrayWords))
        this.setState({ addKeywords: "" })
        this.setState({ addEntity: "" })
        this.setState({ addCIF: "" })
        this.formAction()
      } else {
        this.showAlert("Error", "Ya existe una empresa registrada con este NIF")
      }
    }
  
    _searchWord = async () => {
      if (this.state.keyword.length==0) {
        this.showAll()
      } else {
        var filteredWords = []
        this.state.words.forEach(i => {
          if (i.keywords.toLowerCase().includes(this.state.keyword.toLowerCase()) || i.entity.toLowerCase().includes(this.state.keyword.toLowerCase()) || i.cifValue.toLowerCase().includes(this.state.keyword.toLowerCase())) {
            filteredWords.push(i)
          }
        })
        this.setState({ words: filteredWords })
        this.setState({ keyword: "" })
        this.setState({ showForm: false })
        this.setState({ showSeach: false })
        this.setState({ message: "No hay entidades coincidentes" })
      }
    }

    async updateWord(item, index) {
      var keywords = this.state.updateKeywords
      var entity = this.state.updateEntity
      var cifValue = this.state.updateCIF
      var array = this.state.words
      if (keywords == undefined) keywords = array[index].keywords
      if (entity == undefined) entity = array[index].entity
      if (cifValue == undefined) cifValue = array[index].cifValue
      var equalNIF = this.state.words.findIndex(obj => obj.cifValue == cifValue)
      var empty = this.state.words.findIndex(obj => obj.entity == undefined ||  obj.cifValue == undefined ||  obj.keywords == undefined)
      if (empty>-1 && empty != index) { // Case: empty field, and try of update another one
        this.showAlert("Error", "No se pueden actualizar los datos si hay campos sin completar")
      } else {
        if (equalNIF==index || equalNIF==-1) {
          if (item.keywords == keywords && keywords!=undefined && item.entity == entity && entity!=undefined && item.cifValue == cifValue && cifValue != undefined) {
            this.showAlert("Error", "No se ha modificado ningún dato") // Equal row
          } else if (keywords == undefined ||entity==undefined ||cifValue == undefined ||keywords == "" ||entity=="" ||cifValue == "") {
            this.showAlert("Error", "Complete todos los campos") // Case empty field of row
          } else {
            array[index].entity = entity 
            array[index].keywords = keywords 
            array[index].cifValue = cifValue 
            this.setState({ words: array })
            await AsyncStorage.setItem(this.state.userid+".words", JSON.stringify(array))
            this.showAlert("Proceso completado", "Se han guardado los datos")
            this.reset()
            this.props.navigation.push("DictionaryView")
          }
        } else {
          this.showAlert("Error", "Ya existe una empresa registrada con este NIF")
        }
      }
    }

    reset() {
      this.setState({updateEntity: undefined})
      this.setState({updateKeywords: undefined})
      this.setState({updateCIF: undefined})
    }

    _addWord = async () => {
      if (this.state.addKeywords == "" || this.state.addEntity == "" || this.state.addCIF == "") {
        this.showAlert("Error", "Complete todos los campos")
      } else {
        await this.pushArrayWords()
      }
    }
  
    formAction = () => {
      this.setState({showForm: !this.state.showForm})
      if (!this.state.showForm) {
        this.setState({showSeach: this.state.showForm})
      }
    }

    searchAction = () => {
      this.setState({showSeach: !this.state.showSeach})
      if (!this.state.showSeach) {
        this.setState({showForm: this.state.showSeach})
      }
    }
  
    setAddWordBox() {
      if (this.state.showForm) {
        return (
          <View style={styles.dictionaryView}>
            <Text style={styles.resumeText}>Nombre jurídico de la entidad</Text>
            <TextInput blurOnSubmit={true} value={this.state.addEntity} multiline={true} style={styles.changeTranscript} placeholder="Ej: Disoft Servicios Informáticos S.L." onChangeText={addEntity => this.setState({addEntity})}></TextInput>
            <View style={{flexDirection:"row", alignItems:"center"}}><Text style={styles.resumeText}> Palabras clave</Text></View>
            <TextInput blurOnSubmit={true} value={this.state.addKeywords} multiline={true} style={styles.changeTranscript} placeholder="Ej: Disoft, Mi empresa, Fifo" onChangeText={addKeywords => this.setState({addKeywords})}></TextInput>
            <Text style={styles.resumeText}>CIF de la entidad</Text>
            <TextInput blurOnSubmit={true} value={this.state.addCIF} multiline={true} style={styles.changeTranscript} placeholder="Ej: B35222249" onChangeText={addCIF => this.setState({addCIF})}></TextInput>
            <Text style={styles.transcript}></Text>
            <TouchableOpacity onPress={() => this._addWord()}><Text style={styles.saveNewValue}>Grabar datos</Text></TouchableOpacity>
            <Text style={styles.transcript}></Text>
          </View>)
      }
    }
  
    setMenu() {
      return(
        <View style={{backgroundColor:"#FFF"}}>
          <View style={styles.accountingViewShow}>
          <Icon
              name='briefcase'
              type='font-awesome'
              color='#000'
              size={45}
            />
            </View>
          <Text style={styles.mainHeader}>Entidades</Text>
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
        if ( this.state.words[i].cifValue != item.cifValue) {
          arrayWords.push({
            keywords: this.state.words[i].keywords,
            entity: this.state.words[i].entity,
            cifValue: this.state.words[i].cifValue,
            time: this.state.words[i].time
          })
        }
      }
      this.setState({ words: arrayWords })
      await AsyncStorage.setItem(this.state.userid+".words", JSON.stringify(arrayWords))
    }

    setMenuButtons() {
      return (
        <View style={{ width: "100%", flexDirection:'row', justifyContent:"center", paddingTop: 30, paddingBottom: 10 }}>
            {this.state.showForm && <TouchableOpacity onPress={() => this.formAction()}>
              <Icon
                name='times'
                type='font-awesome'
                color='#B03A2E'
                size={28}
              />
            </TouchableOpacity>}
            {!this.state.showForm && <TouchableOpacity onPress={() => this.formAction()}>
            <Icon
              name='plus'
              type='font-awesome'
              color='black'
              size={28}
            />
          </TouchableOpacity>}
          <Icon
              name='search'
              type='font-awesome'
              color='white'
              size={28}
            />
          <TouchableOpacity onPress={() => this.props.navigation.push("Main")}>
              <Icon
                name='home'
                type='font-awesome'
                color='black'
                size={28}
              />
            </TouchableOpacity>
          <Icon
              name='search'
              type='font-awesome'
              color='white'
              size={28}
            />
          {!this.state.showSeach && <TouchableOpacity onPress={() => this.searchAction()}>
            <Icon
              name='search'
              type='font-awesome'
              color='black'
              size={27}
            />
          </TouchableOpacity>}
          {this.state.showSeach && <TouchableOpacity onPress={() => this.searchAction()}>
              <Icon
                name='times'
                type='font-awesome'
                color='#B03A2E'
                size={28}
              />
            </TouchableOpacity>}
        </View>)
    }

    async showAll() {
      this.setState({ showSeach: false })
      this.setState({ showForm: false })
      this.props.navigation.push("DictionaryView")
    }

    setSeachBox() {
      if (this.state.showSeach) {
        return (<View style={styles.dictionaryView}>
          <Text style = { styles.resumeText }>Buscar entidad</Text>
          <TextInput blurOnSubmit={true} multiline={true} style = { styles.changeTranscript } placeholder="Ej: Disoft" onChangeText={(keyword) => this.setState({keyword: keyword})}  
           value={this.state.keyword}/> 
          <Text style={styles.transcript}></Text>
            <TouchableOpacity onPress={() => this._searchWord()}>
              <Text style={styles.saveNewValue}>Filtrar</Text>
            </TouchableOpacity>
         </View>)
      }
    }

    clear(unit, index) {
      if (unit==0) {
        this.state.words[index].entity = undefined
      } else if (unit==1) {
        this.state.words[index].cifValue = undefined
      } else {
        this.state.words[index].keywords = undefined
      }
      this.setState({ words: this.state.words })
    }

    setFlatList(){
      return (<FlatList vertical showsVerticalScrollIndicator={false} data={ this.state.words.sort((a,b) => a.entity.toLowerCase() > b.entity.toLowerCase()) } renderItem={({ item, index }) => (
        <View style={styles.wordsBox}>
          <View style={styles.dictionaryValues}>
          <Icon name='pencil' type='font-awesome' color='#000' size={20} onPress={() => this.clear(0, index)} />
          <TextInput style={styles.text} blurOnSubmit={true} multiline={true} onChangeText={(updateEntity) => this.setState({updateEntity: updateEntity})}>{item.entity}</TextInput>
          </View>
          <View style={styles.dictionaryValues}>
          <Icon name='pencil' type='font-awesome' color='#000' size={20} onPress={() => this.clear(1, index)}/>
          <TextInput style={styles.text} blurOnSubmit={true} multiline={true} onChangeText={(updateCIF) => this.setState({updateCIF: updateCIF})}>{item.cifValue} </TextInput>
          </View>
          <View style={styles.dictionaryValues}>
          <Icon name='pencil' type='font-awesome' color='#000' size={20} onPress={() => this.clear(2, index)} />
          <TextInput style={styles.text} blurOnSubmit={true} multiline={true} onChangeText={(updateKeywords) => this.state.updateKeywords=updateKeywords}>{item.keywords}</TextInput>
          </View>
          <View style={styles.dictionaryValues}>
          <TouchableOpacity onPress={() => this.updateWord(item, index)}>
            <Icon
              name='save'
              type='font-awesome'
              color="#148F77"
              size={25}
            />
            </TouchableOpacity>
            <Icon name='trash' type='font-awesome' color='white' size={15}/>
            <TouchableOpacity onPress={() => this.askDelete(item)}>
              <Icon
                name='trash'
                type='font-awesome'
                color='#B03A2E'
                size={25}
              />
            </TouchableOpacity>
          </View>
      </View>
    )}/>)
  }

    setWords() {
      if (!this.state.isSearching && this.state.words.length > 0 && !this.state.showSeach && !this.state.showForm) {
        return (
          <View style={styles.resumeView}>
            <Text style={styles.showTitle}>Entidades registradas</Text>
            <View style={styles.wordsBox}>
              <Text style={styles.dictionaryKeys}>Nombre</Text> 
              <Text style={styles.dictionaryKeys}>NIF</Text> 
              <Text style={styles.dictionaryKeys}>Palabras clave</Text> 
              <Text style={styles.dictionaryKeys}>Acción</Text> 
            </View>
            {this.setFlatList()}
        </View>
        )
      } else if (!this.state.isSearching && !this.state.showSeach && !this.state.showForm) {
        return (<View style={styles.resumeView}>
          <Text style={styles.showTitle}>{this.state.message}</Text>
          </View>)
      }
      return null
    }
  
    render() {
      return (
        <View style={{flex: 1}}>
          <ScrollView style={{backgroundColor: "#fff"}}>
          {this.setMenu()}
          <View>
            {this.setMenuButtons()}
            {this.setAddWordBox()}
            {this.setSeachBox()}
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
      paddingLeft:20,
      paddingBottom: 30,
      paddingRight: 10,
      backgroundColor: "#FFF",
      width:"100%",
    },
    showTitle:{
      textAlign: 'center',
      color: '#154360',
      fontWeight: 'bold',
      fontSize: 20,
      width: "100%",
      paddingBottom: 20,
      alignItems: "center"
      },
      resumeText: {
        fontSize: 20,
        textAlign: "justify",
        paddingTop: 20,
        color: "#000",
        fontWeight: 'bold',
        paddingBottom: 5
      },
      changeTranscript: {
        color: '#000',
        fontSize: 20,
        width: "90%",
        borderWidth: 0.5,
        borderColor: "#ECECEC",
        borderRadius: 20,
        paddingLeft: 10,
        paddingRight: 10
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
        padding: 10,
        fontSize: 15,
        textAlign: "center",
        color: "#000",
        fontWeight: 'bold',
        width:"24%",
      },
      dictionaryValues: {
        fontSize: 15,
        textAlign: "center",
        padding: 10,
        color: "#000",
        width:"24%",
        alignItems:"center",
      },
      wordsBox: {
        flexDirection:"row",
        width: "100%",
        textAlign:"center",
        borderBottomWidth:1,
        borderColor: "black"
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
        fontSize: 20,
        textAlign: "left",
        color: "#2E8B57",
        fontWeight: 'bold',
      },
      formBox: {
        fontSize: 18,
        textAlign: "center",
        color:"#1A5276",
        fontWeight: 'bold'
      },
      searchBox: {
        width: "90%", 
        flexDirection:'row', 
        textAlign: 'center',
        paddingBottom: 30
      },
      searchButton:{
        width: "90%", 
        flexDirection:'row', 
        justifyContent: 'flex-end',
      },
      text: {
        width:"100%",
        textAlign:"center"
      }
  })