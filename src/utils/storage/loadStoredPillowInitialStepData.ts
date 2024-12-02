import sendBluetoothDataToDevice from '../bluetooth/sendBluetoothDataToDevice';
import getPillowInitialStepData from '../common/getPillowInitialStepData';
import {loadStepLevel} from './storage';

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
      sendBluetoothDataToDevice(data, stepLevel, deviceID, openModal, part);
    }
  });
};

export default loadStoredPillowInitialStepData;
