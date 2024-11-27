type aromaStepType = {
  turn_on: {
    [key: number]: string; // key가 숫자인 객체
  };
  turn_off: string; // 단일 문자열 값
};

export default aromaStepType;
