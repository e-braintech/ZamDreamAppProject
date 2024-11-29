import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Image, Pressable, SafeAreaView, Switch, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import BluetoothControlBottomSheet from '../components/BottomSheet/BluetoothControlBottomSheet';
import BottomSheetBackdropHandler from '../components/BottomSheet/BottomSheetBackdropHandler';
import BluetoothDisconnectModal from '../components/Modal/BluetoothDisconnectModal';
import batteryState from '../data/batteryState';
import {characteristic_UUID, service_UUID} from '../data/uuids';
import {useBottomSheetBackHandler} from '../hooks/useBottomSheetBackHandler';
import useModal from '../hooks/useModal';
import {BLEService} from '../services/BLEService';
import ActionStepType from '../types/ActionStepType';
import getPillowInitialStepData from '../utils/Bluetooth/getPillowInitialStepData';
import requestBatteryLevel from '../utils/Bluetooth/requestBatteryLevel';
import requestFanTurnOff from '../utils/Bluetooth/requestFanTurnOff';
import {encodeToBase64} from '../utils/common';
import {loadStepLevel} from '../utils/storage/storage';
import {useSwitchStore} from '../utils/zustand/store';

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

  const {isEnabled, toggleSwitch, setEnabled} = useSwitchStore();

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

  const sendStoredStepsToDevice = async () => {
    const parts = ['shoulder', 'neck', 'head', 'rightHead', 'leftHead'];

    parts.forEach(part => {
      const stepLevel = loadStepLevel(part);
      const data = getPillowInitialStepData(part, stepLevel);

      if (data) {
        sendDataToDevice(data, part, stepLevel); // 부위, 단계, 데이터를 함께 전송
      }
    });
  };

  // 데이터를 블루투스 기기로 보내는 함수
  const sendDataToDevice = async (
    data: string,
    part: string,
    stepLevel: number,
  ) => {
    console.log(data);

    try {
      const base64Data = encodeToBase64(data);

      if (!deviceID) {
        console.log('No connected device found');
        openModal();
        return;
      }

      // 연결 상태 확인
      const isConnected = await BLEService.manager.isDeviceConnected(deviceID);
      if (!isConnected) {
        console.log('Device is not connected. Reconnecting...');
        await BLEService.manager.connectToDevice(deviceID).catch(() => {
          openModal();
          return;
        });
      }

      BLEService.manager
        .writeCharacteristicWithResponseForDevice(
          deviceID,
          service_UUID,
          characteristic_UUID,
          base64Data,
        )
        .then(res => {
          console.log(
            `Data sent successfully for ${part} at level ${stepLevel}`,
          );
          // console.log('Data sent: ', JSON.stringify(res, null, 5));
        })
        .catch(err => {
          // console.log('Error sending data:', err)
          return;
        });
    } catch (error) {
      console.log('Failed to send data:', error);
    }
  };

  useEffect(() => {
    if (!isEnabled) {
      requestFanTurnOff(deviceID);
    }
  }, [isEnabled]);

  useEffect(() => {
    sendStoredStepsToDevice();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      requestBatteryLevel(deviceID, batteryState, openModal, setBatteryLevel);
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
              <Pressable
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 16,
                  backgroundColor: '#5B3BC4',
                  borderWidth: 0.1,
                  borderColor: '#ffffff',
                  borderRadius: 10,
                  marginHorizontal: 5,
                }}
                onPress={() => handlePresentModalPress(actionStep[0].number)}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    backgroundColor: '#ffffff',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      color: '#240843',
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    {actionStep[0].number}
                  </Text>
                </View>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', color: '#ffffff'}}>
                  {actionStep[0].title}
                </Text>
              </Pressable>

              <Pressable
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 16,
                  backgroundColor: '#5B3BC4',
                  borderWidth: 0.1,
                  borderColor: '#ffffff',
                  borderRadius: 10,
                  marginHorizontal: 5,
                }}
                onPress={() => handlePresentModalPress(actionStep[1].number)}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    backgroundColor: '#ffffff',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      color: '#240843',
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    {actionStep[1].number}
                  </Text>
                </View>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', color: '#ffffff'}}>
                  {actionStep[1].title}
                </Text>
              </Pressable>

              <Pressable
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 16,
                  backgroundColor: '#5B3BC4',
                  borderWidth: 0.1,
                  borderColor: '#ffffff',
                  borderRadius: 10,
                  marginHorizontal: 5,
                }}
                onPress={() => handlePresentModalPress(actionStep[2].number)}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    backgroundColor: '#ffffff',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      color: '#240843',
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    {actionStep[2].number}
                  </Text>
                </View>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', color: '#ffffff'}}>
                  {actionStep[2].title}
                </Text>
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <Pressable
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 16,
                  backgroundColor: '#5B3BC4',
                  borderWidth: 0.1,
                  borderColor: '#ffffff',
                  borderRadius: 10,
                  marginHorizontal: 5,
                }}
                onPress={() => handlePresentModalPress(actionStep[3].number)}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    backgroundColor: '#ffffff',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      color: '#240843',
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    {actionStep[3].number}
                  </Text>
                </View>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', color: '#ffffff'}}>
                  {actionStep[3].title}
                </Text>
              </Pressable>

              <Pressable
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 16,
                  backgroundColor: '#5B3BC4',
                  borderWidth: 0.1,
                  borderColor: '#ffffff',
                  borderRadius: 10,
                  marginHorizontal: 5,
                }}
                onPress={() => handlePresentModalPress(actionStep[4].number)}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    backgroundColor: '#ffffff',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      color: '#240843',
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    {actionStep[4].number}
                  </Text>
                </View>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', color: '#ffffff'}}>
                  {actionStep[4].title}
                </Text>
              </Pressable>

              <Pressable
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 16,
                  backgroundColor: '#5B3BC4',
                  borderWidth: 0.1,
                  borderColor: '#ffffff',
                  borderRadius: 10,
                  marginHorizontal: 5,
                }}
                onPress={() => handlePresentModalPress(actionStep[5].number)}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    backgroundColor: '#ffffff',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      color: '#240843',
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    {actionStep[5].number}
                  </Text>
                </View>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', color: '#ffffff'}}>
                  {actionStep[5].title}
                </Text>
              </Pressable>
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
                onValueChange={toggleSwitch}
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
