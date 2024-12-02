import LottieView from 'lottie-react-native';
import React from 'react';
import {
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BLEService} from '../../services/BLEService';

interface BluetoothConnectModalProps {
  visible: boolean;
  onClose: () => void;
}

const BluetoothConnectModal: React.FC<BluetoothConnectModalProps> = ({
  visible,
  onClose,
}) => {
  // Logic
  const buttonText = Platform.OS === 'ios' ? '설정' : '블루투스 켜기';

  // 블루투스 켜기 함수
  const handleBluetoothStateOn = async () => {
    if (Platform.OS === 'ios') {
      // iOS에서는 설정 페이지로 이동
      await Linking.openURL('app-settings://bluetooth/RedreamApp')
        .then(() => onClose())
        .then(err => console.log(err));
    } else {
      // Android에서는 BLEService로 블루투스를 켤 수 있음
      await BLEService.enable()
        .then(() => onClose())
        .then(err => console.log(err));
    }
  };

  // View
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={{
            width: '80%',
            alignItems: 'center',
            backgroundColor: '#F3F1FF',
            paddingTop: 20,
            paddingHorizontal: 16,
            paddingBottom: 16,
            borderRadius: 20,
          }}>
          <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={onClose}>
            <Image
              source={require('../../assets/images/close.png')}
              style={{
                width: 20,
                height: 20,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <LottieView
            source={require('../../assets/lottie/bluetooth.json')}
            style={{
              width: 100,
              height: 100,
              marginTop: 30,
              marginBottom: 8,
            }}
            autoPlay={true}
            loop={true}
          />

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 64,
            }}>
            <Text
              style={{color: '#240843', fontSize: 18, fontWeight: 'semibold'}}>
              블루투스가 꺼져있습니다.
            </Text>
            <Text
              style={{color: '#240843', fontSize: 18, fontWeight: 'semibold'}}>
              디바이스 연결을 위해
            </Text>
            <Text
              style={{color: '#240843', fontSize: 18, fontWeight: 'semibold'}}>
              블루투스를 켜시겠습니까?
            </Text>
          </View>

          <Pressable
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 16,
              backgroundColor: '#371B9E',
              borderRadius: 30,
            }}
            onPress={handleBluetoothStateOn}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#ffffff'}}>
              {buttonText}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default BluetoothConnectModal;
