import aromaStep from '../../data/aromaStep';
import {characteristic_UUID, service_UUID} from '../../data/uuids';
import {BLEService} from '../../services/BLEService';
import encodeFromBufferToBase64 from '../common/encodeFromBufferToBase64';
import checkBluetoothDeviceConnection from './checkBluetoothDeviceConnection';

// 방향 종료 시키는 함수
const requestBluetoothDeviceFanTurnOff = async (
  deviceID: string,
  openModal: () => void,
) => {
  const data = encodeFromBufferToBase64(aromaStep.turn_off);

  try {
    if (!deviceID) {
      console.log('연결된 기기 x');
      return;
    }

    // 연결 상태 확인 및 재연결
    await checkBluetoothDeviceConnection(deviceID).catch(() => {
      return openModal();
    });

    await BLEService.manager.writeCharacteristicWithResponseForDevice(
      deviceID,
      service_UUID,
      characteristic_UUID,
      data,
    );
  } catch (error) {
    console.log('연결 오류: ', error);
  }
};

export default requestBluetoothDeviceFanTurnOff;
