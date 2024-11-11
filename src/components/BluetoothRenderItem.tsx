import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {Device} from 'react-native-ble-plx';
import {calculateDistance} from '../utils/common';

interface BluetoothRenderItemProps {
  device: Device;
  index: number;
  connectToDevice: (device: Device) => void;
  disconnectFromDevice?: (device: Device) => void;
  isConnected?: boolean;
}

const BluetoothRenderItem: React.FC<BluetoothRenderItemProps> = ({
  device,
  index,
  connectToDevice,
  disconnectFromDevice,
  isConnected,
}) => {
  // Logic
  const distance = calculateDistance(device.rssi);

  // View
  return (
    <View key={index} style={{paddingHorizontal: 15}}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{flex: 8}}>
          <Text style={{marginBottom: 10}}>{device.name}</Text>
          <Text style={{fontSize: 8}}>{device.id}</Text>
          <Text style={{fontSize: 12, color: 'gray'}}>
            Distance: {distance}
          </Text>
        </View>
        <Pressable
          style={{
            flex: 2,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            backgroundColor: isConnected ? 'red' : 'blue',
          }}
          onPress={
            isConnected
              ? () => disconnectFromDevice?.(device)
              : () => connectToDevice(device)
          }>
          {isConnected ? (
            <Text style={{fontSize: 14, color: 'white'}}>연결 해제</Text>
          ) : (
            <Text style={{fontSize: 14, color: 'white'}}>연결</Text>
          )}
        </Pressable>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderColor: 'lightgray',
          width: '100%',
          marginVertical: 20,
        }}
      />
    </View>
  );
};

export default BluetoothRenderItem;
