import LottieView from 'lottie-react-native';
import React from 'react';
import {Modal, Pressable, Text, View} from 'react-native';

interface BluetoothDisconnectModalProps {
  visible: boolean;
  onClose: () => void;
  handleReconnect: () => void;
}

const BluetoothDisconnectModal: React.FC<BluetoothDisconnectModalProps> = ({
  visible,
  onClose,
  handleReconnect,
}) => {
  // Logic

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
            width: 320,
            alignItems: 'center',
            backgroundColor: '#F3F1FF',
            paddingTop: 20,
            paddingHorizontal: 16,
            paddingBottom: 16,
            borderRadius: 20,
          }}>
          <LottieView
            source={require('../../assets/lottie/fail.json')}
            style={{width: 224, height: 102}}
            autoPlay={true}
            loop={true}
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 32,
              marginBottom: 64,
            }}>
            <Text
              style={{fontSize: 18, fontWeight: 'semibold', color: '#240843'}}>
              베개와 연결이 끊겼습니다.
            </Text>
            <Text
              style={{fontSize: 18, fontWeight: 'semibold', color: '#240843'}}>
              베개 찾기 화면으로 이동합니다.
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
            onPress={handleReconnect}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#ffffff'}}>
              확인
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default BluetoothDisconnectModal;
