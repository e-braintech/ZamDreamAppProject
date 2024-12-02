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
      console.log('No connected device found');
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

    console.log('Smell turn off value sent to server');
  } catch (error) {
    console.log('Failed to send smell turn off value:', error);
  }
};

export default requestBluetoothDeviceFanTurnOff;
