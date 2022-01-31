import React, {Component} from 'react';
import {StyleSheet, View, Alert, Image, BackHandler, Dimensions, PermissionsAndroid, SafeAreaView, Text} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import { RFPercentage } from "react-native-responsive-fontsize";

class ImageViewerScreen extends Component {

    constructor(props) {
      super(props);
      this.state = {
        petitionType: "",
        petitionID: "",
        images: [],
        back: this.props.navigation.state.params.back,
        image: this.props.navigation.state.params.image
      }
      this.init()
    }

    async init() {
      await AsyncStorage.getItem("petitionType").then((value) => {
        this.setState({ petitionType: value })
      })
      await AsyncStorage.getItem("petitionID").then((value) => {
        this.setState({ petitionID: JSON.parse(value).id })
      })
      await AsyncStorage.getItem(this.state.petitionID+".images").then((value) => {
        if (value != null) this.setState({ images: JSON.parse(value) })
      })
    }
  
    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }
  
    goBack = () => {
      this.props.navigation.push(this.state.back)
      return true
    }
  
    async saveInMemory(key, value) {
      await AsyncStorage.setItem(key, value)
    }
  
    updateImage = async(uri) => {
      var arrayImages = []
      for (let i = 0; i < this.state.images.length; i++) {
        if (this.state.images[i].id != this.state.image.id) {
          arrayImages.push({
            id: this.state.images[i].id,
            nombre: this.state.images[i].nombre,
            uri: this.state.images[i].uri
          })
        } else {
          var newImage = {
            id: this.state.images.id,
            nombre: this.state.image.nombre,
            uri: uri
          }
          arrayImages.push(newImage)
          this.setState({image: newImage})
        }
      }
      this.setState({images: arrayImages})
      this.saveImages()
    }
  
    takePhoto = async() =>{
      let options = {
        title: 'Hacer una foto',
        quality: 0.5,
        aspect:[4,3],
        customButtons: [ { name: 'customOptionKey', title: 'Choose Photo from Custom Option' }, ],
        storageOptions: {
          skipBackup: true,
          path: 'images',
          privateDirectory: true,
        },
        includeBase64: false
      };
      if (this.state.images.length <= 9) {
        ImagePicker.launchCamera(options, (response) => {
          if (response.didCancel || response.error || response.customButton) {
          } else {
            var uri = JSON.stringify(response.assets[0]["uri"])
            this.updateImage(uri.replace(/['"]+/g, ''))
          }
        })
      } else {
        this.showAlert("Error", "Solo puede adjuntar 10 imágenes")
      }
    }
  
    goGallery = async () => {
      let options = {
        title: 'Foto desde la galería',
        quality: 0.5,
        aspect:[4,3],
        customButtons: [ { name: 'customOptionKey', title: 'Choose Photo from Custom Option' }, ],
        storageOptions: {
          skipBackup: true,
          path: 'images',
          privateDirectory: true,
        },
        includeBase64: false
      };
      if (this.state.images.length <= 9) {
        ImagePicker.launchImageLibrary(options, (response) => {
          if (response.didCancel || response.error || response.customButton) {
          } else {
            var uri = JSON.stringify(response.assets[0]["uri"])
            this.updateImage(uri.replace(/['"]+/g, ''))
          }
        })
      } else {
        this.showAlert("Error", "Solo puede adjuntar 10 imágenes")
      }
    }
  
    async delete() {
      var arrayImages = []
      for (let i = 0; i < this.state.images.length; i++) {
        if (this.state.images[i].id != this.state.image.id) {
          arrayImages.push({
            id: this.state.image.id.split("_")[0] + "_" + i,
            nombre: this.state.images[i].nombre,
            uri: this.state.images[i].uri
          })
        }
      }
      this.setState({images: arrayImages})
      this.saveImages()
      if (this.state.images.length == 0) {
        this.props.navigation.push("Petition", {id: this.state.id })
      } else {
        this.goBack()
      }
    }

    async saveImages() {
      var list = []
      await AsyncStorage.getItem(this.state.petitionType + "").then((value) => {
        if (value != null) list = JSON.parse(value) 
      })
      var index = list.findIndex(obj => obj.id == this.state.petitionID)
      list[index].images = this.state.images
      await AsyncStorage.setItem(this.state.petitionType, JSON.stringify(list))
      await AsyncStorage.setItem(this.state.petitionID+".images", JSON.stringify(this.state.images))
    }
  
    _delete = async() => {
      const AsyncAlert = () => new Promise((resolve) => {
        Alert.alert(
          "Eliminar imagen",
          "¿Está seguro que desea eliminar esta imagen?",
          [
            {
              text: 'Sí',
              onPress: () => {
                resolve(this.delete());
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
  
    setImageZoom() {
      var imageuri = this.state.image.uri
      if (Platform.OS === 'ios') imageuri = '~' + imageuri.substring(imageuri.indexOf('/tmp'));
      return (<Image
          source={{
            uri: imageuri 
          }}
          resizeMode="contain"
          style={{ width: "100%", height: "100%" }}/>
      )
    }

    setFootbar() {
      return (<View style={styles.darkFootBar}>
      <Icon
          name='camera'
          type='font-awesome'
          color='#154360'
          size={40}
          onPress={this.takePhoto}
        />
        <Icon
          name='plus'
          type='font-awesome'
          color='white'
          size={35}
        />
        <Icon
          name='plus'
          type='font-awesome'
          color='white'
          size={35}
        />
        <Icon
          name='image'
          type='font-awesome'
          color='#154360'
          size={40}
          onPress={this.goGallery}
        />
        <Icon
          name='plus'
          type='font-awesome'
          color='white'
          size={35}
        />
        <Icon
          name='plus'
          type='font-awesome'
          color='white'
          size={35}
        />
        <Icon
          name='trash'
          type='font-awesome'
          color='#154360'
          size={40}
          onPress={this._delete}
        />
      </View>)
    }
  
    render () {
      return (
        <SafeAreaView style={{flex: 1,backgroundColor:"white"}}>
        <View style={styles.imageView}>
          <View style={styles.selectedImageView}>
          {this.setImageZoom()}
        </View>
          {this.setFootbar()}
        </View></SafeAreaView>
      );
    }
  }

  export default createAppContainer(ImageViewerScreen);

  const styles = StyleSheet.create({
    imageView: {
        flex: 1,
        backgroundColor:"white",
      },
      selectedImageView: {
        flex: 1,
      },
      darkFootBar: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"white", 
        flexDirection:'row', 
        textAlignVertical: 'center',
        height: 60
      },
      navBarHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"white", 
        flexDirection:'row',
        textAlign: 'center',
        width: "100%",
        paddingLeft:10,
        paddingRight:10
      },
      mainHeader: {
        padding: 10,
        alignItems: 'center',
        textAlign: "center",
        fontWeight: "bold",
        color: "black",
        fontSize: RFPercentage(3),
        paddingTop: 20
      },
    })