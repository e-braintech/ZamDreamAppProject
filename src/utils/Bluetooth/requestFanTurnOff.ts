import aromaStep from '../../data/aromaStep';
import {characteristic_UUID, service_UUID} from '../../data/uuids';
import {BLEService} from '../../services/BLEService';
import {encodeToBase64} from '../common';

const requestFanTurnOff = async (deviceID: string) => {
  const data = encodeToBase64(aromaStep.turn_off);

  try {
    if (!deviceID) {
      console.log('No connected device found');
      return;
    }

    const isConnected = await BLEService.manager.isDeviceConnected(deviceID);
    if (!isConnected) {
      console.log('Device is not connected. Reconnecting...');
      await BLEService.manager.connectToDevice(deviceID);
    }

    await BLEService.manager.writeCharacteristicWithResponseForDevice(
      deviceID,
      service_UUID,
      characteristic_UUID,
      data,
    );

    console.log('Smell turn off value sent to server');
  } catch (error) {
    console.log('Failed to send smell turn off value:', error);
  }
};

export default requestFanTurnOff;
