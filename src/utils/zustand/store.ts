import {create} from 'zustand';
import {loadStepLevel, saveStepLevel} from '../storage/storage';
import {AromaStepState, PillowStepState, SwitchState} from './state';

export const useStepStore = create<PillowStepState>(set => ({
  shoulder: loadStepLevel('shoulder'),
  neck: loadStepLevel('neck'),
  head: loadStepLevel('head'),
  rightHead: loadStepLevel('rightHead'),
  leftHead: loadStepLevel('leftHead'),
  aroma: loadStepLevel('aroma') === 1,
  setStep: (part, level) => {
    set(state => ({...state, [part]: level}));
    saveStepLevel(part, level); // MMKV에 저장
  },
}));

export const useSwitchStore = create<SwitchState>(set => ({
  isEnabled: false,
  toggleSwitch: () =>
    set(state => ({
      isEnabled: !state.isEnabled,
    })),
  setEnabled: (enabled: boolean) =>
    set({
      isEnabled: enabled,
    }),
}));

export const useAromaStore = create<AromaStepState>(set => ({
  aromaStepLevel: 1,
  setAromaStepLevel: level => set({aromaStepLevel: level}),
}));
