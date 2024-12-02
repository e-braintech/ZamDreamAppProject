import {Device} from 'react-native-ble-plx';
import {BLEService} from '../../services/BLEService';

// 블루투스 장치 스캔 함수
const startBluetoothDeviceScan = async (
  isScanning: boolean,
  setIsScanning: React.Dispatch<React.SetStateAction<boolean>>,
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>,
) => {
  // 이미 스캔 중이면 중복 실행 방지
  if (isScanning) {
    return;
  }
  setIsScanning(true);
  setDevices([]); // 탐색 기기 목록 초기화

  await BLEService.scanDevices(device => {
    if (device.name) {
      setDevices(resultDevice => {
        const existDevice = resultDevice.some(d => d.id === device.id);

        if (!existDevice) {
          return [...resultDevice, device];
        }

        return resultDevice;
      });
    }
  });

  setTimeout(async () => {
    await BLEService.manager.stopDeviceScan();
    setIsScanning(false);
  }, 3000); // 3초 후 스캔 종료
};

export default startBluetoothDeviceScan;
