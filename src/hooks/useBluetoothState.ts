import {useEffect, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {State} from 'react-native-ble-plx';
import {BLEService} from '../services/BLEService';

// 앱 상태 변경 처리 함수
const handleAppStateChange = (
  appState: AppStateStatus,
  nextAppState: AppStateStatus,
  setAppState: React.Dispatch<React.SetStateAction<AppStateStatus>>,
  setBluetoothState: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  if (appState.match(/inactive|background/) && nextAppState === 'active') {
    BLEService.manager.state().then(bluetoothState => {
      if (bluetoothState === State.PoweredOn) {
        setBluetoothState('on');
      } else {
        setBluetoothState('off');
      }
    });
  }
  setAppState(nextAppState);
};

const useBluetoothState = () => {
  const [bluetoothState, setBluetoothState] = useState<string | null>(null); // 블루투스 상태
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  ); // 앱 상태

  useEffect(() => {
    const subscription = BLEService.manager.onStateChange(state => {
      if (state === State.PoweredOn) {
        setBluetoothState('on');
      } else if (state === State.PoweredOff) {
        setBluetoothState('off');
      } else {
        setBluetoothState(state);
      }
    }, true);

    const appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        handleAppStateChange(
          appState,
          nextAppState,
          setAppState,
          setBluetoothState,
        );
      },
    );

    return () => {
      subscription.remove();
      appStateSubscription.remove();
    };
  }, [appState]);

  return {bluetoothState, appState};
};

export default useBluetoothState;
