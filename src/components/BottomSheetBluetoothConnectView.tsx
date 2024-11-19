import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Device} from 'react-native-ble-plx';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import {BLEService} from '../services/BLEService';
import ConfirmButton from './ConfirmButton';

interface BottomSheetBluetoothConnectViewProps {
  navigation: NativeStackNavigationProp<ROOT_NAVIGATION, 'Intro'>;
}

const BottomSheetBluetoothConnectView: React.FC<
  BottomSheetBluetoothConnectViewProps
> = ({navigation}) => {
  // Logic
  const [devices, setDevices] = useState<Device[]>([]); // 탐색된 BLE 기기
  const [isScanning, setIsScanning] = useState(false); // 스캔 상태
  const [scanFinished, setScanFinished] = useState(false); // 스캔 종료 상태
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null); // 연결된 기기
  const [connectionState, setConnectionState] = useState<
    'success' | 'fail' | null
  >(null); // 연결 상태

  // BLE 기기 추가 또는 업데이트
  const addOrUpdateDevice = (newDevice: Device) => {
    setDevices(prevDevices => {
      // 기존에 동일한 ID를 가진 기기가 있는지 확인
      const existingDeviceIndex = prevDevices.findIndex(
        device => device.id === newDevice.id,
      );

      // 중복 기기가 없을 경우 추가
      if (existingDeviceIndex === -1) {
        return [...prevDevices, newDevice];
      }

      // 중복 기기가 있으면 기존 리스트 반환 (변경 없음)
      return prevDevices;
    });
  };

  // BLE 기기 스캔 함수
  const startDeviceScan = () => {
    if (isScanning) return; // 중복 실행 방지

    setIsScanning(true); // 스캔 상태 시작
    setScanFinished(false); // 스캔 종료 상태 초기화
    setDevices([]); // 이전 스캔 결과 초기화

    // BLEService의 scanDevices 메소드를 호출하여 탐색 시작
    BLEService.scanDevices(device => {
      if (device.name) {
        addOrUpdateDevice(device); // 기기 추가
      }
    });

    // 3초 후 스캔 종료
    setTimeout(() => {
      BLEService.manager.stopDeviceScan(); // BLE 스캔 중지
      setIsScanning(false);
      setScanFinished(true);
      // connectToZamDreamDevice(); // "ZAMDREAM" 기기 연결 시도
    }, 3000);
  };

  const connectZamDreamDevice = () => {
    const deviceName = devices.find(device => device.name === 'ZAMDREAM');

    if (!deviceName) {
      console.log('ZAMDREAM 기기를 찾을 수 없습니다.');
      return;
    }

    BLEService.connectToDevice(deviceName.id)
      .then(device => {
        setConnectedDevice(device);
        setConnectionState('success');
        console.log(`ZAMDREAM 기기와 연결되었습니다: ${device.name}`);
      })
      .catch(error => {
        setConnectionState('fail');
        console.error('ZAMDREAM 기기와 연결 실패:', error);
      });
  };

  const navigateToDetailScreen = () => {
    if (connectedDevice) {
      navigation.navigate('DetailDevice', {deviceId: connectedDevice.id});
    }
  };

  // 컴포넌트가 마운트될 때 BLE 스캔 시작
  useEffect(() => {
    startDeviceScan();

    return () => {
      BLEService.manager.stopDeviceScan(); // 언마운트 시 스캔 중지
    };
  }, []);

  // View
  return (
    <View style={styles.container}>
      {/* 상태에 따라 다른 텍스트 렌더링 */}
      <Text style={styles.mainTitle}>
        {connectionState === 'success'
          ? '베개 연결 완료'
          : connectionState === 'fail'
          ? '베개 연결 실패'
          : scanFinished
          ? '베개 찾기 완료'
          : '베개 찾는 중'}
      </Text>
      <Text style={styles.subTitle}>
        {connectionState === 'success'
          ? '기기와 성공적으로 연결되었습니다.'
          : connectionState === 'fail'
          ? '기기 연결에 실패했습니다. 다시 시도해주세요.'
          : scanFinished
          ? '다음 단계로 이동해주세요.'
          : '잠시만 기다려주세요.'}
      </Text>

      {/* 상태에 따라 다른 Lottie 애니메이션 렌더링 */}
      <LottieView
        source={
          connectionState === 'success'
            ? require('../assets/lottie/connect.json')
            : connectionState === 'fail'
            ? require('../assets/lottie/fail.json')
            : scanFinished
            ? require('../assets/lottie/find.json')
            : require('../assets/lottie/search.json')
        }
        style={styles.lottie}
        autoPlay={true}
        loop={true}
      />

      <ConfirmButton
        title={
          connectionState === 'success'
            ? '시작하기'
            : connectionState === 'fail'
            ? '재시도 하기'
            : scanFinished
            ? '다음'
            : '다음'
        }
        buttonStyle={[
          styles.button,
          {backgroundColor: scanFinished ? '#371B9E' : '#C7C7E8'},
        ]}
        textStyle={styles.buttonText}
        onSubmit={
          connectionState === 'success'
            ? navigateToDetailScreen
            : connectionState === 'fail'
            ? connectZamDreamDevice
            : scanFinished
            ? connectZamDreamDevice
            : () => {} // 기본 빈 함수
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F3F1FF',
    paddingHorizontal: 32,
  },
  mainTitle: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 96,
    color: '#240843',
  },
  subTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'medium',
    marginTop: 24,
    color: '#8F8C94',
  },
  lottie: {
    width: '100%',
    height: '30%',
    marginTop: 56,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C7C7E8',
    borderRadius: 30,
    marginTop: 64,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BottomSheetBluetoothConnectView;
