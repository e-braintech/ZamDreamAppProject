/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Stacks from './src/navigations/Stacks';

function App(): React.JSX.Element {
  // Logic

  // View
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stacks />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
