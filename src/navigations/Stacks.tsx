import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import DetailDeviceScreen from '../screens/DetailDeviceScreen';
import IntroScreen from '../screens/IntroScreen';
import ScanDeviceScreen from '../screens/ScanDeviceScreen';

const Stack = createStackNavigator<ROOT_NAVIGATION>();

const Stacks = () => {
  return (
    <Stack.Navigator initialRouteName="ScanDevice">
      <Stack.Screen
        name="Intro"
        component={IntroScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ScanDevice"
        component={ScanDeviceScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DetailDevice"
        component={DetailDeviceScreen}
        options={{headerTitle: '', headerShadowVisible: false}}
      />
    </Stack.Navigator>
  );
};

export default Stacks;
