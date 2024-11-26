import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import {
  head_step_1,
  head_step_2,
  head_step_3,
  head_step_4,
  head_step_5,
  left_head_step_1,
  left_head_step_2,
  left_head_step_3,
  left_head_step_4,
  left_head_step_5,
  neck_step_1,
  neck_step_2,
  neck_step_3,
  neck_step_4,
  neck_step_5,
  right_head_step_1,
  right_head_step_2,
  right_head_step_3,
  right_head_step_4,
  right_head_step_5,
  shoulder_step_1,
  shoulder_step_2,
  shoulder_step_3,
  shoulder_step_4,
  shoulder_step_5,
  smell_step_1,
  smell_step_2,
  smell_step_3,
} from '../data/actions';
import {characteristic_UUID, service_UUID} from '../data/uuids';
import {BLEService} from '../services/BLEService';
import {encodeToBase64} from '../utils/common';
import {loadStepLevel} from '../utils/storage/storage';
import {useStepStore, useSwitchStore} from '../utils/zustand/store';

interface BluetoothControlBottomSheetProps {
  navigation: NativeStackNavigationProp<ROOT_NAVIGATION, 'ScanDevice'>;
  stepNumber: number;
  title: string;
  deviceID: string;
  hideBottomSheet: () => void;
}

const BluetoothControlBottomSheet: React.FC<
  BluetoothControlBottomSheetProps
> = ({navigation, stepNumber, title, deviceID, hideBottomSheet}) => {
  // Logic
  const {shoulder, neck, head, rightHead, leftHead, smell, setStep} =
    useStepStore();

  const [stepLevel, setStepLevel] = useState<number>(1); // 단계 수 상태 추가

  const {setEnabled} = useSwitchStore();

  // 이미지 맵 정의
  const imageMap: {
    h: {[key: number]: any}; // stepNumber가 1~5일 때의 이미지 맵
    s: {[key: number]: any}; // stepNumber가 6일 때의 이미지 맵
  } = {
    h: {
      1: require('../assets/h01.png'),
      2: require('../assets/h02.png'),
      3: require('../assets/h03.png'),
      4: require('../assets/h04.png'),
      5: require('../assets/h05.png'),
    },
    s: {
      1: require('../assets/s01.png'),
      2: require('../assets/s02.png'),
      3: require('../assets/s03.png'),
    },
  };

  // 이미지 경로 동적으로 설정
  const getImageSource = (): number => {
    return stepNumber === 6 ? imageMap.s[stepLevel] : imageMap.h[stepLevel];
  };

  // 단계 수 증가 함수
  const handleIncrease = () => {
    setStepLevel(prev => {
      if (stepNumber === 6) {
        return prev < 3 ? prev + 1 : prev; // stepNumber가 6일 때 3까지만 증가
      } else {
        return prev < 5 ? prev + 1 : prev; // 다른 경우는 5까지만 증가
      }
    });
  };

  // 단계 수 감소 함수
  const handleDecrease = () => {
    setStepLevel(prev => {
      if (stepNumber === 6) {
        return prev > 1 ? prev - 1 : 1; // stepNumber가 6일 때 1까지만 감소
      } else {
        return prev > 1 ? prev - 1 : 1; // 다른 경우는 1까지만 감소
      }
    });
  };

  // 단계별 Bluetooth 데이터 가져오기
  const getBluetoothData = (
    stepNumber: number,
    stepLevel: number,
  ): string | null => {
    switch (stepNumber) {
      case 1:
        return stepLevel === 1
          ? shoulder_step_1
          : stepLevel === 2
          ? shoulder_step_2
          : stepLevel === 3
          ? shoulder_step_3
          : stepLevel === 4
          ? shoulder_step_4
          : shoulder_step_5;
      case 2:
        return stepLevel === 1
          ? neck_step_1
          : stepLevel === 2
          ? neck_step_2
          : stepLevel === 3
          ? neck_step_3
          : stepLevel === 4
          ? neck_step_4
          : neck_step_5;
      case 3:
        return stepLevel === 1
          ? head_step_1
          : stepLevel === 2
          ? head_step_2
          : stepLevel === 3
          ? head_step_3
          : stepLevel === 4
          ? head_step_4
          : head_step_5;
      case 4:
        return stepLevel === 1
          ? right_head_step_1
          : stepLevel === 2
          ? right_head_step_2
          : stepLevel === 3
          ? right_head_step_3
          : stepLevel === 4
          ? right_head_step_4
          : right_head_step_5;
      case 5:
        return stepLevel === 1
          ? left_head_step_1
          : stepLevel === 2
          ? left_head_step_2
          : stepLevel === 3
          ? left_head_step_3
          : stepLevel === 4
          ? left_head_step_4
          : left_head_step_5;
      case 6:
        return stepLevel === 1
          ? smell_step_1
          : stepLevel === 2
          ? smell_step_2
          : stepLevel === 3
          ? smell_step_3
          : // : stepLevel === 4
            // ? smell_turn_off
            null; // 잘못된 stepLevel에 대해 null 반환
      default:
        return null;
    }
  };

  // 부위 이름 반환
  const getPartName = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return 'shoulder';
      case 2:
        return 'neck';
      case 3:
        return 'head';
      case 4:
        return 'rightHead';
      case 5:
        return 'leftHead';
      case 6:
        return 'smell';
      default:
        return '';
    }
  };

  // 데이터를 블루투스 기기로 보내는 함수
  const sendDataToDevice = async (data: string) => {
    console.log(data);

    try {
      const base64Data = encodeToBase64(data);

      if (!deviceID) {
        console.log('No connected device found');
        return;
      }

      // 연결 상태 확인
      const isConnected = await BLEService.manager.isDeviceConnected(deviceID);
      if (!isConnected) {
        // console.log('Device is not connected. Resetting connection...');
        // resetAndNavigateToScanScreen(deviceID, navigation);
        return;
      }

      BLEService.manager
        .writeCharacteristicWithResponseForDevice(
          deviceID,
          service_UUID,
          characteristic_UUID,
          base64Data,
        )
        .then(res => {
          // console.log('Data sent: ', JSON.stringify(res, null, 5));
        })
        .catch(err => console.log('Error sending data:', err));
    } catch (error) {
      console.log('Failed to send data:', error);
      // resetAndNavigateToScanScreen(deviceID, navigation); // 오류 시 탐색 화면으로 이동
    }
  };

  // '확인' 버튼 클릭 시 데이터를 전송하는 함수
  const handleConfirm = async () => {
    const data = getBluetoothData(stepNumber, stepLevel);

    if (stepNumber === 6 && stepLevel >= 1 && stepLevel <= 3) {
      setEnabled(true); // 조건이 맞으면 `isEnabled`를 true로 변경
    }

    try {
      if (data) {
        await sendDataToDevice(data)
          .then(() => {
            const part = getPartName(stepNumber);
            setStep(part, stepLevel); // 상태 저장
          })
          .catch(err => console.log(err));
        hideBottomSheet();
      }
    } catch (error) {
      console.log('데이터 전송 실패: ', error);
    }
  };

  // useEffect 훅으로 초기 상태 설정
  useEffect(() => {
    switch (stepNumber) {
      case 1:
        setStepLevel(loadStepLevel('shoulder'));
        break;
      case 2:
        setStepLevel(loadStepLevel('neck'));
        break;
      case 3:
        setStepLevel(loadStepLevel('head'));
        break;
      case 4:
        setStepLevel(loadStepLevel('rightHead'));
        break;
      case 5:
        setStepLevel(loadStepLevel('leftHead'));
        break;
      case 6:
        setStepLevel(loadStepLevel('smell'));
        break;
      default:
        setStepLevel(1);
    }
  }, [stepNumber]);

  // View
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 32,
        backgroundColor: '#F3F1FF',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 50,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'semibold',
            color: '#8F8C94',
            marginRight: 5,
          }}>
          조작 위치
        </Text>

        <View
          style={{
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            backgroundColor: '#8F8C94',
          }}>
          <Text
            style={{fontSize: 14, fontWeight: 'semibold', color: '#ffffff'}}>
            {stepNumber}
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          marginTop: 15,
          marginBottom: 24,
        }}>
        {title}
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 15,
        }}>
        {`${stepLevel}단`}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          columnGap: 16,
        }}>
        <TouchableOpacity onPress={handleDecrease}>
          <Image
            source={require('../assets/arw_down.png')}
            style={{width: 36, height: 36}}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Image
          source={getImageSource()}
          style={{
            flex: 1,
            width: Platform.OS === 'ios' ? 240 : 228,
            height: Platform.OS === 'ios' ? 88 : 84,
          }}
          resizeMode="contain"
        />

        <TouchableOpacity onPress={handleIncrease}>
          <Image
            source={require('../assets/arw_up.png')}
            style={{width: 36, height: 36}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 80,
          gap: 10,
        }}>
        <Pressable
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 16,
            backgroundColor: '#C7C7E8',
            borderRadius: 30,
          }}
          onPress={hideBottomSheet}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#ffffff'}}>
            취소
          </Text>
        </Pressable>

        <Pressable
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 16,
            backgroundColor: '#371B9E',
            borderRadius: 30,
          }}
          onPress={handleConfirm}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#ffffff'}}>
            저장
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default BluetoothControlBottomSheet;
