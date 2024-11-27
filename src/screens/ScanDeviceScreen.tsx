import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  AppState,
  AppStateStatus,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {Device, State} from 'react-native-ble-plx';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import BluetoothConnectBottomSheet from '../components/BottomSheet/BluetoothConnectBottomSheet';
import BottomSheetBackdropHandler from '../components/BottomSheet/BottomSheetBackdropHandler';
import BluetoothConnectModal from '../components/Modal/BluetoothConnectModal';
import {useBottomSheetBackHandler} from '../hooks/useBottomSheetBackHandler';
import {handleAppStateChange, startDeviceScan} from '../services';
import {BLEService} from '../services/BLEService';

type Props = NativeStackScreenProps<ROOT_NAVIGATION, 'ScanDevice'>;

const ScanDeviceScreen = ({navigation}: Props) => {
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

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const {handleSheetPositionChange} =
    useBottomSheetBackHandler(bottomSheetModalRef);

  // Bluetooth 상태 확인 및 Modal or BottomSheet 동작 처리
  const handleBluetoothState = async () => {
    const state = await BLEService.manager.state();
    if (state === 'PoweredOn') {
      // Bluetooth가 켜져 있을 경우 BottomSheet 표시
      bottomSheetModalRef.current?.present();
      startDeviceScan(isScanning, setIsScanning, setDevices);
    } else {
      // Bluetooth가 꺼져 있을 경우 Modal 표시
      setIsModalVisible(true);
    }
  };

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
      nextAppState => {
        handleAppStateChange(
          appState,
          nextAppState,
          setAppState,
          setBluetoothState,
        );
      },
    );

    return () => {
      subscription.remove(); // 컴포넌트 언마운트 시 상태 변경 감지 이벤트 해제
      appStateSubscription.remove(); // 앱 상태 감지 해제
    };
  }, []);

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
        <ImageBackground
          source={source}
          style={{
            flex: 1,
            justifyContent: 'space-between',
            paddingHorizontal: 32,
          }}>
          <LottieView
            source={require('../assets/lottie/BI.json')}
            style={{
              width: Platform.OS === 'ios' ? 240 : 216,
              height: Platform.OS === 'ios' ? 156 : 140,
              marginTop: Platform.OS === 'ios' ? 100 : 120,
            }}
            autoPlay={true}
            loop={false}
          />

          <View style={{marginBottom: 50}}>
            <Pressable
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 16,
                backgroundColor: '#FBFBFF',
                borderRadius: 30,
              }}
              onPress={handleBluetoothState}>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', color: '#240843'}}>
                시작하기
              </Text>
            </Pressable>
          </View>

          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={BottomSheetBackdropHandler}
            onChange={handleSheetPositionChange}
            handleStyle={{backgroundColor: '#F3F1FF', borderRadius: 50}}
            handleIndicatorStyle={{
              width: 100,
              height: 5,
              marginTop: 10,
              backgroundColor: '#C7C7E8',
            }}>
            <BottomSheetView style={{flex: 1}}>
              <BluetoothConnectBottomSheet
                navigation={navigation}
                devices={devices}
                bottomSheetModalRef={bottomSheetModalRef}
              />
            </BottomSheetView>
          </BottomSheetModal>
        </ImageBackground>
        <BluetoothConnectModal
          visible={isModalVisible}
          onClose={handleCloseModal}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default ScanDeviceScreen;
