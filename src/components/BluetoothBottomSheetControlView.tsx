import React, {useEffect, useState} from 'react';
import {Image, Pressable, Text, TouchableOpacity, View} from 'react-native';
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
  smell_turn_off,
} from '../data/actions';
import {characteristic_UUID, service_UUID} from '../data/uuids';
import {BLEService} from '../services/BLEService';
import {encodeToBase64} from '../utils/common';
import {loadStepLevel} from '../utils/storage/storage';
import useStepStore from '../utils/zustand/store';

interface BluetoothBottomSheetControlViewProps {
  stepNumber: number;
  title: string;
  deviceID: string;
  hideBottomSheet: () => void;
}

const BluetoothBottomSheetControlView: React.FC<
  BluetoothBottomSheetControlViewProps
> = ({stepNumber, title, deviceID, hideBottomSheet}) => {
  // Logic
  const {shoulder, neck, head, rightHead, leftHead, smell, setStep} =
    useStepStore();

  const [stepLevel, setStepLevel] = useState<number>(1); // 단계 수 상태 추가

  // 단계 수 증가 함수
  const handleIncrease = () => {
    setStepLevel(prev => {
      if (stepNumber === 6) {
        return prev < 4 ? prev + 1 : prev; // stepNumber가 6일 때 3까지만 증가
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
          ? // ? smell_step_1
            smell_turn_off
          : stepLevel === 2
          ? smell_step_1
          : stepLevel === 3
          ? smell_step_2
          : stepLevel === 4
          ? smell_step_3
          : null; // 잘못된 stepLevel에 대해 null 반환
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
  const sendDataToDevice = (data: string) => {
    console.log(data);

    try {
      const base64Data = encodeToBase64(data);

      if (!deviceID) {
        console.error('No connected device found');
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
      console.error('Failed to send data:', error);
    }
  };

  // '확인' 버튼 클릭 시 데이터를 전송하는 함수
  const handleConfirm = () => {
    const data = getBluetoothData(stepNumber, stepLevel);

    try {
      if (data) {
        sendDataToDevice(data);
        const part = getPartName(stepNumber);
        setStep(part, stepLevel); // 상태 저장
        hideBottomSheet();
      }
    } catch (error) {
      console.log('데이터 전송 실패: ', error);
    }
  };

  // // '켜기' 또는 '끄기' 버튼 클릭 시 데이터를 전송하는 함수
  // const handleSmellToggle = (on: boolean) => {
  //   const data = on ? smell_on : smell_off;
  //   setIsSmellOn(on); // 상태 업데이트
  //   setStep('smell', on ? 1 : 0);
  //   sendDataToDevice(data); // 데이터 전송
  //   hideBottomSheet();
  // };

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
    <View style={{flex: 1, marginTop: 50, paddingHorizontal: 30}}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={{marginRight: 5, color: 'gray'}}>{`조작 위치`}</Text>
          <View
            style={{
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 15,
              backgroundColor: 'gray',
            }}>
            <Text style={{color: '#ffffff'}}>{stepNumber}</Text>
          </View>
        </View>
      </View>

      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 15,
        }}>
        {title}
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 25,
        }}>{`${stepLevel}단`}</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 50,
        }}>
        <TouchableOpacity
          style={{padding: 10, borderWidth: 1, borderRadius: 5}}
          onPress={handleDecrease}>
          <Image
            source={require('../assets/up.png')}
            style={{width: 24, height: 24}}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{padding: 10, borderWidth: 1, borderRadius: 5}}
          onPress={handleIncrease}>
          <Image
            source={require('../assets/down.png')}
            style={{width: 24, height: 24}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Pressable
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 10,
            borderWidth: 1,
            borderRadius: 20,
            marginRight: 10,
          }}
          onPress={hideBottomSheet}>
          <Text>취소</Text>
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 10,
            borderWidth: 1,
            borderRadius: 20,
            marginLeft: 10,
          }}
          onPress={handleConfirm}>
          <Text>확인</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default BluetoothBottomSheetControlView;
