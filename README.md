## Chat APP:iphone:
A project uses React Native, Expo, and Google Firestore Database to build a native moblie chat app.

## Key Features
- A start screen where users can enter their name and choose a background color for the chat screen.
- Users can go to the chat screen from start screen.
- A chat screen displaying the conversation, as well as an input field and submit button.
- The chat provides users with two additional communication features: sending images (picking images from Handy's media libary or taking a photo directly through Handy's camera) and location data.
- Data gets stored online and offline.

## Technical Dependencies

JavaScript, React Native, Expo, GiftedChat, Firebase

## Setting up development environment:
- Clone the repository: `git clone https://github.com/schen888/chat-app.git`
- Install Expo CLI, run `npm install -g expo-cli`
- Install all project dependencies: `npm install`
- Create an Expo account at https://expo.dev/ and login at the terminal with `expo login`
- Install [Expo Go](https://expo.dev/client) from your Handy's PlayStore
- Start the project with `npx expo start`
- In case of problem while conneting to your project on Expo Go, run `npx expo start --tunnel`

## Setting up the real-time database:
- Head over to [Google Firebase](https://firebase.google.com/) and with your Google account credentials to sign in and create a new Firebase account
- Click on **Go to console** and click on **Create Project** (or **Add Project**)
- Create a project with default settings
- Under **Develop** from the menu, select **Cloud Firestore**, then select **Create Database** and choose **Start in test mode**
- Create a new collection named **messages**
- Under the :gear: sign, click on **Project Setting**, scroll down and click the**Firestore for Web** button (</>)
- `Register` your app to generate the configuration code.
- Replace the `const firebaseConfig` in `Components/Chat.js` with your config. code 
- In order to be able to send images, head over to **Storage** and click on **Get Started**. Keep everything as default settings.
- In the **Storage** dashboard under **Rules** tag, change `allow read, write: if false` to `true`

![A screenshot of the start view in chat-app](/img/Screenshot1.jpg)
![A screenshot of the chat view in chat-app](/img/Screenshot2.jpg)

<picture>
  <img alt="Shows an illustrated sun in light mode and a moon with stars in dark mode." src="/img/Screenshot2.jpg">
</picture>