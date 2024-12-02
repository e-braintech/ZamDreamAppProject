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
    console.log('Discovered services:', services);

    for (const service of services) {
      const characteristics = await BLEService.manager.characteristicsForDevice(
        deviceID,
        service.uuid,
      );
      console.log(
        `Service ${service.uuid} has characteristics:`,
        characteristics,
      );
    }
  } catch (error) {
    console.log('Failed to discover services and characteristics:', error);
  }
};

export default discoverBlueToothDeviceServicesAndCharacteristics;
