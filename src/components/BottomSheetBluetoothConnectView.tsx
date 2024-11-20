import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Device} from 'react-native-ble-plx';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import {BLEService} from '../services/BLEService';
import ConfirmButton from './ConfirmButton';

interface BottomSheetBluetoothConnectViewProps {
  navigation: NativeStackNavigationProp<ROOT_NAVIGATION, 'Intro'>;
  devices: Device[]; // IntroScreen에서 전달받은 BLE 기기 목록
}

const BottomSheetBluetoothConnectView: React.FC<
  BottomSheetBluetoothConnectViewProps
> = ({navigation, devices}) => {
  // Logic
  const [isScanComplete, setIsScanComplete] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false); // 연결 상태 관리
  const [connectionStatus, setConnectionStatus] = useState<
    'success' | 'fail' | null
  >(null); // 연결 상태
  const [connectedDeviceId, setConnectedDeviceId] = useState<string | null>(
    null,
  ); // 연결된 기기의 ID

  const mainTitle =
    connectionStatus === 'success'
      ? '베개 연결 완료'
      : connectionStatus === 'fail'
      ? '베개 연결 실패'
      : isScanComplete
      ? '베개 찾기 완료'
      : '베개 찾는 중';

  const subTitle =
    connectionStatus === 'success'
      ? '베개 연결이 완료되었습니다.\n잠드림을 만나보세요.'
      : connectionStatus === 'fail'
      ? '배개 연결이 실패하였습니다.\n연결 재시도 바랍니다.'
      : isScanComplete
      ? '다음 단계로 이동해주세요.'
      : '잠시만 기다려주세요.';

  const source =
    connectionStatus === 'success'
      ? require('../assets/lottie/connect.json')
      : connectionStatus === 'fail'
      ? require('../assets/lottie/fail.json')
      : isScanComplete
      ? require('../assets/lottie/find.json')
      : require('../assets/lottie/search.json');

  const buttonText =
    connectionStatus === 'success'
      ? '시작하기'
      : connectionStatus === 'fail'
      ? '재시도 하기'
      : '다음';

  const buttonColor =
    connectionStatus === 'success'
      ? '#371B9E'
      : connectionStatus === 'fail'
      ? '#371B9E'
      : isScanComplete
      ? '#371B9E' // 파란색 (스캔 완료)
      : '#C7C7E8'; // 회색 (스캔 중)

  useEffect(() => {
    // 3초 후 스캔 완료 상태로 변경
    const timer = setTimeout(() => {
      setIsScanComplete(true);
    }, 3000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 해제
  }, []);

  // "ZAM DREAM" 기기와 연결하는 함수
  const connectToDevice = async () => {
    const device = devices.find(device => device.name === 'ZAM DREAM');

    if (!device) {
      setConnectionStatus('fail'); // 기기를 찾을 수 없으면 실패 상태로 설정
      return;
    }

    try {
      setIsConnecting(true);
      await BLEService.connectToDevice(device.id);
      await BLEService.discoverAllServicesAndCharacteristicsForDevice();

      setConnectionStatus('success'); // 연결 성공 상태로 설정
      setConnectedDeviceId(device.id); // 연결된 기기의 ID 저장
    } catch (error) {
      console.error('연결 중 오류:', error);
      setConnectionStatus('fail'); // 연결 실패 상태로 설정
    } finally {
      setIsConnecting(false);
    }
  };

  // ConfirmButton 클릭 이벤트
  const handleButtonPress = async () => {
    if (connectionStatus === 'success' && connectedDeviceId) {
      // 연결 성공 시 상세 화면으로 이동
      navigation.navigate('DetailDevice', {deviceId: connectedDeviceId});
    } else if (connectionStatus === 'fail') {
      // 연결 실패 시 다시 연결 시도
      console.log('연결 재시도 중...');
      setConnectionStatus(null); // 연결 상태 초기화
    } else if (isScanComplete && !connectionStatus) {
      // 스캔 완료 후 연결 시도
      console.log('처음 연결 시도 중...');
      await connectToDevice();
    } else {
      console.log('아직 준비가 완료되지 않았습니다.');
    }
  };

  // ConfirmButton에 항상 함수 할당
  const handleConfirmButtonPress = () => {
    if (isScanComplete && !isConnecting) {
      handleButtonPress();
    } else {
      console.log('스캔 중이거나 연결 중입니다.');
    }
  };

  // View
  return (
    <View style={styles.container}>
      {/* 상태에 따라 다른 텍스트 렌더링 */}
      <Text style={styles.mainTitle}>{mainTitle}</Text>
      <Text style={styles.subTitle}>{subTitle}</Text>

      {/* 상태에 따라 다른 Lottie 애니메이션 렌더링 */}
      <LottieView
        source={source}
        style={styles.lottie}
        autoPlay={true}
        loop={true}
      />

      <ConfirmButton
        title={buttonText}
        buttonStyle={[styles.button, {backgroundColor: buttonColor}]}
        textStyle={styles.buttonText}
        onSubmit={handleConfirmButtonPress}
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
