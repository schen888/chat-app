import React from 'react';
import { View, Text, Button, TextInput,StyleSheet, ImageBackground, TouchableOpacity, Image, Dimensions } from 'react-native';

const backgroundColors = {
  black: '#090C08',
  purple: '#474056',
  grey: '#8A95A5',
  green: '#B9C6AE',
};

export default class Start extends React.Component {
  constructor(props) {
    super (props);
    this.state={name: '', color:''}
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/background-image.png')}
          style={styles.image}
        >
          <Text style={styles.title}>Chat App</Text>
          <View style={styles.startWrapper}>
            <View style={styles.inputWrapper}>
              <Image style={styles.icon} source={require('../assets/icon.svg')}/>
              <TextInput
                style={styles.input}
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
                placeholder="Your Name"
              />
            </View>
            <View style={styles.colorWrapper}>
              <Text style={styles.colorText}>Choose Background Color:</Text>
              <View style={styles.colors}>
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.black },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.black })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.purple },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.purple })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.grey },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.grey })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.green },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.green })
                  }
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                this.props.navigation.navigate('Chat', {
                  name: this.state.name,
                  color: this.state.color,
                })
              }
              accessible={true}
              accessibilityLabel='Start chatting'
              accessibilityHint='Enter the chat room, where you can send messages to your contacts.'
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    resizeMode: 'cover',
    paddingVertical: '6%',
  },

  title: {
    flex:1,
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingTop: '10%',
    paddingBottom: 0,
    marginBottom: 0,
  },

  startWrapper: {
    flex: 2,
    backgroundColor: 'white',
    maxHeight: '60%',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //paddingVertical: '6%',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'lightgrey',
    opacity: 50,
    height: 60,
    width: '88%',
    borderColor: 'lightgrey',
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 5,
  },

  icon: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
  },

  input: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    height: 60,
    borderColor: 'rgba(0,0,0,0)',
    borderWidth: 2,
    borderRadius: 5,
    //elevation: 2,
    position: 'absolute',
    left: -2,
    paddingLeft: 35,
    paddingRight: 20,
    width: '101%'
  },

  colorWrapper: {
    width: '88%',
    justifyContent: 'center',
  },

  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
  },

  colors: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  color: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginTop: '4%',
    marginRight: 25,
  },

  button: {
    height: 60,
    width: '88%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#757083',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});