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
  try {
    const base64Data = encodeFromBufferToBase64(data);

    if (!deviceID) {
      console.log('연결된 기기 x');
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
      .then(() => {
        console.log(`${part} 부위 전송값: ${stepLevel}`);
      })
      .catch(error => {
        console.log('데이터 전송 실패: ', error);
        return;
      });
  } catch (error) {
    console.log('연결 오류: ', error);
  }
};

export default sendBluetoothDataToDevice;
