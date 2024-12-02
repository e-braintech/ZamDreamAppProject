import {characteristic_UUID, service_UUID} from '../../data/uuids';
import {BLEService} from '../../services/BLEService';
import encodeFromBufferToBase64 from '../common/encodeFromBufferToBase64';
import checkBluetoothDeviceConnection from './checkBluetoothDeviceConnection';

// 기기 높낮이 초기값 전송 함수
const sendBluetoothDataToDevice = async (
  data: string,
  stepLevel: number,
  deviceID: string,
  openModal: () => void,
  part?: string,
) => {
  console.log(data);

  try {
    const base64Data = encodeFromBufferToBase64(data);

    if (!deviceID) {
      console.log('No connected device found');
      openModal();
      return;
    }

    // 연결 상태 확인
    await checkBluetoothDeviceConnection(deviceID).catch(() => {
      return openModal();
    });

    BLEService.manager
      .writeCharacteristicWithResponseForDevice(
        deviceID,
        service_UUID,
        characteristic_UUID,
        base64Data,
      )
      .then(res => {
        console.log(`Data sent successfully for ${part} at level ${stepLevel}`);
      })
      .catch(err => {
        return;
      });
  } catch (error) {
    console.log('Failed to send data:', error);
  }
};

export default sendBluetoothDataToDevice;
