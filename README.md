# How to run

To run this, you need to Cancel changes
- clone this repo
- Update publicKey and privateKey in src/api/marvelApi file with your accoutn keys
- run command 'npm install'


iOS:
- run command 'cd ios && pod install'
- run command 'npx react-native run-ios' OR open GithubApiDemo.xcworkspace in XCode and run

Android:
- run command 'npx react-native run-android'

Note: 
Depending on setup one might face issue of not loading js bundle and so need to manually run by 
'npx react-native start' which will start a metro bundler required for in development phase

