
# Sakuga Mobile

Sakuga usually refers to a remarkably higher quality animation sequence used to highlight a particularly important scene. Sakuga Mobile helps the sakuga community and artists who work on these scenes by adding some features to the sakugabooru experience like view and comment sakuga on mobile, frames count in real-time, frames step, trim the segment you want to get the frames images (or GIF), autoplay previews and more!


## Screenshots

<div style="display:flex;flex-direction:row;" >
  <img src="https://raw.githubusercontent.com/Bryancm/sakuga_mobile/main/assets/images/screenshot_1.png" width="260" height="589" />
  <img src="https://raw.githubusercontent.com/Bryancm/sakuga_mobile/main/assets/images/screenshot_2.png" width="260" height="589" />
  <img src="https://raw.githubusercontent.com/Bryancm/sakuga_mobile/main/assets/images/screenshot_3.png" width="260" height="589" />
  <img src="https://raw.githubusercontent.com/Bryancm/sakuga_mobile/main/assets/images/screenshot_4.png" width="260" height="589" /> 
</div>

  
## Tech Stack

- [React Native](https://reactnative.dev)
- [UI Kitten](https://akveo.github.io/react-native-ui-kitten/)
- [React Native Ffmpeg](https://github.com/tanersener/react-native-ffmpeg)
- [React Native Video](https://github.com/react-native-video/react-native-video)
- [React Native Video Proccessing](https://github.com/shahen94/react-native-video-processing)
- [React Navigation](https://reactnavigation.org)
- [Sakugabooru API](https://www.sakugabooru.com/help/api)


  
## Folder Structure

    ├── __tests__               # Test folder (TO DO)
    ├── android                 # Native android project (you can use android studio to open it)
    ├── api                     # Sakugabooru API Calls
    ├── assets                  # Fonts and images
    ├── components              # UI Components (All are functional components)
    ├── ios                     # Native iOS project (you can use xcode to open the workspace)
    ├── navigation              # App Navigator (React navigation)
    ├── screens                 # Main screens that the app navigator uses (also are functional components)
    ├── util                    # Some util like date and storage functions
    ├── App.js                  # Main App file
    ├── custom-theme.json       # Color theme
    ├── mapping.json            # Custom fonts
    ├── package.json            # Dependencies, scripts and project details
    ├── react-native.config.js  # Config dependencies
    └── README.md

  
## Installation

- iOS
```bash  //iOS
  yarn // install dependencies  
  cd ios
  pod install
  cd ..
  yarn ios // run on ios
```
For iOS [React Native Video Proccessing](https://github.com/shahen94/react-native-video-processing) has to be installed manually please follow the official installation instructions.
- Android
Until I finished the iOS version I notice that React Native Video Proccessing doesn't work properly on android so I decided to remove it and put a new solution for video trim (a slider) but because of this I still need to refactor some code before doing the merge (it is a roadmap activity). In the meantime you can use the android branch to run it on android.
```bash  //iOS
//swicth to android branch

 yarn // install dependencies  
 yarn android // run on android
```


    
## Roadmap

- Refactor code for video trim
- User can edit post
- User can create post
- User can customize the explore section
- User can view post previews when small layout is active
- Add Picture in Picture


  
## Support

For support, email me bryan.mtzs@gmail.com or send me a message on twitter [@bryanmtzw](https://twitter.com/bryanmtzw)

  
## Contributing

Contributions are always welcome!

Please don't hesitate to do a fork and a pull request. You can also send me a message on Twitter.
  
