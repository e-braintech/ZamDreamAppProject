import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {Device} from 'react-native-ble-plx';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import BluetoothConnectBottomSheet from '../components/BottomSheet/BluetoothConnectBottomSheet';
import BottomSheetBackdropHandler from '../components/BottomSheet/BottomSheetBackdropHandler';
import BluetoothConnectModal from '../components/Modal/BluetoothConnectModal';
import useBluetoothState from '../hooks/useBluetoothState';
import {useBottomSheetBackHandler} from '../hooks/useBottomSheetBackHandler';
import useModal from '../hooks/useModal';
import {startDeviceScan} from '../services';
import {BLEService} from '../services/BLEService';

type Props = NativeStackScreenProps<ROOT_NAVIGATION, 'ScanDevice'>;

const ScanDeviceScreen = ({navigation}: Props) => {
  // Logic
  const source =
    Platform.OS === 'ios'
      ? require('../assets/images/intro_ios.png')
      : require('../assets/images/intro_android.png');

  const [devices, setDevices] = useState<Device[]>([]); // BLE 기기 저장
  const [isScanning, setIsScanning] = useState(false); // 스캔 상태

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['85%'], []);

  const {isModalVisible, openModal, closeModal} = useModal();

  const {bluetoothState, appState} = useBluetoothState();

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
      openModal();
    }
  };

  useEffect(() => {
    if (bluetoothState === 'off') {
      console.log('Bluetooth is off. Please enable Bluetooth.');
    } else if (bluetoothState === 'on') {
      console.log('Bluetooth is on and ready.');
    }

    console.log('Current app state:', appState);
  }, [bluetoothState, appState]);

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
        <BluetoothConnectModal visible={isModalVisible} onClose={closeModal} />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default ScanDeviceScreen;
