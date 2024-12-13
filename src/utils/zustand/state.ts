export interface PillowStepState {
  shoulder: number;
  neck: number;
  head: number;
  rightHead: number;
  leftHead: number;
  aroma: boolean;
  setStep: (part: string, level: number) => void;
}

export interface SwitchState {
  isEnabled: boolean;
  toggleSwitch: () => void;
  setEnabled: (enabled: boolean) => void;
}
