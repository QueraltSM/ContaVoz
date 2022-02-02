import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, BackHandler, FlatList, ScrollView, SafeAreaView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import { RFPercentage } from "react-native-responsive-fontsize";

class DictionaryViewScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        userid: "",
        words: [],
        copyWords: [],
        addKeywords: "",
        addEntity: "",
        addCIF: "",
        updateKeywords: "",
        updateEntity: "",
        updateCIF: "",
        showForm: false,
        showSeach: false,
        keyword: "",
        isSearching: false,
        canSave: false,
        message: "",
        initWords: false,
        listIndex: -1
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
        if (value != null) this.setState({ words: JSON.parse(value).reverse() })
        this.setState({ initWords: true })
      })
      this.setState({copyWords: this.state.words})
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
        this.formAction(false)
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
          if (i.keywords.toLowerCase().includes(this.state.keyword.toLowerCase()) 
          || i.entity.toLowerCase().includes(this.state.keyword.toLowerCase()) 
          || i.cifValue.toLowerCase().includes(this.state.keyword.toLowerCase())) {
            filteredWords.push(i)
          }
        })
        this.setState({ words: filteredWords })
        this.setState({ keyword: "" })
        this.setState({ showForm: false })
        this.setState({ showSeach: false })
        this.setState({ isSearching: false })
        this.setState({ message: "No hay entidades coincidentes" })
      }
    }

    async updateAllWords() {
      if (this.state.words.length > 0) {
        this.showAlert("Proceso completado", "Se han actualizado los datos")
        await AsyncStorage.setItem(this.state.userid+".words", JSON.stringify(this.state.copyWords))
        this.reset()
      } else this.showAlert("Atención", "No hay entidades registradas")
    }

    updateWord = async (index) => {
      if (index==0) {
        this.state.copyWords[index].entity = this.state.updateEntity
        await this.setState({updateEntity:""})
      } else if (index==1) {
        this.state.copyWords[index].cifValue = this.state.updateCIF
        await this.setState({updateCIF:""})
      } else {
        this.state.copyWords[index].keywords = this.state.updateKeywords
        await this.setState({updateKeywords:""})
      }
    }

    async reset() {
      await this.setState({updateEntity: ""})
      await this.setState({updateKeywords: ""})
      await this.setState({updateCIF: ""})
      await this.props.navigation.push("DictionaryView")
    }

    _addWord = async () => {
      if (this.state.addKeywords == "" || this.state.addEntity == "" || this.state.addCIF == "") this.showAlert("Error", "Complete todos los campos para registrar una entidad")
      else await this.pushArrayWords()
    }
  
    formAction = (value) => {
      this.setState({showForm: value})
    }

    searchAction = (value) => {
      this.setState({showSeach: value})
      this.setState({isSearching: value})
    }
  
    setAddWordBox() {
      if (this.state.showForm) {
        return (
          <View style={styles.dictionaryView}>
            <Text style={styles.resumeText}>Nombre de la entidad</Text>
            <TextInput placeholderTextColor="darkgray" blurOnSubmit={true} value={this.state.addEntity} multiline={true} style={styles.changeTranscript} placeholder="Ej: Disoft Servicios Informáticos S.L." onChangeText={addEntity => this.setState({addEntity})}></TextInput>
            <View style={{flexDirection:"row", alignItems:"center"}}><Text style={styles.resumeText}> Palabras clave</Text></View>
            <TextInput placeholderTextColor="darkgray" blurOnSubmit={true} value={this.state.addKeywords} multiline={true} style={styles.changeTranscript} placeholder="Palabras que identifican a la empresa. Ej: Disoft, Mi empresa, Fifo" onChangeText={addKeywords => this.setState({addKeywords})}></TextInput>
            <Text style={styles.resumeText}>CIF de la entidad</Text>
            <TextInput placeholderTextColor="darkgray" blurOnSubmit={true} value={this.state.addCIF} multiline={true} style={styles.changeTranscript} placeholder="Ej: B35222249" onChangeText={addCIF => this.setState({addCIF})}></TextInput>
            <Text style={styles.transcript}></Text>
          <View style={{flexDirection:"row", justifyContent:"center", paddingBottom: 100 }}>
            <TouchableOpacity onPress={() => this._addWord()}><Text style={styles.saveNewValue}>Grabar</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => this.formAction(false)}>
              <Text style={styles.exitForm}>Cerrar</Text>
            </TouchableOpacity>
            </View>
          </View>)
      }
    }
  
    setTitle = () => {
      if (!this.state.initWords) return null
      if (this.state.updateEntity.length>0) this.updateWord(0) 
      if (this.state.updateCIF.length>0) this.updateWord(1) 
      if (this.state.updateKeywords.length>0) this.updateWord(2)
      if (this.state.words.length > 0) this.state.message = "Diccionario de entidades"
      if (this.state.words.length == 0 && !this.state.showSeach && !this.state.showForm) this.state.message = "No hay entidades registradas"
      if (this.state.showSeach) this.state.message = "Búsqueda de entidades"
      if (this.state.showForm) this.state.message = "Registrar una entidad"
    }

    setMenu() {
      return(
        <View style={{backgroundColor:"#FFF"}}>
          <View style={styles.accountingViewShow}><Icon name='list' type='font-awesome' color='#000' size={45} /></View>
          <Text style={styles.mainHeader}>Entidades</Text>
        </View>
      )
    }

    async askDelete(item) {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "Eliminar entidad",
          "¿Desea eliminar los datos de esta entidad permanentemente?",
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
            {!this.state.showSeach && <TouchableOpacity onPress={() => this.formAction(true)}>
            <Icon
              name='plus'
              type='font-awesome'
              color='black'
              size={35}
            />
          </TouchableOpacity>}
          {!this.state.showSeach && <Icon name='search' type='font-awesome' color='white' size={35} />}
          <TouchableOpacity onPress={() => this.props.navigation.push("Main")}>
              <Icon
                name='home'
                type='font-awesome'
                color='black'
                size={35}
              />
            </TouchableOpacity>
          {!this.state.showForm && <Icon name='search' type='font-awesome' color='white' size={35} />}
          {!this.state.showForm && <TouchableOpacity onPress={() => this.searchAction(true)}>
            <Icon
              name='search'
              type='font-awesome'
              color='black'
              size={35}
            />
          </TouchableOpacity>}
          {!this.state.showForm  && <Icon name='search' type='font-awesome' color='white' size={35} />}
          {!this.state.showForm  && <TouchableOpacity onPress={() => this.updateAllWords()}>
            <Icon
              name='save'
              type='font-awesome'
              color='#148F77'
              size={35}
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
        return (<View><View style={styles.dictionaryView}>
          <Text style = { styles.resumeText }>Buscar entidad</Text>
          <TextInput placeholderTextColor="darkgray" blurOnSubmit={true} multiline={true} style = { styles.changeTranscript } placeholder="Ej: Disoft, B35222249, Fifo" onChangeText={(keyword) => this.setState({keyword: keyword})}  
           value={this.state.keyword}/> 
          <Text style={styles.transcript}></Text>
         </View>
         <View style={{flexDirection:"row", justifyContent:"center"}}>
          <TouchableOpacity onPress={() => this._searchWord()}>
              <Text style={styles.saveNewValue}>Filtrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.searchAction(false)}>
              <Text style={styles.exitForm}>Cerrar</Text>
            </TouchableOpacity>
          </View></View>)
      }
    }

    setFlatList(){
      return (<FlatList vertical showsVerticalScrollIndicator={false} data={ this.state.words.sort((a,b) => a.entity.toLowerCase() > b.entity.toLowerCase()) } renderItem={({ item, index }) => (
        <View style={styles.wordsBox}>
          <View style={styles.dictionaryValues}>
            <View style={styles.dictionaryContent}>
              <TextInput placeholderTextColor="darkgray" style={styles.boldText} blurOnSubmit={true} multiline={true} onChangeText={(updateEntity) => this.setState({updateEntity: updateEntity, listIndex: index})}>{item.entity}</TextInput>
            </View>
          </View>
          <View style={styles.dictionaryValues}>
            <View style={styles.dictionaryContent}>
              <Text style={styles.boldText}>CIF</Text>
              <TextInput placeholderTextColor="darkgray" style={styles.text} blurOnSubmit={true} multiline={true} onChangeText={(updateCIF) => this.setState({updateCIF: updateCIF, listIndex: index})}>{item.cifValue} </TextInput>
            </View>
          </View>
          <View style={styles.dictionaryValues}>
            <View style={styles.dictionaryContent}>
              <Text style={styles.boldText}>Palabras clave</Text><TextInput placeholderTextColor="darkgray" style={styles.text} blurOnSubmit={true} multiline={true} onChangeText={(updateKeywords) => this.setState({updateKeywords: updateKeywords, listIndex: index})}>{item.keywords}</TextInput>
            </View>
           </View>
          <View style={styles.dictionaryValuesActions}>
            <Icon name='trash' type='font-awesome' color='white' size={30}/>
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
      return <View style={styles.resumeView}>
      <Text style={styles.showTitle}>{this.state.message}</Text>
      {!this.state.isSearching && this.state.words.length > 0 && !this.state.showSeach && !this.state.showForm && this.setFlatList()}
      </View>
  }

  setBackButton() {
      return <View style={{alignSelf: 'flex-start', left: 20}}>
      <TouchableOpacity onPress={() => this.goBack()} >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#1A5276'
            size={30}
          />
          </TouchableOpacity>
      </View>
    }
  
    render() {
      return (
        <SafeAreaView style={{flex: 1,backgroundColor:"white"}}>
        {this.setBackButton()}
        <View style={{flex: 1}}>
          <ScrollView style={{backgroundColor: "#fff"}}>
          {this.setMenu()}
          {this.setTitle()}
          <View>
            {this.setMenuButtons()}
            {this.setWords()}
            {this.setAddWordBox()}
            {this.setSeachBox()}
          </View>
          </ScrollView>
        </View>
        </SafeAreaView>
      );
    }
  }

  export default createAppContainer(DictionaryViewScreen);

  const styles = StyleSheet.create({
    resumeView: {
      paddingTop: 20,
      paddingLeft:20,
      paddingRight: 10,
      backgroundColor: "#FFF",
      width:"100%",
    },
    showTitle:{
      textAlign: 'center',
      color: '#154360',
      fontWeight: 'bold',
      fontSize: RFPercentage(3),
      width: "100%",
      paddingBottom: 20,
      alignItems: "center"
      },
      resumeText: {
        fontSize: RFPercentage(3),
        textAlign: "left",
        paddingTop: 20,
        color: "#000",
        fontWeight: 'bold',
        paddingBottom: 5
      },
      changeTranscript: {
        color: '#000',
        fontSize: RFPercentage(2.5),
        width: "90%",
        borderWidth: 0.5,
        borderColor: "darkgray",
        borderRadius: 20,
        paddingLeft: 10,
        paddingRight: 10,
        padding: 10
      },
      transcript: {
        color: '#000',
        fontSize: 20,
        width: "95%",
        padding: 10
      },
      mainHeader: {
        paddingTop: 20,
        alignItems: 'center',
        textAlign: "center",
        fontWeight: "bold",
        color: "#000",
        fontSize: RFPercentage(4),
      },
      dictionaryView: {
        paddingLeft: 40,
        backgroundColor: "#FFF",
        width:"95%"
      },
      dictionaryValues: {
        padding: 5,
      },
      dictionaryContent: {
        paddingLeft: 10,
        paddingRight: 10,
        alignItems:"center",
        flexDirection:"row",
        fontSize: RFPercentage(3),
        textAlign: "left",
        borderWidth: 0.5,
        borderColor: "darkgray",
        borderRadius: 20,
        width:"100%"
      },
      dictionaryValuesActions: {
        textAlign: "right",
        flexDirection:"row",
        justifyContent:"flex-end"
      },
      wordsBox: {
        width: "95%",
        textAlign:"left",
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
        fontSize: RFPercentage(3),
        color: "#2E8B57",
        fontWeight: 'bold',
        padding:10
      },
      formBox: {
        fontSize: RFPercentage(3),
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
        textAlign:"left",
        fontSize: RFPercentage(2),
        paddingLeft: 10,
        paddingRight: 10,
        width:"95%"
      },
      boldText: {
        textAlign:"center",
        fontSize: RFPercentage(2),
        fontWeight:"bold",
        padding: 10
      },
      exitForm: {
        fontSize: RFPercentage(3),
        color: "#B03A2E",
        fontWeight: 'bold',
        padding:10
      }
  })