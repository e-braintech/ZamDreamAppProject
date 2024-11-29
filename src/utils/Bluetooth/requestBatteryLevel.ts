import {characteristic_UUID, notify_UUID, service_UUID} from '../../data/uuids';
import {BLEService} from '../../services/BLEService';
import {charToDecimal, decodeFromBase64, encodeToBase64} from '../common';

// 배터리 측정 요청을 보내는 함수
const requestBatteryLevel = async (
  deviceID: string,
  battery: string,
  openModal: () => void,
  setBatteryLevel: (value: React.SetStateAction<number | null>) => void,
) => {
  try {
    if (!deviceID) {
      console.log('No connected device found');
      return;
    }

    // 연결 상태 확인 및 재연결
    const isConnected = await BLEService.manager.isDeviceConnected(deviceID);
    if (!isConnected) {
      console.log('Device is not connected. Reconnecting...');
      await BLEService.manager.connectToDevice(deviceID).catch(() => {
        openModal();
        return;
      });
    }

    // 서비스 및 특성 검색
    await BLEService.manager.discoverAllServicesAndCharacteristicsForDevice(
      deviceID,
    );

    // 배터리 요청 데이터 생성 (기기 문서를 참조해 데이터 형식 확인 필요)
    const base64Data = encodeToBase64(battery); // 요청 데이터 변경 필요

    // 배터리 요청 전송
    await BLEService.manager.writeCharacteristicWithResponseForDevice(
      deviceID,
      service_UUID, // 배터리 서비스 UUID
      characteristic_UUID, // 배터리 요청 특성 UUID
      base64Data,
    );

    console.log('Battery level request sent.');

    // 배터리 응답 모니터링
    BLEService.manager.monitorCharacteristicForDevice(
      deviceID,
      service_UUID, // 배터리 Notify 서비스 UUID
      notify_UUID, // 배터리 Notify 특성 UUID
      (error, characteristic) => {
        if (error) {
          console.log('Failed to monitor characteristic:', error);
          openModal();
          return;
        }

        if (characteristic?.value) {
          console.log(characteristic.value);
          const decodedValue = decodeFromBase64(characteristic.value);
          const targetCharValue = decodedValue[3];
          const decimalValue = charToDecimal(targetCharValue);
          console.log(`Battery Data: ${decimalValue}`);
          setBatteryLevel(decimalValue);
        }
      },
    );
  } catch (error) {
    console.log('Failed to request battery level:', error);
  }
};

export default requestBatteryLevel;
