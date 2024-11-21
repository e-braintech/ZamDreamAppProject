import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {AppStateStatus} from 'react-native';
import {Device, State} from 'react-native-ble-plx';
import {BLEService} from './BLEService';

// Bluetooth 상태 확인 및 Modal or BottomSheet 동작 처리
export const handleBluetoothState = async (
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>,
  isScanning: boolean,
  setIsScanning: React.Dispatch<React.SetStateAction<boolean>>,
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>,
  setIsModalVisible: (value: React.SetStateAction<boolean>) => void,
) => {
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

// 앱 상태가 변경될 때 호출되는 함수
export const handleAppStateChange = (
  appState: AppStateStatus,
  nextAppState: AppStateStatus,
  setAppState: React.Dispatch<React.SetStateAction<AppStateStatus>>,
  setBluetoothState: React.Dispatch<React.SetStateAction<string | null>>,
) => {
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

// 블루투스 장치 스캔 함수 (3초 후 스캔 중지)
export const startDeviceScan = (
  isScanning: boolean,
  setIsScanning: React.Dispatch<React.SetStateAction<boolean>>,
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>,
) => {
  if (isScanning) return; // 이미 스캔 중이면 중복 실행 방지
  setIsScanning(true);
  setDevices([]); // 기존 기기 목록 초기화

  BLEService.scanDevices(device => {
    if (device.name) {
      //   console.log(device.name);
      setDevices(prevDevices => {
        const exists = prevDevices.some(d => d.id === device.id);
        if (!exists) {
          return [...prevDevices, device];
        }
        return prevDevices;
      });
    }
  });

  setTimeout(() => {
    BLEService.manager.stopDeviceScan();
    setIsScanning(false);
  }, 3000); // 3초 후 스캔 종료
};
