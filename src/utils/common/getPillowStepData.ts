import aromaStep from '../../data/aromaStep';
import pillowStep from '../../data/pillowStep';

// 단계별 Bluetooth 데이터 가져오기
const getPillowStepData = (
  stepNumber: number,
  stepLevel: number,
): string | null => {
  switch (stepNumber) {
    case 1:
      return stepLevel === 1
        ? pillowStep.shoulder[1]
        : stepLevel === 2
        ? pillowStep.shoulder[2]
        : stepLevel === 3
        ? pillowStep.shoulder[3]
        : stepLevel === 4
        ? pillowStep.shoulder[4]
        : pillowStep.shoulder[5];
    case 2:
      return stepLevel === 1
        ? pillowStep.neck[1]
        : stepLevel === 2
        ? pillowStep.neck[2]
        : stepLevel === 3
        ? pillowStep.neck[3]
        : stepLevel === 4
        ? pillowStep.neck[4]
        : pillowStep.neck[5];
    case 3:
      return stepLevel === 1
        ? pillowStep.head[1]
        : stepLevel === 2
        ? pillowStep.head[2]
        : stepLevel === 3
        ? pillowStep.head[3]
        : stepLevel === 4
        ? pillowStep.head[4]
        : pillowStep.head[5];
    case 4:
      return stepLevel === 1
        ? pillowStep.right_head[1]
        : stepLevel === 2
        ? pillowStep.right_head[2]
        : stepLevel === 3
        ? pillowStep.right_head[3]
        : stepLevel === 4
        ? pillowStep.right_head[4]
        : pillowStep.right_head[5];
    case 5:
      return stepLevel === 1
        ? pillowStep.left_head[1]
        : stepLevel === 2
        ? pillowStep.left_head[2]
        : stepLevel === 3
        ? pillowStep.left_head[3]
        : stepLevel === 4
        ? pillowStep.left_head[4]
        : pillowStep.left_head[5];
    case 6:
      return stepLevel === 1
        ? aromaStep.turn_on[1]
        : stepLevel === 2
        ? aromaStep.turn_on[2]
        : aromaStep.turn_on[3];
    default:
      return null;
  }
};

export default getPillowStepData;
