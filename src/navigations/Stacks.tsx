import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import ControlDeviceScreen from '../screens/ControlDeviceScreen';
import ScanDeviceScreen from '../screens/ScanDeviceScreen';

const Stack = createStackNavigator<ROOT_NAVIGATION>();

const Stacks = () => {
  return (
    <Stack.Navigator initialRouteName="ScanDevice">
      <Stack.Screen
        name="ScanDevice"
        component={ScanDeviceScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ControlDevice"
        component={ControlDeviceScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
};

export default Stacks;
