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
        id: this.props.navigation.state.params.id,
        images: this.props.navigation.state.params.images,
        image: this.props.navigation.state.params.image,
        back: this.props.navigation.state.params.back,
        type: this.props.navigation.state.params.type,
      }
    }
  
    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }
  
    goBack = () => {
      if (this.state.back == "Petition" || this.state.images == 0) {
        this.props.navigation.push(this.state.back, {id: this.state.id })
      } else {
          this.props.navigation.push("ResumeView", {
            id: this.state.id,
            images: this.state.images,
            back: this.state.back,
            type: this.state.type,
          })
        }
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
            uri: this.state.images[i].uri
          })
        } else {
          var newImage = {
            id: this.state.image.id,
            uri: uri
          }
          arrayImages.push(newImage)
          this.setState({image: newImage})
        }
      }
      this.setState({images: arrayImages})
      await AsyncStorage.setItem(this.state.id+".images", JSON.stringify(arrayImages))
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
            customButtons: [
              { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
            ],
            storageOptions: {
              skipBackup: true,
              path: 'images',
              privateDirectory: true,
            },
          };
          if (this.state.images.length <= 9) {
            ImagePicker.launchCamera(options, (response) => {
              if (response.didCancel || response.error || response.customButton) {
                console.log(JSON.stringify(response));
              } else {
                var uri = JSON.stringify(response.assets[0]["uri"])
                this.updateImage(uri)
              }
            })
          } else {
            this.showAlert("Error", "Solo puede adjuntar 10 imágenes")
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  
    goGallery = async () => {
      let options = {
        title: 'Foto desde la galería',
        customButtons: [
          { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
        ],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      if (this.state.images.length <= 9) {
        ImagePicker.launchImageLibrary(options, (response) => {
          if (response.didCancel || response.error || response.customButton) {
            console.log('Something happened');
          } else {
            var uri = JSON.stringify(response.assets[0]["uri"])
            this.updateImage(uri)
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
            id:  this.state.image.id + "_" + i,
            uri: this.state.images[i].uri
          })
        }
      }
      await AsyncStorage.setItem(this.state.id+".images", JSON.stringify(arrayImages))
      this.setState({images: arrayImages})
      if (this.state.images.length == 0) {
        this.props.navigation.push(this.state.type, {id: this.state.id})
      } else {
        this.goBack()
      }
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
            uri: this.state.image.uri.replace(/['"]+/g, '')
          }}
          resizeMode="center"
          key={this.state.image}
          style={{ width: "100%", height: "100%" }}
        />
        </ImageZoom>
      )
    }
  
    render () {
      return (
        <View style={styles.imageView}>
          <View style={styles.selectedImageView}>
          {this.setImageZoom()}
        </View>
          <View style={styles.darkFootBar}>
            <Icon
                name='camera'
                type='font-awesome'
                color='#FFF'
                size={30}
                onPress={this.takePhoto}
              />
              <Icon
                name='plus'
                type='font-awesome'
                color='#000'
                size={35}
              />
              <Icon
                name='plus'
                type='font-awesome'
                color='#000'
                size={35}
              />
              <Icon
                name='image'
                type='font-awesome'
                color='#FFF'
                size={30}
                onPress={this.goGallery}
              />
              <Icon
                name='plus'
                type='font-awesome'
                color='#000'
                size={35}
              />
              <Icon
                name='plus'
                type='font-awesome'
                color='#000'
                size={35}
              />
              <Icon
                name='trash'
                type='font-awesome'
                color='#FFF'
                size={30}
                onPress={this._delete}
              />
            </View>
          </View>
      );
    }
  }

  export default createAppContainer(ImageViewerScreen);

  const styles = StyleSheet.create({
    imageView: {
        flex: 1,
        backgroundColor:"#000",
        paddingTop: 30,
      },
      selectedImageView: {
        flex: 1,
        alignItems: 'center',
        textAlign: "center",
        backgroundColor: "#000",
      },
      darkFootBar: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#000", 
        flexDirection:'row', 
        textAlignVertical: 'center',
        height: 50
      },
    })