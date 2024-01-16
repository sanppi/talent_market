# 재능마켓
택배 거래, 실물 거래가 필요없는 소소한 재능 거래 사이트
- 개발 기간 : 2023-12-26 ~ 2024-01-11 (약 2주)
- 배포 주소 : http://3.145.97.13/

## 팀 구성
|김서본(BE)|명길식(BE)|박윤혜(FE)|이산하(BE)|정세은(FE)|
|---|---|---|---|---|
|![서본](https://github.com/sanppi/talent_market/assets/77149171/953c7199-7fd8-4e02-ae19-a277896a8f7a)|![길식](https://github.com/sanppi/talent_market/assets/77149171/5f1d9421-1685-4299-8dc0-d15fe31dba82)|![윤혜](https://github.com/sanppi/talent_market/assets/77149171/d7b7b5ee-336b-49f2-ad10-a516797a2b60)|![산하](https://github.com/sanppi/talent_market/assets/77149171/c45f495e-373f-4f86-9d3b-63f0df3b3cf2)|![세은](https://github.com/sanppi/talent_market/assets/77149171/3247e800-50f4-45ba-a9ff-dbaeb5e9db6e)
|[@seobon](https://github.com/seobon)|[@KrillM](https://github.com/KrillM)|[@riverhye](https://github.com/riverhye)|[@sanppi](https://github.com/sanppi)|[@seeun0310](https://github.com/seeun0310)
|채팅 API|메인, 게시글, 리뷰 API|로그인, 회원가입, 마이페이지|로그인, 회원가입, 마이페이지 API|메인, 판매글, 상세페이지|

- Notion으로 일별 회고 작성 및 트러블 슈팅
- 이틀에 한번씩 스크럼 진행 후 회의록 작성 & 프로젝트 일정 조절

## 개발환경
### Front
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"><img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"><img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white">
<img src="https://img.shields.io/badge/redux-764ABC?style=for-the-badge&logo=redux&logoColor=white">

### Back
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"><img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"><img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"><img src="https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white">

### Collaborate & Tools
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"><img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"><img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">

## 개발 포인트
### 1. 사용자에게 편리한 UI/UX 고려
- useRef로 채팅방의 스크롤바를 최하단으로 고정하여 항상 최신 메시지가 보이게 설정
- 버튼 클릭이 많은 UI는 화면 상 클릭 유무를 확실하게 표시
- 모바일 접속자를 고려하여 반응형 구현

### 2. 컴포넌트화
- 재사용 할 함수나 html은 커스텀 훅이나 컴포넌트로 생성 (useToggle, ModalBasic)
- SASS의 중첩 구조, 믹스인 등을 활용해 중복 작성 방지

## ERD
![erd](https://github.com/sanppi/talent_market/assets/77149171/712fdc3d-3136-4aad-b757-0a9526d1dfaf)

# 화면 구조도 및 기능
## 메인페이지
![image](https://github.com/sanppi/talent_market/assets/77149171/312786df-25ca-4a7b-af61-4a685ee8cd44)

## 상세페이지
![image](https://github.com/sanppi/talent_market/assets/77149171/dffafd29-432b-4e0a-a95d-a9cca6150f5b)
- 게시글 정보(조회수, 찜 횟수)

## 판매글 작성
![image](https://github.com/sanppi/talent_market/assets/77149171/fcb97991-fcef-46e8-b582-cf0e57335665)

## 회원가입
![image](https://github.com/sanppi/talent_market/assets/77149171/60f8ab3a-2f86-4f14-8833-8754c60cd4f7)
- 이이디/닉네임 중복 확인
- 유효성 검사
- 유효성 검사 통과 후 버튼 활성화

## 로그인
![image](https://github.com/sanppi/talent_market/assets/77149171/f83b004c-f5dd-47ee-9130-ccaeb3c171c7)
- 빈값일 시 버튼 비활성화

## 💎 마이페이지
![image](https://github.com/sanppi/talent_market/assets/77149171/85f389f3-f7a8-4abe-83f5-1e118d1c24c9)
- 찜 목록, 판매글 목록, 내 리뷰, 채팅 목록 확인

## 💎 회원정보 수정/탈퇴
![image](https://github.com/sanppi/talent_market/assets/77149171/8f11fdde-3672-4dca-862a-f78e3bc9024e)
- 닉네임, 이메일, 비밀번호, 결제정보 각각 변경
- 회원 탈퇴

## 💎 채팅
![image](https://github.com/sanppi/talent_market/assets/77149171/c8aca97d-6872-4ecc-95e9-a4f2e19ba3a6)
![image](https://github.com/sanppi/talent_market/assets/77149171/c207bdb5-8735-4636-ae99-4f2a6048d688)
- 판매자와 구매자 간 1:1 채팅방

## 💎 반응형
![image](https://github.com/sanppi/talent_market/assets/77149171/06f85d68-3491-491c-b8ac-f5f2c8478811)
![image](https://github.com/sanppi/talent_market/assets/77149171/323d1da9-2d5e-40ae-a332-8f3c64592be0)
![image](https://github.com/sanppi/talent_market/assets/77149171/ceb036b4-0fd4-4939-a2d3-47f9200f0783)
![image](https://github.com/sanppi/talent_market/assets/77149171/232857d8-6a97-4e4b-8e40-b72993984ca9)
