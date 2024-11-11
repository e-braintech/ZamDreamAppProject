import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

export const saveStepLevel = (part: string, level: number) => {
  storage.set(part, level.toString());
};

export const loadStepLevel = (part: string): number => {
  const value = storage.getString(part);
  return value ? parseInt(value, 10) : 1;
};
