import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {Device} from 'react-native-ble-plx';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import {connectToDevice} from '../services';

interface BluetoothConnectBottomSheetProps {
  navigation: NativeStackNavigationProp<ROOT_NAVIGATION, 'ScanDevice'>;
  devices: Device[];
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
}

const BluetoothConnectBottomSheet: React.FC<
  BluetoothConnectBottomSheetProps
> = ({navigation, devices, bottomSheetModalRef}) => {
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

  const handleBluetoothConnect = async () => {
    if (isScanComplete && !isConnecting) {
      if (connectionStatus === 'success' && connectedDeviceId) {
        // 연결 성공 시 상세 화면으로 이동
        bottomSheetModalRef.current?.close();
        navigation.navigate('ControlDevice', {deviceID: connectedDeviceId});
      } else if (connectionStatus === 'fail') {
        // 연결 실패 시 다시 연결 시도
        console.log('연결 재시도 중...');
        setConnectionStatus(null); // 연결 상태 초기화
      } else if (isScanComplete && !connectionStatus) {
        // 스캔 완료 후 연결 시도
        console.log('처음 연결 시도 중...');
        await connectToDevice(
          devices,
          setConnectionStatus,
          setIsConnecting,
          setConnectedDeviceId,
        );
      } else {
        console.log('아직 준비가 완료되지 않았습니다.');
      }
    } else {
      console.log('스캔 중이거나 연결 중입니다.');
    }
  };

  useEffect(() => {
    // 3초 후 스캔 완료 상태로 변경
    const timer = setTimeout(() => {
      setIsScanComplete(true);
    }, 3000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 해제
  }, []);

  // View
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 32,
        backgroundColor: '#F3F1FF',
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 30,
          fontWeight: 'bold',
          color: '#240843',
          marginTop: 96,
        }}>
        {mainTitle}
      </Text>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 'semibold',
          color: '#8F8C94',
          marginTop: 24,
        }}>
        {subTitle}
      </Text>

      <LottieView
        source={source}
        style={{width: '100%', height: '30%', marginTop: 56}}
        autoPlay={true}
        loop={true}
      />

      <Pressable
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 16,
          backgroundColor: buttonColor,
          borderRadius: 30,
          marginTop: 50,
        }}
        onPress={handleBluetoothConnect}>
        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#ffffff'}}>
          {buttonText}
        </Text>
      </Pressable>
    </View>
  );
};

export default BluetoothConnectBottomSheet;