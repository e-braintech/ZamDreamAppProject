# 잠드림

어플리케이션과 스마트 에어 베개 간 Bluetooth 기능을 통해 통신하는 BLE 프로젝트 입니다.

# 목차

- [프로젝트 구성도](#프로젝트-구성도)
- [프로젝트 기술](#프로젝트-기술)
- [프로젝트 실행 방법](#프로젝트-실행-방법)

## 프로젝트 구성도

![프로젝트 구성도](https://github.com/user-attachments/assets/ac2c129a-8440-439a-b010-ad73059ac5d6)

## 프로젝트 기술

- React Native CLI
- TypeScript
- [React Navigation](https://reactnavigation.org/)
  - [Stack](https://reactnavigation.org/docs/stack-navigator/)
  - [Bottom-Tab](https://reactnavigation.org/docs/bottom-tab-navigator/)
- BLE
  - [react-native-ble-plx](https://github.com/dotintent/react-native-ble-plx)
  - [react-native-ble-manager](https://github.com/innoveit/react-native-ble-manager)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- [react-native-permissions](https://github.com/zoontek/react-native-permissions)

## 프로젝트 실행 방법

### 공통

메트로(Metro) 서버를 실행합니다.

> npm start

### 1. 앱 빌드 하는 방법(Simulator, Amulator 에서 빌드했을 때)

#### Android

Android 앱 빌드를 시행합니다.

> npm run android

#### iOS

iOS 앱 빌드를 시행합니다.

> npm run ios

### 2. 앱 빌드 하는 방법(실기기에서 빌드했을 때)

#### Android

1. 맥북과 안드로이드 기기를 연결합니다.
2. 터미널에서 기기 리스트를 출력하는 명령어를 입력합니다.

   > adb devices

3. 출력된 기기 리스트에서 연결한 안드로이드 기기가 발견된다면 기기 연결 시행하는 명령어를 입력합니다.

   > adb reverse tcp:8081 tcp:8081

4. 다시 터미널에 Android 앱 빌드를 시행하는 명령어를 입력합니다.

   > npm run android

#### iOS

1. 맥북과 아이폰 기기를 연결합니다.
2. Xcode 프로그램을 실행하여 연결된 아이폰을 선택합니다.
3. Xcode 프로그램의 설정 창에 들어가서 개발자 계정을 등록합니다.
4. 다시 터미널에 iOS 앱 빌드를 시행하는 명령어를 입력합니다.

   > npm run ios
