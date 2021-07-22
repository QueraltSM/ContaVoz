import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList, BackHandler, ScrollView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

class PetitionListScreen extends Component { 

    constructor(props) {
      super(props);
      this.state = {
        type: "",
        config: "",
        lists: []
      }
      this.init()
    }

    async init() {
      await AsyncStorage.getItem("type").then((value) => {
        this.setState({ type: value })
      })
      await AsyncStorage.getItem("config").then((value) => {
        this.setState({ config: JSON.parse(value) })
      })
      var array = []
      for (let i = 0; i < this.state.config.length; i++) {
        await AsyncStorage.getItem(this.state.type+"."+i).then((value) => {
          if (value != null) {
            array.push(JSON.parse(value).length)
          } else {
            array.push(0)
          }
        })
      }
      this.setState({ lists: array })
    }
  
    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }
  
    goBack = () => {
      this.props.navigation.push("Main")
      return true
    }
  
    openDocument = async (item, index) => {
      await AsyncStorage.setItem("listid", this.state.type+"."+index)
      await AsyncStorage.setItem("data", JSON.stringify(item))
      this.props.navigation.push("PetitionHistory")
    }

    setData (item, index) {
      return (<TouchableOpacity onPress={() => this.openDocument(item, index)}>
                <Text style={styles.registeredDocuments}>{item.titulo} ({this.state.lists[index]})</Text>
              </TouchableOpacity>)
    }
    render () {
      return (
        <View style={{flex: 1, backgroundColor:"#FFF" }}>
          <View style={styles.navBarBackHeader}>
            <Text style={styles.navBarHeader}>Tipos de {this.state.type}</Text>
          </View>
          <ScrollView vertical style={{backgroundColor: "#FFF" }}>
          <View style={styles.sections}>
            <View style={styles.voiceControlView}>
            <FlatList 
              vertical
              showsVerticalScrollIndicator={false}
              data={ this.state.config } 
              renderItem={({ item, index }) => (
              (<View>
                {this.setData(item, index)}
              </View>))}
            />
          </View>
          </View>
          </ScrollView>   
        </View>
      );
    }
  }
  
  export default createAppContainer(PetitionListScreen);

  const styles = StyleSheet.create({
    voiceControlView: {
        flex: 1,
        backgroundColor: "#FFF",
        paddingTop: 40,
        alignContent: "center",
        alignSelf: "center",
        width: "90%",
      },
      registeredDocuments: {
        fontSize: 19,
        textAlign: "center",
        paddingTop: 20,
        color: "#1A5276",
        fontWeight: 'bold',
        paddingBottom: 15
      },
      showTitle:{
        textAlign: 'center',
        color: '#154360',
        fontWeight: 'bold',
        fontSize: 18,
        width: "90%",
        paddingBottom: 20,
      },
      navBarBackHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#1A5276", 
        flexDirection:'row', 
        textAlignVertical: 'center',
        height: 60
      },
      navBarHeader: {
        flex: 1,
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center'
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
})