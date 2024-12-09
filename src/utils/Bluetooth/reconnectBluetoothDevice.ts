import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import {BLEService} from '../../services/BLEService';

// 블루투스 재연결 하는 함수
const reconnnectBluetoothDevice = async (
  deviceID: string,
  closeModal: () => void,
  navigation: NativeStackNavigationProp<ROOT_NAVIGATION, 'ScanDevice'>,
) => {
  await BLEService.manager
    .cancelDeviceConnection(deviceID)
    .then(() => {
      console.log('재연결 성공');
      closeModal();
      navigation.navigate('ScanDevice');
    })
    .catch(error => {
      console.log('재연결 실패 및 오류: ', error);
      closeModal();
      navigation.navigate('ScanDevice');
    });
};

export default reconnnectBluetoothDevice;
