# 잠드림(ZamDream)
- 이 프로젝트는 **중소기업 R&D 현장맞춤형 인턴십 지원사업** 과정 동안 개발한 BLE 기반 스마트 베개 제어 앱 '**잠드림(ZamDream)**'입니다.
- 사용자가 스마트폰(Android, iPhone)을 통해 베개의 높낮이 및 방향(향기 방출) 단계를 조절하고, 베개의 배터리 상태를 표시하여 편안한 수면 환경을 누릴수 있도록 서비스를 제공합니다.
  
# 목차
- [프로젝트 구성도](#프로젝트-구성도)
- [데모 및 스크린샷](#데모-및-스크린샷)
- [프로젝트 기술](#프로젝트-기술)
- [문제 해결 과정](#문제-해결-과정)

# 프로젝트 구성도
![프로젝트 조직도](https://github.com/user-attachments/assets/fc9c1ae0-6296-40e8-81f7-140426fc3be8)

# 데모 및 스크린샷
| 화면 이름               | Android                                                                 | iOS                                                                     |
|-------------------------|------------------------------------------------------------------------|-------------------------------------------------------------------------|
| 시작 화면              | <img src="https://github.com/user-attachments/assets/b90a4438-6871-41be-90f7-d1dea541c5af" width="150"> | <img src="https://github.com/user-attachments/assets/dd6ee135-edf1-4314-8a28-ec773686a1d2" width="150"> |
| 디바이스 스캔 화면      | <img src="https://github.com/user-attachments/assets/89240816-fce1-486d-afa9-890f26b3bab9" width="150"> | <img src="https://github.com/user-attachments/assets/1613d41e-a8b5-49c3-b266-43461351f869" width="150"> |
| 디바이스 스캔 완료 화면 | <img src="https://github.com/user-attachments/assets/4dd3615e-3229-463c-b720-074724447756" width="150"> | <img src="https://github.com/user-attachments/assets/bab55b42-acc1-43bd-b770-45fcce66a0b5" width="150"> |
| 디바이스 스캔 성공 화면 | <img src="https://github.com/user-attachments/assets/da0fce6e-c452-478e-9f4a-be36f15deaee" width="150"> | <img src="https://github.com/user-attachments/assets/f6e58e67-35aa-4fd5-93b3-dac66a893db1" width="150"> |
| 디바이스 스캔 실패 화면 | <img src="https://github.com/user-attachments/assets/0d7262b8-7493-4373-a514-04d8f85ce188" width="150"> | <img src="https://github.com/user-attachments/assets/783e3ee4-8ceb-448a-9ef8-7911e14d6cb6" width="150"> |
| 디바이스 컨트롤 메인 화면 | <img src="https://github.com/user-attachments/assets/2cc0bbfd-1764-40f8-bf77-830be569fbc2" width="150"> | <img src="https://github.com/user-attachments/assets/e60345ac-b097-4b5f-8321-e7293f835b82" width="150"> |
| 디바이스 베개 높낮이 컨트롤 화면 | <img src="https://github.com/user-attachments/assets/f0928d17-8028-4c5f-a1e9-179b194b6804" width="150"> | <img src="https://github.com/user-attachments/assets/133adcf3-8292-418d-a7bb-af9f7e6cb248" width="150"> |
| 디바이스 방향 팬 컨트롤 화면 | <img src="https://github.com/user-attachments/assets/4b7c80a4-47cd-4be7-8ddb-0b624826ed0b" width="150"> | <img src="https://github.com/user-attachments/assets/05a9c7d0-1929-4937-984a-52b90af40d74" width="150"> |
| 디바이스 방향 팬 (on) 화면 | <img src="https://github.com/user-attachments/assets/9a526d8a-8605-4269-a86c-70cdb89343a2" width="150"> | <img src="https://github.com/user-attachments/assets/7fda1af6-abb0-46d6-a603-5a9a6fac2935" width="150"> |
| 디바이스 연결 끊김 화면 | <img src="https://github.com/user-attachments/assets/9d749df8-f97f-4803-bab5-f2a8273b7e21" width="150"> | <img src="https://github.com/user-attachments/assets/8207b320-a702-44d2-9ccf-855b425706b7" width="150"> |



# 프로젝트 기술
- React Native CLI
- TypeScript
- React Navigation
  - [Stack](https://reactnavigation.org/docs/stack-navigator/)
- BLE
  - [react-native-ble-plx](https://github.com/dotintent/react-native-ble-plx)
  - [react-native-ble-manager](https://github.com/innoveit/react-native-ble-manager)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- [react-native-permissions](https://github.com/zoontek/react-native-permissions)

  # 기능 및 주요 성과
  - BLE 기반 디바이스 연결 및 데이터 송수신
  - 베개 5개 부위(머리, 목, 어깨, 머리 좌측, 머리 우측) 및 방향(향기 방출) 사용자 맞춤형 높낮이/단계 설정
  - Zustand를 활용한 디바이스 연결 상태 및 베개 높낮이/단계 데이터 상태 관리
  - MMKV를 활용한 디바이스 베개 높낮이 데이터 저장
 
  # 문제 해결 과정
**1. 디바이스 데이터 전송 문제**
- 이슈: Buffer 값을 Base64로 인코딩하여 전송해야 했으나, 정해진 프로토콜에서 동작하지 않는 값들이 존재.
- 해결: H/W 개발자와 협력하여, 알파벳 조합으로 이루어진 프로토콜 값만 Base64로 인코딩하여 전송하도록 프로토콜을 수정하고 조율.

**2. 배터리 상태 값 불일치**
- 이슈: 디바이스에서 받아오는 배터리 상태 값이 실제 배터리 상태와 다르게 매번 변동.
- 해결: 배터리 상태를 3단계 구간으로 정리하여 전송하도록 조율.
  - 0 ~ 30%: `30%`
  - 31 ~ 50%: `50%`
  - 51 ~ 100%: `100%`

**3. H/W와 S/W 호환성 문제**
- 이슈: 앱에서 기기로 데이터를 전송한 후 H/W에서 예외적 상황(연결 끊김 등) 발생.
  - 예: 앱에서 현재 1단계인 상태에서 5단계 값을 기기로 전송했으나, H/W가 동작 도중 연결이 끊기는 문제 발생.
- 해결:
  1. 데이터를 전송하기 전에 디바이스 연결 상태를 체크하고, 연결이 끊겼을 경우 재연결 시도.
  2. 앱이 실행 중인 동안 연결 상태를 지속적으로 확인하며, 연결이 끊기면 즉시 재연결 시도.
