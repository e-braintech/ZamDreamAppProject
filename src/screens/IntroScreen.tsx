import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import IntroLottie from '../components/animation/IntroLottie';
import BluetoothModal from '../components/BluetoothModal';
import ConfirmButton from '../components/ConfirmButton';
import {useBottomSheetBackHandler} from '../hooks/useBottomSheetBackHandler';

type Props = NativeStackScreenProps<ROOT_NAVIGATION, 'Intro'>;

// 권한 설정 확인하는 함수
export async function requestPermissions(
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
) {
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
      checkBluetoothState(setIsModalVisible);
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
      checkBluetoothState(setIsModalVisible);
    } else {
      console.log('Android 권한 거부됨');
    }
  }
}

// 블루투스 상태 확인 함수
async function checkBluetoothState(
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const bleManager = new BleManager();
  const state = await bleManager.state(); // BLE 상태 가져오기

  if (state !== 'PoweredOn') {
    console.log('블루투스가 꺼져 있습니다.');
    setIsModalVisible(true); // 모달 표시
  } else {
    console.log('블루투스가 켜져 있습니다.');
    setIsModalVisible(false);
  }
}

const IntroScreen = ({navigation}: Props) => {
  // Logic
  const source =
    Platform.OS === 'ios'
      ? require('../assets/intro_ios.png')
      : require('../assets/intro_android.png');

  const [isModalVisible, setIsModalVisible] = useState(false); // Modal 상태

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['85%'], []);

  const {handleSheetPositionChange} =
    useBottomSheetBackHandler(bottomSheetModalRef);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} pressBehavior="close" />,
    [],
  );

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleRequestPermissions = async () => {
    await requestPermissions(setIsModalVisible);
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

          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            onChange={handleSheetPositionChange}>
            <BottomSheetView style={{flex: 1}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>test</Text>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </ImageBackground>
        <BluetoothModal visible={isModalVisible} onRequestClose={closeModal} />
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
