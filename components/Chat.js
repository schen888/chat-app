import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import firebase from 'firebase';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid:'',
      isConnected: false
    }

    // Initialize Firebase with ChatApp's config 
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyBb79g9-bZxr6F3chO3Ibvl6-G5a7PGdlA",
        authDomain: "chatapp-504a2.firebaseapp.com",
        projectId: "chatapp-504a2",
        storageBucket: "chatapp-504a2.appspot.com",
        messagingSenderId: "709536287370",
        appId: "1:709536287370:web:33de61f4d17afcd9e1fb73"
      });
    }

    //connect to messages collection
    this.referenceMessages = firebase.firestore().collection('messages');
  }

  //Append the newly sent message by user to the state & call addMessage
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), ()=>{
      this.addMessage();
      this.saveMessages();
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
      this.setState({messages})
    });
  }
  //Add the newly sent message to db (once the state object is updated)
  // also async????
  addMessage=()=>{
    const message = this.state.messages[0];
    console.log('addMessage:', message);
    
      this.referenceMessages.add({
        uid: this.state.uid,
        _id: message._id,
        text: message.text || '',
        createdAt: message.createdAt,
        user: message.user,
      });
  }

  //save message into the sayncStorage, after a message is sent (the state object is updated)
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
      //await AsyncStorage.setItem( "currentUser", JSON.stringify(this.state.messages[0].user) );
    } catch (error) {
      console.log(error.message);
    }
  }

  //retriev messages from the asyncStorage
  async getMessages() {
    let messages = "";
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      console.log('messages in the asyncStorage:', messages);
      this.setState({
        messages: JSON.parse(messages)
      });
      console.log('state after getMessage:', this.state.messages);
    } catch (error) {
      console.log(error.message);
    }
  };
  //Delete messages from the asyncStorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount(){
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    //Uncomment to delete messages in asyncStorage
    //this.deleteMessages();

    //use netInfo to check if online or offline
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
        this.setState({isConnected: true});
      } else {
        console.log("offline");
        this.setState({isConnected: false});
        //retrieve pre-stored messages in asyncStorage
        this.getMessages();
      }
    });

     //Authenticate user
     this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      console.log('user1', user);
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      console.log('user2', user);
      /* after user is logged in and the returned obj for connecting with db is not undefined, with onSnapshot() listen to the 
      changes in the collection, feed snapshot of the collection to onCollectionUpdate() and return the unsunbscribe()*/
      if (user) {
        if (this.referenceMessages) {
          this.unsubscribe = this.referenceMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        }
        //store uid in the state(necessary)
        this.setState({
          uid: user.uid,
        });
      }
    })
  }

  componentWillUnmount() {
    if (this.state.isConnected) {
    // stop listening for changes in collection
    this.unsubscribe();
    // stop listening to authentication
    this.authUnsubscribe();
    }
  }

  //Set color of message bubble
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  //Only render default inputToolbar when online
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  render() {
    let color=this.props.route.params.color;
    let name = this.props.route.params.name;
    return (
      <View style={[{flex: 1}, {backgroundColor: color}]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            avatar: 'https://placeimg.com/140/140/any',
            name: name,
          }}
          accessible={true}
          accessibilityLabel='Chat input field'
          accessibilityHint='Here you can enter the message. After entering the message, you can press send on the right.'
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}
