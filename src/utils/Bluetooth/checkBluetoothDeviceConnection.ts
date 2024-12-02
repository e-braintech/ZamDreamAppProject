import {BLEService} from '../../services/BLEService';
import discoverBlueToothDeviceServicesAndCharacteristics from './discoverBlueToothDeviceServicesAndCharacteristics';

// 기기의 연결 상태를 확인하고, 연결이 끊어진 경우 재연결을 시도하는 함수
const checkBluetoothDeviceConnection = async (deviceID: string) => {
  const isConnected = await BLEService.manager.isDeviceConnected(deviceID);
  if (!isConnected) {
    console.log('Device is not connected. Attempting to reconnect...');
    await BLEService.manager.connectToDevice(deviceID).then(async () => {
      await discoverBlueToothDeviceServicesAndCharacteristics(deviceID);
    });
  }
};

export default checkBluetoothDeviceConnection;
