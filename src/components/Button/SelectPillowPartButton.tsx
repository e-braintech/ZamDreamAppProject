import React from 'react';
import {Pressable, Text, View} from 'react-native';

interface SelectPillowPartButtonProps {
  pillowButtonNumber: number;
  pillowButtonText: string;
  sendToData: () => void;
}

const SelectPillowPartButton: React.FC<SelectPillowPartButtonProps> = ({
  pillowButtonNumber,
  pillowButtonText,
  sendToData,
}) => {
  return (
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
      onPress={sendToData}>
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
          {pillowButtonNumber}
        </Text>
        <Text style={{fontSize: 18, fontWeight: 'bold', color: '#ffffff'}}>
          {pillowButtonText}
        </Text>
      </View>
    </Pressable>
  );
};

export default SelectPillowPartButton;
