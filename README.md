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

| 화면 이름                        | Android                                                                                                    | iOS                                                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 시작 화면                        | ![시작화면](../ZamDreamAppProject/markdown/android/Screenshot_20241227_152441.jpg)                         | ![시작화면](../ZamDreamAppProject/markdown/ios/60181BF3-54DB-4310-A194-45AA0AE15483.png)                         |
| 디바이스 스캔 화면               | ![디바이스 스캔 화면](../ZamDreamAppProject//markdown/android/Screenshot_20241227_152451.jpg)              | ![디바이스 스캔 화면](../ZamDreamAppProject/markdown/ios/B4D7CD19-7C8D-4687-AA9E-B044374287AA.png)               |
| 디바이스 스캔 완료 화면          | ![디바이스 스캔 완료 화면](../ZamDreamAppProject/markdown/android/Screenshot_20241227_152459.jpg)          | ![디바이스 스캔 완료 화면](../ZamDreamAppProject/markdown/ios/A7B1CE73-133D-40E6-84C8-1D27B3486157.png)          |
| 디바이스 연결 성공 화면          | ![디바이스 연결 성공 화면](../ZamDreamAppProject/markdown/android/Screenshot_20241227_152516.jpg)          | ![디바이스 스캔 성공 화면](../ZamDreamAppProject/markdown/ios/BFD68A95-F3FE-437E-AF61-D04217A6C251.png)          |
| 디바이스 연결 실패 화면          | ![디바이스 연결 실패 화면](../ZamDreamAppProject/markdown/android/Screenshot_20241227_152504.jpg)          | ![디바이스 연결 실패 화면](../ZamDreamAppProject/markdown/ios/957BBDF7-6486-4766-8530-1521AAEBBA9F.png)          |
| 디바이스 컨트롤 메인 화면        | ![디바이스 컨트롤 메인 화면](../ZamDreamAppProject/markdown/android/Screenshot_20241227_152524.jpg)        | ![디바이스 컨트롤 메인 화면](../ZamDreamAppProject/markdown/ios/9F1E7724-FDDF-4326-AC1F-FF384FC75CB4.png)        |
| 디바이스 베개 높낮이 컨트롤 화면 | ![디바이스 베개 높낮이 컨트롤 화면](../ZamDreamAppProject/markdown/android/Screenshot_20241227_152527.jpg) | ![디바이스 베개 높낮이 컨트롤 화면](../ZamDreamAppProject/markdown/ios/D83D0D07-8AA8-49C6-A156-C3C09727588B.png) |
| 디바이스 방향 팬 컨트롤 화면     | ![디바이스 방향 팬 컨트롤 화면](../ZamDreamAppProject/markdown/android/Screenshot_20241227_152531.jpg)     | ![디바이스 방향 팬 컨트롤 화면](../ZamDreamAppProject/markdown/ios/56EDBC2B-1675-4623-82BF-0E249B06AC6C.png)     |
| 디바이스 방향 팬(on) 화면        | ![디바이스 방향팬(on) 화면](../ZamDreamAppProject/markdown/android/Screenshot_20241227_152546.jpg)         | ![디바이스 방향팬(on) 화면](../ZamDreamAppProject/markdown/ios/9517FDEF-85BC-484D-8A8B-62EFE211BCB0.png)         |
| 디바이스 연결 끊김 화면          | ![디바이스 연결 끊김 화면](../ZamDreamAppProject/markdown/android/Screenshot_20241227_152604.jpg)          | ![디바이스 연결 끊김 화면](../ZamDreamAppProject/markdown/ios/CE077D88-0E75-4D55-B453-DB6A714E748F.png)          |

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
