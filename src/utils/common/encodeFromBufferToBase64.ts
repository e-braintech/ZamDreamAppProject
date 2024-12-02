// 문자열을 Base64로 인코딩하는 함수
const encodeFromBufferToBase64 = (data: string): string => {
  return Buffer.from(data).toString('base64');
};

export default encodeFromBufferToBase64;
