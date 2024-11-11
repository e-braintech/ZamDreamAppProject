import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useMemo, useRef} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import ConfirmButton from '../components/ConfirmButton';
import {useBottomSheetBackHandler} from '../hooks/useBottomSheetBackHandler';

type Props = NativeStackScreenProps<ROOT_NAVIGATION, 'Intro'>;

const IntroScreen = ({navigation}: Props) => {
  // Logic
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['85%'], []);

  const {handleSheetPositionChange} =
    useBottomSheetBackHandler(bottomSheetModalRef);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} pressBehavior="close" />,
    [],
  );

  const handleShowLog = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // View
  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <ConfirmButton
          title="시작하기"
          buttonStyle={styles.buttonContainer}
          textStyle={styles.buttonText}
          onSubmit={handleShowLog}
        />

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          onChange={handleSheetPositionChange}>
          <BottomSheetView style={{flex: 1}}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text>test</Text>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 70 : 30,
    backgroundColor: 'yellow',
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'medium',
  },
});

export default IntroScreen;
