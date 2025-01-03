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
import useModal from '../../hooks/useModal';
import sendBluetoothDataToDevice from '../../utils/bluetooth/sendBluetoothDataToDevice';
import getPillowStepData from '../../utils/common/getPillowStepData';
import {loadStepLevel} from '../../utils/storage/storage';
import {
  useAromaStore,
  useStepStore,
  useSwitchStore,
} from '../../utils/zustand/store';

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
  const [stepLevel, setStepLevel] = useState<number>(1); // 단계 수 상태 추가

  const {setStep} = useStepStore();

  const {setEnabled} = useSwitchStore();

  const {aromaStepLevel, setAromaStepLevel} = useAromaStore();

  const {openModal} = useModal();

  // 이미지 맵 정의
  const imageMap: {
    h: {[key: number]: any}; // stepNumber가 1~5일 때의 이미지 맵
    s: {[key: number]: any}; // stepNumber가 6일 때의 이미지 맵
  } = {
    h: {
      1: require('../../assets/images/h01.png'),
      2: require('../../assets/images/h02.png'),
      3: require('../../assets/images/h03.png'),
      4: require('../../assets/images/h04.png'),
      5: require('../../assets/images/h05.png'),
    },
    s: {
      1: require('../../assets/images/s01.png'),
      2: require('../../assets/images/s02.png'),
      3: require('../../assets/images/s03.png'),
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
      default:
        return '';
    }
  };

  // '확인' 버튼 클릭 시 데이터를 전송하는 함수
  const handleConfirm = async () => {
    const data = getPillowStepData(stepNumber, stepLevel);

    if (stepNumber === 6 && stepLevel >= 1 && stepLevel <= 3) {
      setEnabled(true); // 조건이 맞으면 `isEnabled`를 true로 변경
      setAromaStepLevel(stepLevel);
    }

    try {
      if (data) {
        await sendBluetoothDataToDevice(data, stepLevel, deviceID, openModal)
          .then(() => {
            if (stepNumber !== 6) {
              const part = getPartName(stepNumber);
              setStep(part, stepLevel); // stepNumber가 6이 아닐 때만 상태 저장
            }
          })
          .catch(error => console.log('기기 데이터 전송 실패: ', error));
        hideBottomSheet();
      }
    } catch (error) {
      console.log('연결 오류: ', error);
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
        setStepLevel(aromaStepLevel);
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
            source={require('../../assets/images/arw_down.png')}
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
            source={require('../../assets/images/arw_up.png')}
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
