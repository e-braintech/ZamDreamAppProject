/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import Stacks from './src/navigations/Stacks';

async function requestPermissions() {
  if (Platform.OS === 'ios') {
    // iOS에서 요청할 권한 목록을 배열에 추가
    const permissions = [
      PERMISSIONS.IOS.BLUETOOTH,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ];

    // requestMultiple을 사용하여 권한 요청
    const statuses = await requestMultiple(permissions);

    // 각 권한의 요청 결과를 확인
    if (
      statuses[PERMISSIONS.IOS.BLUETOOTH] === RESULTS.GRANTED &&
      statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED
    ) {
      console.log('iOS 블루투스 및 위치 권한 허용됨');
    } else {
      console.log('iOS iOS 블루투스 및 위치 권한 거부됨');
    }
  } else if (Platform.OS === 'android') {
    // Android에서 요청할 권한 목록을 배열에 추가
    const permissions = [
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ];

    // requestMultiple을 사용하여 권한 요청
    const statuses = await requestMultiple(permissions);

    // 각 권한의 요청 결과를 확인
    if (
      statuses[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] === RESULTS.GRANTED &&
      statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] === RESULTS.GRANTED &&
      statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED
    ) {
      console.log('Android 블루투스 및 위치 권한 허용됨');
    } else {
      console.log('Android 블루투스 및 위치 권한 거부됨');
    }
  }
}

function App(): React.JSX.Element {
  // Logic

  useEffect(() => {
    async function getPermissions() {
      requestPermissions();
    }

    getPermissions();
  }, []);

  // View
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stacks />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
