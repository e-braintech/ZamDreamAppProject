import {loadStepLevel} from '../storage/storage';
import getPillowInitialStepData from './getPillowInitialStepData';
import sendBluetoothDataToDevice from './sendBluetoothDataToDevice';

// 기기 높낮이 초기값 로드 함수
const loadStoredPillowInitialStepData = async (
  deviceID: string,
  openModal: () => void,
) => {
  const parts = ['shoulder', 'neck', 'head', 'rightHead', 'leftHead'];

  parts.forEach(part => {
    const stepLevel = loadStepLevel(part);
    const data = getPillowInitialStepData(part, stepLevel);

    if (data) {
      sendBluetoothDataToDevice(data, part, stepLevel, deviceID, openModal);
    }
  });
};

export default loadStoredPillowInitialStepData;
