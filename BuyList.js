import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList, BackHandler, ScrollView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';

class BuyListScreen extends Component { 

    constructor(props) {
      super(props);
      this.state = {
        userid: "",
        buyList: []
      }
      this.init()
    }
  
    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }
  
    goBack = () => {
      this.props.navigation.push("Main")
      return true
    }
  
    async init() {
      await AsyncStorage.getItem('userid').then((value) => {
        this.setState({ userid: value })
      })
      await AsyncStorage.getItem(this.state.userid+"-buyList").then((value) => {
        if (value != null) {
          this.setState({ buyList: JSON.parse(value) })
        }
      })
    }
  
    addBuy = async () => {
      var array = this.state.buyList
      var today = new Date()
      var document = {
        id: "C_"+this.state.userid+"-"+today.getFullYear()+""+("0" + (today.getMonth() + 1)).slice(-2)+""+("0" + (today.getDate())).slice(-2)+ "-" + ("0" + (today.getHours())).slice(-2)+ ":" + ("0" + (today.getMinutes())).slice(-2),
        name: ("0" + (today.getDate())).slice(-2)+"/"+("0" + (today.getMonth() + 1)).slice(-2)+"/"+today.getFullYear()+" a las " + ("0" + (today.getHours())).slice(-2)+ ":"+("0" + (today.getMinutes())).slice(-2),
        time: new Date().getTime()
      }
      array.push(document)
      await AsyncStorage.setItem(this.state.userid+"-buyList", JSON.stringify(array))
      this.props.navigation.push('Buy',{id: document.id})
    }
  
    openDocument(item) {
      this.props.navigation.push("Buy", {id: item.id})
    }
  
    setBuyList() {
      if (this.state.buyList.length > 0) {
        return (
          <View style={styles.voiceControlView}>
            <FlatList 
              vertical
              showsVerticalScrollIndicator={false}
              data={ this.state.buyList.sort((a,b) => a.time < b.time) } 
              renderItem={({ item }) => (
                (<TouchableOpacity onPress={() => this.openDocument(item)}>
                    <Text style={styles.registeredDocuments}>{item.name}</Text>
                  </TouchableOpacity>
                ) 
              )}
          />
        </View>)
      }
      return (<View style={styles.resumeView}><Text style={styles.showTitle}>No hay registros</Text></View>)
    }
  
    render () {
      return (
        <View style={{flex: 1, backgroundColor:"#FFF" }}>
          <View style={styles.navBarBackHeader}>
          <View style={{ width: 70,textAlign:'center' }}>
              <Icon
                name='trash'
                type='font-awesome'
                color='#1A5276'
                size={30}
              />
            </View>
            <Text style={styles.navBarHeader}>Registros de compras</Text>
            <View style={{ width: 70,textAlign:'center' }}>
              <Icon
                name='plus'
                type='font-awesome'
                color='#FFF'
                size={30}
                onPress={this.addBuy}
              />
            </View>
          </View>
          <ScrollView style={{backgroundColor: "#FFF" }}>
          <View style={styles.sections}>
            {this.setBuyList()}
          </View>
          </ScrollView>   
        </View>
      );
    }
  }
  
  export default createAppContainer(BuyListScreen);

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
})