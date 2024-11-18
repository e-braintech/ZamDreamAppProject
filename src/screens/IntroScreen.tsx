import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import React from 'react';
import {
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import IntroLottie from '../components/animation/IntroLottie';
import ConfirmButton from '../components/ConfirmButton';

type Props = NativeStackScreenProps<ROOT_NAVIGATION, 'Intro'>;

// 권한 설정 확인하는 함수
export async function requestPermissions() {
  if (Platform.OS === 'ios') {
    // iOS에서 요청할 권한 목록을 배열에 추가
    const permissions = [
      PERMISSIONS.IOS.BLUETOOTH,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ];

    // requestMultiple을 사용하여 권한 요청
    const statuses = await requestMultiple(permissions);

    // 각 권한의 요청 결과를 확인
    if (
      statuses[PERMISSIONS.IOS.BLUETOOTH] === RESULTS.GRANTED &&
      statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED
    ) {
      console.log('iOS BLE 및 위치 권한 허용됨');
    } else {
      console.log('iOS 권한 거부됨');
    }
  } else if (Platform.OS === 'android') {
    // Android에서 요청할 권한 목록을 배열에 추가
    const permissions = [
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ];

    // requestMultiple을 사용하여 권한 요청
    const statuses = await requestMultiple(permissions);

    // 각 권한의 요청 결과를 확인
    if (
      statuses[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] === RESULTS.GRANTED &&
      statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] === RESULTS.GRANTED &&
      statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED
    ) {
      console.log('Android BLE 및 위치 권한 허용됨');
    } else {
      console.log('Android 권한 거부됨');
    }
  }
}

const IntroScreen = ({navigation}: Props) => {
  // Logic
  const source =
    Platform.OS === 'ios'
      ? require('../assets/intro_ios.png')
      : require('../assets/intro_android.png');

  const handleRequestPermissions = async () => {
    await requestPermissions();
  };

  // View
  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={source}
          resizeMode="cover"
          style={styles.imageContainer}>
          <IntroLottie lottieStyle={styles.lottie} />
          <View style={styles.buttonContainer}>
            <ConfirmButton
              title="시작하기"
              buttonStyle={styles.button}
              textStyle={styles.buttonText}
              onSubmit={handleRequestPermissions}
            />
          </View>
        </ImageBackground>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
  },
  lottie: {
    width: '80%',
    height: '30%',
    marginTop: 100,
  },
  buttonContainer: {
    marginBottom: 50,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 30,
  },
  buttonText: {
    color: '#240843',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IntroScreen;
