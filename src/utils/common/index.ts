// 문자열을 Base64로 인코딩하는 함수
export const encodeToBase64 = (data: string): string => {
  return Buffer.from(data).toString('base64');
};

// Base64로 인코딩된 문자열을 디코딩하는 함수
export const decodeFromBase64 = (data: string): string => {
  return atob(data);
};

// 10진수 아스키 코드 값으로 변환하는 함수
export const charToDecimal = (char: string) => {
  return char.charCodeAt(0);
};

// 거리 측정하는 함수
export const calculateDistance = (rssi: number | null): string => {
  if (rssi === null) return 'Unknown';

  const measuredPower = -69; // 기준 RSSI 값
  const N = 2; // 환경 감쇠 계수
  const distance = Math.pow(10, (measuredPower - rssi) / (10 * N));

  return `${distance.toFixed(2)} m`;
};
