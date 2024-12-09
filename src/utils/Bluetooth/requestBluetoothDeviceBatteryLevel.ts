import {characteristic_UUID, notify_UUID, service_UUID} from '../../data/uuids';
import {BLEService} from '../../services/BLEService';
import changeFromCharToDecimal from '../common/changeFromCharToDecimal';
import decodeFromBufferToBase64 from '../common/decodeFromBufferToBase64';
import encodeFromBufferToBase64 from '../common/encodeFromBufferToBase64';
import checkBluetoothDeviceConnection from './checkBluetoothDeviceConnection';

// 배터리 측정 요청을 보내는 함수
const requestBluetoothDeviceBatteryLevel = async (
  deviceID: string,
  battery: string,
  openModal: () => void,
  setBatteryLevel: (value: React.SetStateAction<number | null>) => void,
) => {
  try {
    if (!deviceID) {
      console.log('연결된 기기 x');
      return;
    }

    // 연결 상태 확인 및 재연결
    await checkBluetoothDeviceConnection(deviceID).catch(() => {
      return openModal();
    });

    // 서비스 및 특성 검색
    await BLEService.manager.discoverAllServicesAndCharacteristicsForDevice(
      deviceID,
    );

    // 배터리 요청 데이터 생성 (기기 문서를 참조해 데이터 형식 확인 필요)
    const base64Data = encodeFromBufferToBase64(battery); // 요청 데이터 변경 필요

    // 배터리 요청 전송
    await BLEService.manager.writeCharacteristicWithResponseForDevice(
      deviceID,
      service_UUID, // 배터리 서비스 UUID
      characteristic_UUID, // 배터리 요청 특성 UUID
      base64Data,
    );

    // 배터리 응답 모니터링
    BLEService.manager.monitorCharacteristicForDevice(
      deviceID,
      service_UUID, // 배터리 Notify 서비스 UUID
      notify_UUID, // 배터리 Notify 특성 UUID
      (error, characteristic) => {
        if (error) {
          console.log('연결 오류: ', error);
          openModal();
          return;
        }

        if (characteristic?.value) {
          const decodedValue = decodeFromBufferToBase64(characteristic.value);
          const targetCharValue = decodedValue[3];
          const decimalValue = changeFromCharToDecimal(targetCharValue);
          console.log(`배터리 상태 값: ${decimalValue}`);
          setBatteryLevel(decimalValue);
        }
      },
    );
  } catch (error) {
    console.log('연결 오류: ', error);
  }
};

export default requestBluetoothDeviceBatteryLevel;
