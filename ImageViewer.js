import React, {Component} from 'react';
import {StyleSheet, View, Alert, Image, BackHandler, Dimensions, PermissionsAndroid} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import ImageZoom from 'react-native-image-pan-zoom';

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
  
    updateImage = async(uri, urid) => {
      var arrayImages = []
      for (let i = 0; i < this.state.images.length; i++) {
        if (this.state.images[i].id != this.state.image.id) {
          arrayImages.push({
            id: this.state.images[i].id,
            nombre: this.state.images[i].nombre,
            id_drive:'1qdFovzRbbT2rBKm2WdOMEXmO5quFHDgX',
            urid: this.state.images[i].urid,
            uri: this.state.images[i].uri
          })
        } else {
          var newImage = {
            id: this.state.images.id,
            nombre: this.state.image.nombre,
            id_drive:'1qdFovzRbbT2rBKm2WdOMEXmO5quFHDgX',
            urid: urid,
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
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "ContaVoz",
            message:"Se necesita acceder a su cámara",
            buttonNegative: "Cancelar",
            buttonPositive: "Aceptar"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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
                this.updateImage(uri.replace(/['"]+/g, ''), "")
              }
            })
          } else {
            this.showAlert("Error", "Solo puede adjuntar 10 imágenes")
          }
        }
      } catch (err) {}
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
            this.updateImage(uri.replace(/['"]+/g, ''), "")
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
            id: this.state.image.id + "_" + i,
            nombre: this.state.images[i].nombre,
            id_drive:'1qdFovzRbbT2rBKm2WdOMEXmO5quFHDgX',
            urid: this.state.images[i].urid,
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
      await AsyncStorage.getItem(this.state.petitionType).then((value) => {
        if (value != null) {
          list = JSON.parse(value) 
        }
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
      return (
        <ImageZoom
        cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height}
        imageWidth={Dimensions.get('window').width}
        imageHeight={Dimensions.get('window').height}>
        <Image
          source={{
            uri: this.state.image.uri
          }}
          resizeMode="contain"
          key={this.state.image}
          style={{ width: "100%", height: "100%" }}
        />
        </ImageZoom>
      )
    }

    setFootbar() {
      return (<View style={styles.darkFootBar}>
      <Icon
          name='camera'
          type='font-awesome'
          color='#FFF'
          size={40}
          onPress={this.takePhoto}
        />
        <Icon
          name='plus'
          type='font-awesome'
          color='#154360'
          size={35}
        />
        <Icon
          name='plus'
          type='font-awesome'
          color='#154360'
          size={35}
        />
        <Icon
          name='image'
          type='font-awesome'
          color='#FFF'
          size={40}
          onPress={this.goGallery}
        />
        <Icon
          name='plus'
          type='font-awesome'
          color='#154360'
          size={35}
        />
        <Icon
          name='plus'
          type='font-awesome'
          color='#154360'
          size={35}
        />
        <Icon
          name='trash'
          type='font-awesome'
          color='#FFF'
          size={40}
          onPress={this._delete}
        />
      </View>)
    }
  
    render () {
      return (
        <View style={styles.imageView}>
          <View style={styles.selectedImageView}>
          {this.setImageZoom()}
        </View>
          {this.setFootbar()}
        </View>
      );
    }
  }

  export default createAppContainer(ImageViewerScreen);

  const styles = StyleSheet.create({
    imageView: {
        flex: 1,
        backgroundColor:"#154360",
      },
      selectedImageView: {
        flex: 1,
        alignItems: 'center',
        textAlign: "center",
        backgroundColor: "#154360",
      },
      darkFootBar: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#154360", 
        flexDirection:'row', 
        textAlignVertical: 'center',
        height: 60
      },
    })