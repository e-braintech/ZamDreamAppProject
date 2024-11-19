import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import BluetoothBottomSheetControlView from '../components/BluetoothBottomSheetControlView';
import {
  batteryValue,
  set_head_step_1,
  set_head_step_2,
  set_head_step_3,
  set_head_step_4,
  set_head_step_5,
  set_left_head_step_1,
  set_left_head_step_2,
  set_left_head_step_3,
  set_left_head_step_4,
  set_left_head_step_5,
  set_neck_step_1,
  set_neck_step_2,
  set_neck_step_3,
  set_neck_step_4,
  set_neck_step_5,
  set_right_head_step_1,
  set_right_head_step_2,
  set_right_head_step_3,
  set_right_head_step_4,
  set_right_head_step_5,
  set_shoulder_step_1,
  set_shoulder_step_2,
  set_shoulder_step_3,
  set_shoulder_step_4,
  set_shoulder_step_5,
} from '../data/actions';
import {characteristic_UUID, notify_UUID, service_UUID} from '../data/uuids';
import {useBottomSheetBackHandler} from '../hooks/useBottomSheetBackHandler';
import {BLEService} from '../services/BLEService';
import {ActionStepType} from '../types/types';
import {charToDecimal, decodeFromBase64, encodeToBase64} from '../utils/common';
import {loadStepLevel} from '../utils/storage/storage';

type Props = NativeStackScreenProps<ROOT_NAVIGATION, 'DetailDevice'>;

const actionStep: ActionStepType[] = [
  {number: 1, title: '어깨'},
  {number: 2, title: '목'},
  {number: 3, title: '머리'},
  {number: 4, title: '머리 우측'},
  {number: 5, title: '머리 좌측'},
  {number: 6, title: '향기 박스'},
];

const DetailDeviceScreen = ({navigation}: Props) => {
  // View

  const route = useRoute<RouteProp<ROOT_NAVIGATION, 'DetailDevice'>>(); // useRoute로 데이터 접근
  const {deviceId} = route.params; // 전달받은 기기 데이터
  const [selectedStep, setSelectedStep] = useState<ActionStepType | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null); // 배터리 레벨을 저장하는 상태

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['20%', '50%'], []);

  const {handleSheetPositionChange} =
    useBottomSheetBackHandler(bottomSheetModalRef);

  const handlePresentModalPress = useCallback((stepNumber: number) => {
    const step = actionStep.find(item => item.number === stepNumber);
    if (step) {
      setSelectedStep(step);
      bottomSheetModalRef.current?.present();
    }
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} pressBehavior="close" />,
    [],
  );

  const hideBottomSheet = () => {
    bottomSheetModalRef.current?.close();
  };

  const getBluetoothData = (part: string, stepLevel: number): string | null => {
    switch (part) {
      case 'shoulder':
        return stepLevel === 1
          ? set_shoulder_step_1
          : stepLevel === 2
          ? set_shoulder_step_2
          : stepLevel === 3
          ? set_shoulder_step_3
          : stepLevel === 4
          ? set_shoulder_step_4
          : set_shoulder_step_5;
      case 'neck':
        return stepLevel === 1
          ? set_neck_step_1
          : stepLevel === 2
          ? set_neck_step_2
          : stepLevel === 3
          ? set_neck_step_3
          : stepLevel === 4
          ? set_neck_step_4
          : set_neck_step_5;
      case 'head':
        return stepLevel === 1
          ? set_head_step_1
          : stepLevel === 2
          ? set_head_step_2
          : stepLevel === 3
          ? set_head_step_3
          : stepLevel === 4
          ? set_head_step_4
          : set_head_step_5;
      case 'rightHead':
        return stepLevel === 1
          ? set_right_head_step_1
          : stepLevel === 2
          ? set_right_head_step_2
          : stepLevel === 3
          ? set_right_head_step_3
          : stepLevel === 4
          ? set_right_head_step_4
          : set_right_head_step_5;
      case 'leftHead':
        return stepLevel === 1
          ? set_left_head_step_1
          : stepLevel === 2
          ? set_left_head_step_2
          : stepLevel === 3
          ? set_left_head_step_3
          : stepLevel === 4
          ? set_left_head_step_4
          : set_left_head_step_5;
      default:
        return null;
    }
  };

  const discoverServicesAndCharacteristics = async (deviceId: string) => {
    try {
      await BLEService.manager.discoverAllServicesAndCharacteristicsForDevice(
        deviceId,
      );

      const services = await BLEService.manager.servicesForDevice(deviceId);
      console.log('Discovered services:', services);

      for (const service of services) {
        const characteristics =
          await BLEService.manager.characteristicsForDevice(
            deviceId,
            service.uuid,
          );
        console.log(
          `Service ${service.uuid} has characteristics:`,
          characteristics,
        );
      }
    } catch (error) {
      console.error('Failed to discover services and characteristics:', error);
    }
  };

  const checkDeviceConnection = async (deviceId: string) => {
    const isConnected = await BLEService.manager.isDeviceConnected(deviceId);
    if (!isConnected) {
      console.error('Device is not connected. Attempting to reconnect...');
      await BLEService.manager.connectToDevice(deviceId);
      await discoverServicesAndCharacteristics(deviceId);
    }
  };

  const sendStoredStepsToDevice = async () => {
    const parts = ['shoulder', 'neck', 'head', 'rightHead', 'leftHead'];

    parts.forEach(part => {
      const stepLevel = loadStepLevel(part);
      const data = getBluetoothData(part, stepLevel);

      if (data) {
        sendDataToDevice(data, part, stepLevel); // 부위, 단계, 데이터를 함께 전송
      }
    });
  };

  // 데이터를 블루투스 기기로 보내는 함수
  const sendDataToDevice = (data: string, part: string, stepLevel: number) => {
    console.log(data);

    try {
      const base64Data = encodeToBase64(data);

      if (!deviceId) {
        console.error('No connected device found');
        return;
      }

      BLEService.manager
        .writeCharacteristicWithResponseForDevice(
          deviceId,
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
      console.error('Failed to send data:', error);
    }
  };

  // 배터리 측정 요청을 보내는 함수
  const requestBatteryLevel = async () => {
    try {
      if (!deviceId) {
        console.error('No connected device found');
        return;
      }

      // 연결 상태 확인 및 재연결
      const isConnected = await BLEService.manager.isDeviceConnected(deviceId);
      if (!isConnected) {
        console.error('Device is not connected. Reconnecting...');
        await BLEService.manager.connectToDevice(deviceId);
      }

      // 서비스 및 특성 검색
      await BLEService.manager.discoverAllServicesAndCharacteristicsForDevice(
        deviceId,
      );

      // 배터리 요청 데이터 생성 (기기 문서를 참조해 데이터 형식 확인 필요)
      const base64Data = encodeToBase64(batteryValue); // 요청 데이터 변경 필요

      // 배터리 요청 전송
      await BLEService.manager.writeCharacteristicWithResponseForDevice(
        deviceId,
        service_UUID, // 배터리 서비스 UUID
        characteristic_UUID, // 배터리 요청 특성 UUID
        base64Data,
      );

      console.log('Battery level request sent.');

      // 배터리 응답 모니터링
      BLEService.manager.monitorCharacteristicForDevice(
        deviceId,
        service_UUID, // 배터리 Notify 서비스 UUID
        notify_UUID, // 배터리 Notify 특성 UUID
        (error, characteristic) => {
          if (error) {
            console.error('Failed to monitor characteristic:', error);
            return;
          }

          if (characteristic?.value) {
            const decodedValue = decodeFromBase64(characteristic.value);
            const targetCharValue = decodedValue[4];
            const decimalValue = charToDecimal(targetCharValue);
            console.log(`Battery Data: ${decimalValue}`);
            setBatteryLevel(decimalValue);
          }
        },
      );
    } catch (error) {
      console.error('Failed to request battery level:', error);
    }
  };

  useEffect(() => {
    sendStoredStepsToDevice();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      requestBatteryLevel();
    }, [batteryLevel]),
  );

  // Logic
  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
        <View style={{flex: 1, paddingHorizontal: 30}}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 30}}>
              배터리: {batteryLevel}
            </Text>
            <Text style={{fontSize: 32, fontWeight: 'bold'}}>
              나의 베개 설정
            </Text>
          </View>
          <View style={{flex: 1}}>
            <View
              style={{width: '100%', height: 200, backgroundColor: 'yellow'}}
            />
          </View>

          <View style={{flex: 1}}>
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
                  padding: 20,
                  marginHorizontal: 5,
                  backgroundColor: 'skyblue',
                  borderRadius: 10,
                }}
                onPress={() => handlePresentModalPress(actionStep[0].number)}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    backgroundColor: 'violet',
                    marginBottom: 5,
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    {actionStep[0].number}
                  </Text>
                </View>
                <Text style={{fontSize: 12}}>{actionStep[0].title}</Text>
              </Pressable>

              <Pressable
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 20,
                  marginHorizontal: 5,
                  backgroundColor: 'skyblue',
                  borderRadius: 10,
                }}
                onPress={() => handlePresentModalPress(actionStep[1].number)}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    backgroundColor: 'violet',
                    marginBottom: 5,
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    {actionStep[1].number}
                  </Text>
                </View>
                <Text style={{fontSize: 12}}>{actionStep[1].title}</Text>
              </Pressable>

              <Pressable
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 20,
                  marginHorizontal: 5,
                  backgroundColor: 'skyblue',
                  borderRadius: 10,
                }}
                onPress={() => handlePresentModalPress(actionStep[2].number)}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    backgroundColor: 'violet',
                    marginBottom: 5,
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    {actionStep[2].number}
                  </Text>
                </View>
                <Text style={{fontSize: 12}}>{actionStep[2].title}</Text>
              </Pressable>
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
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 20,
                  marginHorizontal: 5,
                  backgroundColor: 'skyblue',
                  borderRadius: 10,
                }}
                onPress={() => handlePresentModalPress(actionStep[3].number)}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    backgroundColor: 'violet',
                    marginBottom: 5,
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    {actionStep[3].number}
                  </Text>
                </View>
                <Text style={{fontSize: 12}}>{actionStep[3].title}</Text>
              </Pressable>

              <Pressable
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 20,
                  marginHorizontal: 5,
                  backgroundColor: 'skyblue',
                  borderRadius: 10,
                }}
                onPress={() => handlePresentModalPress(actionStep[4].number)}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    backgroundColor: 'violet',
                    marginBottom: 5,
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    {actionStep[4].number}
                  </Text>
                </View>
                <Text style={{fontSize: 12}}>{actionStep[4].title}</Text>
              </Pressable>

              <Pressable
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 20,
                  marginHorizontal: 5,
                  backgroundColor: 'skyblue',
                  borderRadius: 10,
                }}
                onPress={() => handlePresentModalPress(actionStep[5].number)}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    backgroundColor: 'violet',
                    marginBottom: 5,
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    {actionStep[5].number}
                  </Text>
                </View>
                <Text style={{fontSize: 12}}>{actionStep[5].title}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          onChange={handleSheetPositionChange}>
          <BottomSheetView style={{flex: 1}}>
            {selectedStep && (
              <BluetoothBottomSheetControlView
                stepNumber={selectedStep.number}
                title={selectedStep.title}
                deviceID={deviceId}
                hideBottomSheet={hideBottomSheet}
              />
            )}
          </BottomSheetView>
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default DetailDeviceScreen;
