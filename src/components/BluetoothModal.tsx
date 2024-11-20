import LottieView from 'lottie-react-native';
import React from 'react';
import {
  Image,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BLEService} from '../services/BLEService';
import ConfirmButton from './ConfirmButton';

interface BluetoothModalProps {
  visible: boolean | undefined;
  onRequestClose: () => void;
}

const BluetoothModal: React.FC<BluetoothModalProps> = ({
  visible,
  onRequestClose,
}) => {
  // Logic
  const buttonText = Platform.OS === 'ios' ? '설정' : '블루투스 켜기';

  const handleBluetoothState = async () => {
    if (Platform.OS === 'ios') {
      // iOS에서는 설정 페이지로 이동
      Linking.openURL('app-settings://bluetooth/RedreamApp'); // iOS 설정 페이지로 이동
    } else {
      // Android에서는 BLEService로 블루투스를 켤 수 있음
      await BLEService.enable();
    }
  };

  // View
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={{alignSelf: 'flex-end'}}
            onPress={onRequestClose}>
            <Image
              source={require('../assets/close.png')}
              style={styles.closeButton}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <LottieView
            source={require('../assets/lottie/bluetooth.json')}
            style={styles.lottie}
            autoPlay={true}
            loop={true}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>블루투스가 꺼져있습니다.</Text>
            <Text style={styles.text}>디바이스 연결을 위해</Text>
            <Text style={styles.text}>블루투스를 켜시겠습니까?</Text>
          </View>

          <ConfirmButton
            title={buttonText}
            buttonStyle={styles.modalButton}
            textStyle={styles.modalButtonText}
            onSubmit={handleBluetoothState}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: '#F3F1FF',
    padding: 16,
    borderRadius: 20,
  },
  lottie: {
    width: 100,
    height: 100,
    marginTop: 30,
    marginBottom: 32,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 64,
  },
  text: {
    color: '#240843',
    fontSize: 16,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#371B9E',
    borderRadius: 30,
  },
  modalButtonText: {
    color: '#FBFBFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 20,
    height: 20,
  },
});

export default BluetoothModal;
