// Base64로 인코딩된 문자열을 디코딩하는 함수
const decodeFromBufferToBase64 = (data: string): string => {
  return atob(data);
};

export default decodeFromBufferToBase64;
