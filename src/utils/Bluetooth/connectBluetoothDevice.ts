import {Device} from 'react-native-ble-plx';
import {BLEService} from '../../services/BLEService';

// "ZAMDREAM" 기기와 연결하는 함수
const connectBluetoothDevice = async (
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
    console.log('연결 오류: ', error);
    setConnectionStatus('fail'); // 연결 실패 상태로 설정
  } finally {
    setIsConnecting(false);
  }
};

export default connectBluetoothDevice;
