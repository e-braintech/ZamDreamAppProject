import pillowInitialStep from '../../data/pillowInitialStep';

// 기기 높낮이 초기값 설정 함수
const getPillowInitialStepData = (
  part: string,
  stepLevel: number,
): string | null => {
  switch (part) {
    case 'shoulder':
      return stepLevel === 1
        ? pillowInitialStep.shoulder[1]
        : stepLevel === 2
        ? pillowInitialStep.shoulder[2]
        : stepLevel === 3
        ? pillowInitialStep.shoulder[3]
        : stepLevel === 4
        ? pillowInitialStep.shoulder[4]
        : pillowInitialStep.shoulder[5];
    case 'neck':
      return stepLevel === 1
        ? pillowInitialStep.neck[1]
        : stepLevel === 2
        ? pillowInitialStep.neck[2]
        : stepLevel === 3
        ? pillowInitialStep.neck[3]
        : stepLevel === 4
        ? pillowInitialStep.neck[4]
        : pillowInitialStep.neck[5];
    case 'head':
      return stepLevel === 1
        ? pillowInitialStep.head[1]
        : stepLevel === 2
        ? pillowInitialStep.head[2]
        : stepLevel === 3
        ? pillowInitialStep.head[3]
        : stepLevel === 4
        ? pillowInitialStep.head[4]
        : pillowInitialStep.head[5];
    case 'rightHead':
      return stepLevel === 1
        ? pillowInitialStep.right_head[1]
        : stepLevel === 2
        ? pillowInitialStep.right_head[2]
        : stepLevel === 3
        ? pillowInitialStep.right_head[3]
        : stepLevel === 4
        ? pillowInitialStep.right_head[4]
        : pillowInitialStep.right_head[5];
    case 'leftHead':
      return stepLevel === 1
        ? pillowInitialStep.left_head[1]
        : stepLevel === 2
        ? pillowInitialStep.left_head[2]
        : stepLevel === 3
        ? pillowInitialStep.left_head[3]
        : stepLevel === 4
        ? pillowInitialStep.left_head[4]
        : pillowInitialStep.left_head[5];
    default:
      return null;
  }
};

export default getPillowInitialStepData;
