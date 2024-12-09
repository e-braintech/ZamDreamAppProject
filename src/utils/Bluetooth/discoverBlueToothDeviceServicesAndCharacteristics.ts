import {BLEService} from '../../services/BLEService';

// 기기의 모든 서비스 및 특성을 검색하고, 검색된 정보를 로그로 출력하는 함수
const discoverBlueToothDeviceServicesAndCharacteristics = async (
  deviceID: string,
) => {
  try {
    await BLEService.manager.discoverAllServicesAndCharacteristicsForDevice(
      deviceID,
    );

    const services = await BLEService.manager.servicesForDevice(deviceID);
    console.log('발견된 서비스: ', services);
  } catch (error) {
    console.log('services와 characteristics 탐색 오류:', error);
  }
};

export default discoverBlueToothDeviceServicesAndCharacteristics;
