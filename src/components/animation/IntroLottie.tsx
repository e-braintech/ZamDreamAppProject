import LottieView from 'lottie-react-native';
import React from 'react';
import {ViewStyle} from 'react-native';

interface IntroLottieProps {
  lottieStyle: ViewStyle;
}

const IntroLottie: React.FC<IntroLottieProps> = ({lottieStyle}) => {
  // Logic

  // View
  return (
    <LottieView
      source={require('../../assets/lottie/intro.json')}
      style={lottieStyle}
      autoPlay={true}
      loop={false}
    />
  );
};

export default IntroLottie;
