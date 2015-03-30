# sExierCF
![sExierCF_Screenshot](https://cloud.githubusercontent.com/assets/1367707/6898505/9425aaf8-d735-11e4-9f10-f932af64f33d.png)

엑셒을 제맘대로 고치는 그리스몽키 스크립트입니다.

온갖 잡 기능들이 있습니다:

## 기능 목록

### 사이트 전체
* 사이트 타이틀 마음대로 변경가능

### 게시판
* Firefox에서 닉네임 클릭시 메뉴 제대로 뜨게 수정
* 그게시판 인증 성공시 다음부턴 자동 인증
* 내가 쓴 글 보기 버튼 추가

### 추가 네비'게이'션 메뉴
* 먹 게시판
* 작업 게시판 
* 간석지 게시판
* 그게시판
* 합필갤-고두익 검색결과
* GMC

### 글 쓸때
* 자동 서명 추가기능
* HTML 사용 자동으로 체크기능
* 유튜브 주소(http://youtu.be/video_id 형식의 주소)를 자동으로 embed 태그로 바꿔줌
* object 태그 자동으로 삭제 (안에 있는 embed는 남겨줌)
* iframe 태그 자동으로 embed로 변환
* 게시판 이미지 첨부 기능(모바일 페이지의 파일첨부 기능을 사용합니다.)
* 이미지 주소만 덜렁 놓으면 img src 태그로 바꿔줍니다. (확장자가 주소에 포함된 링크 한정)
* 아무 주소나 맨앞에 #를 붙이면 이미지 태그로 바꿔줍니다.
* 간단한 태그 편집기 
* 오늘 글 몇개를 올렸는지 표시해줍니다.

### 글 볼때
* 덧덧글기능 (닉네임 옆에 [+]를 누르면 코멘트 입력창에 "닉네임> " 을 자동으로 입력해줍니다.)
* 댓글 이메일 수집 기능
* 고통받는 Firefox 사용자들에게 안뜨는 embed 태그 밑에 고쳐주는 버튼을 추가합니다.
* 위에거로 안 고쳐지는 다른 embed들은 밑에 원본링크를 달아 눌러서 볼 수 있게 해줍니다.
* 간석지를 보기 편하게 고쳐줍니다.

## 다운로드
* [sExierCF.user.js](/sExierCF.user.js?raw=true)

## 설치법

### Mozilla Firefox
1. [Greasemonkey 확장 설치](https://addons.mozilla.org/ko/firefox/addon/greasemonkey/)
2. 다운로드 링크 눌러서 유저 스크립트 설치

### Google Chrome
1. [Tampermonkey 확장 설치](https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo/)
2. 다운로드 링크를 **우클릭-새 탭에서 열기** 버튼으로 엽니다.
3. 새로 뜨는 Tampermonkey 창에서 Install 버튼을 누릅니다.