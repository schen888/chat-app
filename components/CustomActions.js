 import React from 'react';
 import PropTypes from 'prop-types';
 import * as Permissions from 'expo-permissions';
 import * as Location from 'expo-location';
 import * as ImagePicker from 'expo-image-picker';
 import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
 import { connectActionSheet } from '@expo/react-native-action-sheet';
 import firebase from 'firebase';
 import 'firebase/firestore';
 
 export default class CustomActions extends React.Component {

   //Select a photo from library
   imagePicker = async () => {
     //expo permission to access media libary
     const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
     try {
       if (status === 'granted') {
         const result = await ImagePicker.launchImageLibraryAsync({
           mediaTypes: ImagePicker.MediaTypeOptions.Images, // option: only images permitted
         }).catch((error) => console.log(error));
         // if process canceled
         if (!result.canceled) {
           const imageUrl = await this.uploadImageFetch(result.uri);
           this.props.onSend({ image: imageUrl });
         }
       }
     } catch (error) {
       console.log(error.message);
     }
   };
 
   //Take photo
   takePhoto = async () => {
    //permission to access user's camera and media library
     const { status } = await Permissions.askAsync(
       Permissions.CAMERA,
       Permissions.MEDIA_LIBRARY
     );
     try {
       if (status === 'granted') {
         const result = await ImagePicker.launchCameraAsync({
           mediaTypes: ImagePicker.MediaTypeOptions.Images,
         }).catch((error) => console.log(error));

         if (!result.canceled) {
           const imageUrl = await this.uploadImageFetch(result.uri);
           this.props.onSend({ image: imageUrl });
         }
       }
     } catch (error) {
       console.log(error.message);
     }
   };
 
   //Get the location of the user
   getLocation = async () => {
     try {
       const { status } = await Permissions.askAsync(Permissions.LOCATION);
       if (status === 'granted') {
         const result = await Location.getCurrentPositionAsync({}).catch(
           (error) => console.log(error)
         );
         const longitude = JSON.stringify(result.coords.longitude);
         const altitude = JSON.stringify(result.coords.latitude);
         if (result) {
           this.props.onSend({
             location: {
               longitude: result.coords.longitude,
               latitude: result.coords.latitude,
             },
           });
         }
       }
     } catch (error) {
       console.log(error.message);
     }
   };
 
   //Upload images to firebase
   uploadImageFetch = async (uri) => {
    console.log('uri:', uri);
     const blob = await new Promise((resolve, reject) => {
       const xhr = new XMLHttpRequest();
       xhr.onload = function () {
         resolve(xhr.response);
       };
       xhr.onerror = function (e) {
         console.log(e);
         reject(new TypeError('Network request failed'));
       };
       xhr.responseType = 'blob';
       xhr.open('GET', uri, true);
       xhr.send(null);
     });
 
     const imageNameBefore = uri.split('/');
     const imageName = imageNameBefore[imageNameBefore.length - 1];
 
     const ref = firebase.storage().ref().child(`images/${imageName}`);
 
     const snapshot = await ref.put(blob);
 
     blob.close();
 
     return await snapshot.ref.getDownloadURL();
   };
 
   //Communication features handler
   onActionPress = () => {
     const options = [
       'Choose From Library',
       'Take Picture',
       'Send Location',
       'Cancel',
     ];
     const cancelButtonIndex = options.length - 1;
     //Generate actionSheet
     this.props.showActionSheetWithOptions(
       {
         options,
         cancelButtonIndex,
       },
       async (buttonIndex) => {
         switch (buttonIndex) {
           case 0:
            return this.imagePicker();
           case 1:
            return this.takePhoto();
           case 2:
            return this.getLocation();
         }
       }
     );
   };
 
   render() {
     return (
       <TouchableOpacity
         accessible={true}
         accessibilityLabel="More options"
         accessibilityHint="Options for sending an image from your media libary, taking and sending a picture or your geolocation."
         style={[styles.container]}
         onPress={this.onActionPress.bind(this)}
       >
         <View style={[styles.wrapper, this.props.wrapperStyle]}>
           <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
         </View>
       </TouchableOpacity>
     );
   }
 }
 
 const styles = StyleSheet.create({
   container: {
     width: 26,
     height: 26,
     marginLeft: 10,
     marginBottom: 8,
   },
   wrapper: {
     borderRadius: 13,
     borderColor: '#b2b2b2',
     borderWidth: 2,
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center'
   },
   iconText: {
     color: '#b2b2b2',
     fontWeight: 'bold',
     fontSize: 8,
     backgroundColor: 'transparent',
     textAlign: 'center',
     
     //paddingBottom: '20%'
   },
 });
 
 CustomActions.contextTypes = {
   actionSheet: PropTypes.func,
 };
 
 CustomActions = connectActionSheet(CustomActions);