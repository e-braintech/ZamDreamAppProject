import LottieView from 'lottie-react-native';
import React, {useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';
import ConfirmButton from './ConfirmButton';

interface BottomSheetBluetoothConnectViewProps {
  isScanningCompleted: boolean;
  devices: Device[]; // 탐색된 BLE 기기 목록
  bleManager: BleManager; // BLE Manager 인스턴스
}
const BottomSheetBluetoothConnectView: React.FC<
  BottomSheetBluetoothConnectViewProps
> = ({isScanningCompleted, devices, bleManager}) => {
  // Logic
  const [isConnected, setIsConnected] = useState<boolean | null>(null); // 연결 상태
  const [isConnecting, setIsConnecting] = useState(false); // 연결 중 상태

  // 기기와 BLE 연결 시도
  const connectToDevice = async (device: Device) => {
    try {
      setIsConnecting(true); // 연결 시도 시작
      console.log(`Connecting to device: ${device.name}`);
      const connectedDevice = await bleManager.connectToDevice(device.id);
      await bleManager.discoverAllServicesAndCharacteristicsForDevice(
        connectedDevice.id,
      );
      setIsConnected(true); // 연결 성공
      Alert.alert('연결 성공', `${device.name}에 성공적으로 연결되었습니다.`);
    } catch (error) {
      console.error('Device connection error:', error);
      setIsConnected(false); // 연결 실패
      Alert.alert('연결 실패', '기기 연결에 실패했습니다.');
    } finally {
      setIsConnecting(false); // 연결 시도 종료
    }
  };

  // ConfirmButton 클릭 핸들러
  const handleSubmit = () => {
    if (isConnecting) {
      Alert.alert('진행 중', '기기 연결을 시도 중입니다. 잠시만 기다려주세요.');
      return;
    }

    if (!isScanningCompleted) {
      Alert.alert('탐색 중', '탐색이 완료된 후 버튼을 눌러주세요.');
      return;
    }

    if (isConnected === null) {
      // 이름이 "ZAMDREAM"인 기기 필터링
      const targetDevice = devices.find(device => device.name === 'ZAMDREAM');
      if (targetDevice) {
        connectToDevice(targetDevice); // 기기 연결 시도
      } else {
        Alert.alert('기기 없음', '"ZAMDREAM" 이름의 기기를 찾을 수 없습니다.');
      }
    } else if (isConnected) {
      console.log('다음 단계로 이동합니다.'); // 연결 성공 시 동작
    } else {
      console.log('재시도합니다.'); // 연결 실패 시 재시도
    }
  };

  // View
  return (
    <View style={styles.container}>
      {/* 상태에 따라 다른 텍스트 렌더링 */}
      <Text style={styles.mainTitle}>
        {isConnected === null
          ? isScanningCompleted
            ? '베개 찾기 완료'
            : '베개 찾는 중'
          : isConnected
          ? '베개 연결 완료'
          : '연결 실패'}
      </Text>
      <Text style={styles.subTitle}>
        {isConnected === null
          ? isScanningCompleted
            ? '다음 단계로 이동해주세요.'
            : '잠시만 기다려주세요.'
          : isConnected
          ? '베개 연결이 완료 되었습니다. 잠드림을 만나보세요.'
          : '연결에 실패했습니다. 다시 시도해주세요.'}
      </Text>

      {/* 상태에 따라 다른 Lottie 애니메이션 렌더링 */}
      <LottieView
        source={
          isConnected === null
            ? isScanningCompleted
              ? require('../assets/lottie/find.json')
              : require('../assets/lottie/search.json')
            : isConnected
            ? require('../assets/lottie/connect.json')
            : require('../assets/lottie/fail.json')
        }
        style={styles.lottie}
        autoPlay={true}
        loop={isConnected === null} // 연결 성공/실패 시 애니메이션 반복 중지
      />

      <ConfirmButton
        title={
          isConnected === null
            ? '다음'
            : isConnected
            ? '시작하기'
            : '재시도 하기'
        }
        buttonStyle={[
          styles.button,
          {
            backgroundColor: isConnected === null ? '#C7C7E8' : '#371B9E',
          },
        ]}
        textStyle={styles.buttonText}
        onSubmit={handleSubmit}
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
