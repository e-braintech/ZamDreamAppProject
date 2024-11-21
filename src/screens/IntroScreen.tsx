import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  AppState,
  AppStateStatus,
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {Device, State} from 'react-native-ble-plx';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import IntroLottie from '../components/animation/IntroLottie';
import BluetoothModal from '../components/BluetoothModal';
import BottomSheetBluetoothConnectView from '../components/BottomSheetBluetoothConnectView';
import ConfirmButton from '../components/ConfirmButton';
import {useBottomSheetBackHandler} from '../hooks/useBottomSheetBackHandler';
import {BLEService} from '../services/BLEService';

type Props = NativeStackScreenProps<ROOT_NAVIGATION, 'Intro'>;

const IntroScreen = ({navigation}: Props) => {
  // Logic
  const source =
    Platform.OS === 'ios'
      ? require('../assets/intro_ios.png')
      : require('../assets/intro_android.png');

  const [bluetoothState, setBluetoothState] = useState<string | null>(null); // 블루투스 활성화 여부를 감지하는 상태
  const [isModalVisible, setIsModalVisible] = useState(false); // BluetoothModal 상태
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  ); // 앱 상태 저장
  const [devices, setDevices] = useState<Device[]>([]); // BLE 기기 저장
  const [isScanning, setIsScanning] = useState(false); // 스캔 상태

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['85%'], []);

  useEffect(() => {
    // 블루투스 상태 확인 및 상태 변경 감지
    const subscription = BLEService.manager.onStateChange(state => {
      if (state === State.PoweredOn) {
        setBluetoothState('on');
      } else if (state === State.PoweredOff) {
        setBluetoothState('off');
      } else {
        setBluetoothState(state);
      }
    }, true);

    // AppState를 통해 앱 상태 변경 감지
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove(); // 컴포넌트 언마운트 시 상태 변경 감지 이벤트 해제
      appStateSubscription.remove(); // 앱 상태 감지 해제
    };
  }, []);

  // Android BottomSheet 백 핸들러 이벤트
  const {handleSheetPositionChange} =
    useBottomSheetBackHandler(bottomSheetModalRef);

  // BottomSheet present 모드 일 때, BackScreen 터치 시 BottomSheet close 변경 이벤트
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} pressBehavior="close" />,
    [],
  );

  // Modal 닫는 이벤트
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Bluetooth 상태 확인 및 Modal or BottomSheet 동작 처리
  const handleBluetoothState = async () => {
    const state = await BLEService.manager.state();
    if (state === 'PoweredOn') {
      // Bluetooth가 켜져 있을 경우 BottomSheet 표시
      bottomSheetModalRef.current?.present();
      startDeviceScan();
    } else {
      // Bluetooth가 꺼져 있을 경우 Modal 표시
      setIsModalVisible(true);
    }
  };

  // 앱 상태가 변경될 때 호출되는 함수
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    console.log('Current app state: ', nextAppState); // 현재 상태 로그 출력

    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground');
      BLEService.manager.state().then(bluetoothState => {
        if (bluetoothState === State.PoweredOn) {
          console.log('Bluetooth is powered on');
        } else {
          console.log('Bluetooth is not powered on');
          setBluetoothState('off');
        }
      });
    }
    setAppState(nextAppState); // 상태 업데이트
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
              onSubmit={handleBluetoothState}
            />
          </View>

          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            onChange={handleSheetPositionChange}
            handleStyle={{backgroundColor: '#F3F1FF', borderRadius: 50}}>
            <BottomSheetView style={{flex: 1}}>
              <BottomSheetBluetoothConnectView
                navigation={navigation}
                devices={devices}
                bottomSheetModalRef={bottomSheetModalRef}
              />
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
