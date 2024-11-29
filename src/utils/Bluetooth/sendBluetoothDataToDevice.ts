import {characteristic_UUID, service_UUID} from '../../data/uuids';
import {BLEService} from '../../services/BLEService';
import {encodeToBase64} from '../common';

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
    const base64Data = encodeToBase64(data);

    if (!deviceID) {
      console.log('No connected device found');
      openModal();
      return;
    }

    // 연결 상태 확인
    const isConnected = await BLEService.manager.isDeviceConnected(deviceID);
    if (!isConnected) {
      console.log('Device is not connected. Reconnecting...');
      await BLEService.manager.connectToDevice(deviceID).catch(() => {
        openModal();
        return;
      });
    }

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
