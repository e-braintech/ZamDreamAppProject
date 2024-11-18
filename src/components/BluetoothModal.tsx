import LottieView from 'lottie-react-native';
import React from 'react';
import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

  const test = () => {
    console.log('test');
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
            onSubmit={test}
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
    // fontWeight: 'bold',
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
