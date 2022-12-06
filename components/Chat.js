import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import firebase from 'firebase';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
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
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

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

  componentDidMount(){
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    //connect to messages collection
    this.referenceShoppingLists = firebase.firestore().collection('messages');

    this.setState({
      messages: [
        {
          _id: 1,
          text: 'You have entered the chat.',
          createdAt: new Date(),
          system: true,
         },

        {
          _id: 2,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })

  }

  render() {
    let color=this.props.route.params.color;
    return (
      <View style={[{flex: 1}, {backgroundColor: color}]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
          _id: 1
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

/* const styles= StyleSheet.create({
  container: {
    flex:1
  }
}); */