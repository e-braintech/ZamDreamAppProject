import {AppStateStatus} from 'react-native';
import {Device, State} from 'react-native-ble-plx';
import {BLEService} from './BLEService';

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

// "ZAMDREAM" 기기와 연결하는 함수
export const connectToDevice = async (
  devices: Device[],
  setConnectionStatus: (
    value: React.SetStateAction<'fail' | 'success' | null>,
  ) => void,
  setIsConnecting: (value: React.SetStateAction<boolean>) => void,
  setConnectedDeviceID: (value: React.SetStateAction<string | null>) => void,
) => {
  const device = devices.find(device => device.name === 'ZAMDREAM');

  if (!device) {
    setConnectionStatus('fail'); // 기기를 찾을 수 없으면 실패 상태로 설정
    return;
  }

  try {
    setIsConnecting(true);
    await BLEService.connectToDevice(device.id);
    await BLEService.discoverAllServicesAndCharacteristicsForDevice();

    setConnectionStatus('success'); // 연결 성공 상태로 설정
    setConnectedDeviceID(device.id); // 연결된 기기의 ID 저장
  } catch (error) {
    console.error('연결 중 오류:', error);
    setConnectionStatus('fail'); // 연결 실패 상태로 설정
  } finally {
    setIsConnecting(false);
  }
};

export const checkDeviceConnection = async (deviceID: string) => {
  const isConnected = await BLEService.manager.isDeviceConnected(deviceID);
  if (!isConnected) {
    console.error('Device is not connected. Attempting to reconnect...');
    await BLEService.manager.connectToDevice(deviceID);
    await discoverServicesAndCharacteristics(deviceID);
  }
};

export const discoverServicesAndCharacteristics = async (deviceID: string) => {
  try {
    await BLEService.manager.discoverAllServicesAndCharacteristicsForDevice(
      deviceID,
    );

    const services = await BLEService.manager.servicesForDevice(deviceID);
    console.log('Discovered services:', services);

    for (const service of services) {
      const characteristics = await BLEService.manager.characteristicsForDevice(
        deviceID,
        service.uuid,
      );
      console.log(
        `Service ${service.uuid} has characteristics:`,
        characteristics,
      );
    }
  } catch (error) {
    console.error('Failed to discover services and characteristics:', error);
  }
};
