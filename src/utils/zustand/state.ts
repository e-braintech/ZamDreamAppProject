export interface PillowStepState {
  shoulder: number;
  neck: number;
  head: number;
  rightHead: number;
  leftHead: number;
  smell: boolean;
  setStep: (part: string, level: number) => void;
}
