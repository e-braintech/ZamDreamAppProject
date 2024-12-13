import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  BackHandler,
  Image,
  SafeAreaView,
  Switch,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import BluetoothControlBottomSheet from '../components/BottomSheet/BluetoothControlBottomSheet';
import BottomSheetBackdropHandler from '../components/BottomSheet/BottomSheetBackdropHandler';
import SelectPillowPartButton from '../components/Button/SelectPillowPartButton';
import BluetoothDisconnectModal from '../components/Modal/BluetoothDisconnectModal';
import batteryState from '../data/batteryState';
import {useBottomSheetBackHandler} from '../hooks/useBottomSheetBackHandler';
import useModal from '../hooks/useModal';
import ActionStepType from '../types/ActionStepType';
import requestBluetoothDeviceBatteryLevel from '../utils/bluetooth/requestBluetoothDeviceBatteryLevel';
import requestBluetoothDeviceFanTurnOff from '../utils/bluetooth/requestBluetoothDeviceFanTurnOff';
import loadStoredPillowInitialStepData from '../utils/storage/loadStoredPillowInitialStepData';
import {useAromaStore, useSwitchStore} from '../utils/zustand/store';

type Props = NativeStackScreenProps<ROOT_NAVIGATION, 'ScanDevice'>;

const ControlDeviceScreen = ({navigation}: Props) => {
  // Logic

  const actionStep: ActionStepType[] = [
    {number: 1, title: '어깨'},
    {number: 2, title: '목'},
    {number: 3, title: '머리'},
    {number: 4, title: '머리 우측'},
    {number: 5, title: '머리 좌측'},
    {number: 6, title: '향기 박스'},
  ];

  const route = useRoute<RouteProp<ROOT_NAVIGATION, 'ControlDevice'>>(); // useRoute로 데이터 접근
  const {deviceID} = route.params; // 전달받은 기기 데이터
  const [selectedStep, setSelectedStep] = useState<ActionStepType | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null); // 배터리 레벨을 저장하는 상태

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['20%', '60%'], []);

  const {isEnabled, toggleSwitch} = useSwitchStore();

  const {setAromaStepLevel} = useAromaStore();

  const {isModalVisible, openModal, closeModal} = useModal();

  const {handleSheetPositionChange} =
    useBottomSheetBackHandler(bottomSheetModalRef);

  const batteryImage =
    batteryLevel === 100
      ? require('../assets/images/battery100.png')
      : batteryLevel === 50
      ? require('../assets/images/battery50.png')
      : require('../assets/images/battery30.png');

  const handlePresentModalPress = useCallback((stepNumber: number) => {
    const step = actionStep.find(item => item.number === stepNumber);
    if (step) {
      setSelectedStep(step);
      bottomSheetModalRef.current?.present();
    }
  }, []);

  const hideBottomSheet = () => {
    bottomSheetModalRef.current?.close();
  };

  useEffect(() => {
    if (!isEnabled) {
      requestBluetoothDeviceFanTurnOff(deviceID, openModal);
    }
  }, [isEnabled]);

  useEffect(() => {
    loadStoredPillowInitialStepData(deviceID, openModal);
  }, []);

  useEffect(() => {
    const handleBackPress = () => {
      BackHandler.exitApp(); // 앱 종료
      return true; // 기본 뒤로 가기 동작 차단
    };

    // BackHandler 이벤트 리스너 추가
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      requestBluetoothDeviceBatteryLevel(
        deviceID,
        batteryState,
        openModal,
        setBatteryLevel,
      );
    }, [batteryLevel]),
  );

  // View
  return (
    <BottomSheetModalProvider>
      <LinearGradient
        colors={['#5c35d1', '#3e1db4']}
        style={{
          flex: 1,
        }}>
        <SafeAreaView style={{flex: 1}}>
          <View style={{flex: 1, paddingHorizontal: 32}}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 30,
                fontWeight: 'bold',
                color: '#ffffff',
                marginTop: 80,
              }}>
              나의 베개 설정
            </Text>

            {batteryLevel && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 8,
                }}>
                <Image
                  source={batteryImage}
                  style={{
                    width: 24,
                    height: 12,
                    marginRight: 10,
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'regular',
                    color: '#ffffff',
                  }}>
                  {batteryLevel}%
                </Text>
              </View>
            )}

            <Image
              source={require('../assets/images/pilow.png')}
              style={{
                maxWidth: '100%',
                maxHeight: '40%',
              }}
              resizeMode="contain"
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <SelectPillowPartButton
                pillowButtonNumber={actionStep[0].number}
                pillowButtonText={actionStep[0].title}
                sendToData={() => handlePresentModalPress(actionStep[0].number)}
              />

              <SelectPillowPartButton
                pillowButtonNumber={actionStep[1].number}
                pillowButtonText={actionStep[1].title}
                sendToData={() => handlePresentModalPress(actionStep[1].number)}
              />

              <SelectPillowPartButton
                pillowButtonNumber={actionStep[2].number}
                pillowButtonText={actionStep[2].title}
                sendToData={() => handlePresentModalPress(actionStep[2].number)}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <SelectPillowPartButton
                pillowButtonNumber={actionStep[3].number}
                pillowButtonText={actionStep[3].title}
                sendToData={() => handlePresentModalPress(actionStep[3].number)}
              />

              <SelectPillowPartButton
                pillowButtonNumber={actionStep[4].number}
                pillowButtonText={actionStep[4].title}
                sendToData={() => handlePresentModalPress(actionStep[4].number)}
              />

              <SelectPillowPartButton
                pillowButtonNumber={actionStep[5].number}
                pillowButtonText={actionStep[5].title}
                sendToData={() => handlePresentModalPress(actionStep[5].number)}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 56,
                paddingHorizontal: 16,
                backgroundColor: '#F3F1FF',
                borderRadius: 10,
                opacity: isEnabled ? 1 : 0.5,
              }}>
              <Text
                style={{fontSize: 18, fontWeight: 'bold', color: '#240843'}}>
                향기 박스
              </Text>
              <Switch
                value={isEnabled}
                onValueChange={() => {
                  toggleSwitch();
                  setAromaStepLevel(1);
                }}
                disabled={!isEnabled}
                thumbColor={'#ffffff'}
                trackColor={{true: '#371B9E', false: '#C7C7E8'}}
              />
            </View>

            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={2}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              backdropComponent={BottomSheetBackdropHandler}
              onChange={handleSheetPositionChange}
              handleStyle={{backgroundColor: '#F3F1FF', borderRadius: 50}}
              handleIndicatorStyle={{
                width: 100,
                height: 5,
                marginTop: 10,
                backgroundColor: '#C7C7E8',
              }}>
              <BottomSheetView style={{flex: 1}}>
                {selectedStep && (
                  <BluetoothControlBottomSheet
                    stepNumber={selectedStep.number}
                    title={selectedStep.title}
                    deviceID={deviceID}
                    navigation={navigation}
                    hideBottomSheet={hideBottomSheet}
                  />
                )}
              </BottomSheetView>
            </BottomSheetModal>

            <BluetoothDisconnectModal
              visible={isModalVisible}
              onClose={closeModal}
              deviceID={deviceID}
              onCloseModal={closeModal}
              navigation={navigation}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </BottomSheetModalProvider>
  );
};

export default ControlDeviceScreen;
