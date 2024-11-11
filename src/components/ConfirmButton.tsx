import React from 'react';
import {Pressable, Text, TextStyle, ViewStyle} from 'react-native';

interface ConfirmButtonProps {
  title: string;
  buttonStyle: ViewStyle;
  textStyle: TextStyle;
  onSubmit: () => void;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  title,
  buttonStyle,
  textStyle,
  onSubmit,
}) => {
  // Logic

  // View
  return (
    <Pressable style={buttonStyle} onPress={onSubmit}>
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
};

export default ConfirmButton;
