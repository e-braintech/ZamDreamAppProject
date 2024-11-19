import React from 'react';
import {Pressable, StyleProp, Text, TextStyle, ViewStyle} from 'react-native';

interface ConfirmButtonProps {
  title: string;
  buttonStyle: StyleProp<ViewStyle>; // 수정된 타입
  textStyle: StyleProp<TextStyle>; // 배열 스타일 지원
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
