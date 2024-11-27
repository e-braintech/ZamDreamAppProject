import {Device} from 'react-native-ble-plx';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import {BLEService} from './BLEService';

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
    console.log('연결 중 오류:', error);
    setConnectionStatus('fail'); // 연결 실패 상태로 설정
  } finally {
    setIsConnecting(false);
  }
};

// 기기의 연결 상태를 확인하고, 연결이 끊어진 경우 재연결을 시도하는 함수
export const checkDeviceConnection = async (deviceID: string) => {
  const isConnected = await BLEService.manager.isDeviceConnected(deviceID);
  if (!isConnected) {
    console.log('Device is not connected. Attempting to reconnect...');
    await BLEService.manager.connectToDevice(deviceID);
    await discoverServicesAndCharacteristics(deviceID);
  }
};

// 기기의 모든 서비스 및 특성을 검색하고, 검색된 정보를 로그로 출력하는 함수
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
    console.log('Failed to discover services and characteristics:', error);
  }
};

export const resetAndNavigateToScanScreen = (
  deviceID: string,
  navigation: NativeStackNavigationProp<ROOT_NAVIGATION, 'ScanDevice'>,
) => {
  BLEService.manager.cancelDeviceConnection(deviceID).catch(error => {
    console.log('Failed to reset connection:', error);
  });

  navigation.navigate('ScanDevice');
};
