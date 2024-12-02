import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {Device} from 'react-native-ble-plx';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import connectBluetoothDevice from './connectBluetoothDevice';
import startBluetoothDeviceScan from './startBluetoothDeviceScan';

const scanBluetoothDevice = async (
  devices: Device[],
  isScanning: boolean,
  isScanComplete: boolean,
  isConnecting: boolean,
  connectionStatus: 'success' | 'fail' | null,
  connectedDeviceId: string | null,
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>,
  navigation: NativeStackNavigationProp<ROOT_NAVIGATION, 'ScanDevice'>,
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>,
  setIsConnecting: React.Dispatch<React.SetStateAction<boolean>>,
  setIsScanning: React.Dispatch<React.SetStateAction<boolean>>,
  setConnectionStatus: (
    value: React.SetStateAction<'success' | 'fail' | null>,
  ) => void,
  setConnectedDeviceId: (value: React.SetStateAction<string | null>) => void,
  setIsScanComplete: (value: React.SetStateAction<boolean>) => void,
) => {
  if (isScanComplete && !isConnecting) {
    if (connectionStatus === 'success' && connectedDeviceId) {
      // 연결 성공 시 상세 화면으로 이동
      bottomSheetModalRef.current?.close();
      navigation.navigate('ControlDevice', {deviceID: connectedDeviceId});
    } else if (connectionStatus === 'fail') {
      // 연결 실패 시 다시 연결 시도
      console.log('연결 재시도 중...');
      setConnectionStatus(null); // 연결 상태 초기화
      setIsScanComplete(false); // 스캔 완료 상태 초기화
      setConnectedDeviceId(null); // 연결된 기기 초기화
      startBluetoothDeviceScan(isScanning, setIsScanning, setDevices);

      // 3초 후 스캔 상태로 전환
      setTimeout(() => {
        setIsScanComplete(true);
      }, 3000);
    } else if (isScanComplete && !connectionStatus) {
      // 스캔 완료 후 연결 시도
      console.log('처음 연결 시도 중...');
      await connectBluetoothDevice(
        devices,
        setConnectionStatus,
        setIsConnecting,
        setConnectedDeviceId,
      );
    } else {
      console.log('아직 준비가 완료되지 않았습니다.');
    }
  } else {
    console.log('스캔 중이거나 연결 중입니다.');
  }
};

export default scanBluetoothDevice;
