# CloseTube - 나만의 소중한 사람들과 영상 공유

CloseTube는 가족, 친구들과만 공유하는 프라이빗 영상 플랫폼입니다. YouTube, Instagram, TikTok 등의 URL을 입력하면 해당 영상을 안전하게 공유할 수 있습니다.

## 🚀 주요 기능

- **URL 기반 영상 업로드**: YouTube, Instagram, TikTok URL 입력으로 간편 업로드
- **그룹별 공유**: 가족, 친구, 팀별로 영상 공유 관리
- **프라이빗 환경**: 다운로드 금지, 외부 공유 금지 등 보안 설정
- **실시간 댓글**: 영상에 대한 소통 기능
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기 지원

## 🛠 기술 스택

### Frontend
- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링
- **Framer Motion** - 애니메이션
- **React Player** - 비디오 플레이어
- **React Hook Form** - 폼 관리

### Backend
- **FastAPI** - Python 웹 프레임워크
- **Firebase Firestore** - NoSQL 데이터베이스
- **yt-dlp** - YouTube 다운로더 (메타데이터 추출)
- **BeautifulSoup** - 웹 스크래핑

### Infrastructure
- **Firebase** - 데이터베이스 및 인증
- **Railway** - 클라우드 배포

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/closetube.git
cd closetube
```

### 2. Frontend 설정
```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp env.example .env.local
# .env.local 파일을 편집하여 Firebase 설정 입력

# 개발 서버 실행
npm run dev
```

### 3. Backend 설정
```bash
cd backend

# Python 가상환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# Firebase 키 파일 설정
# Firebase Console에서 서비스 계정 키를 다운로드하여 firebase-key.json으로 저장

# 환경 변수 설정
cp env.example .env
# .env 파일을 편집하여 Firebase 설정 입력

# 개발 서버 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Firestore Database 활성화
3. 웹 앱 추가 및 설정 복사
4. 서비스 계정 키 생성 및 다운로드

## 🌐 배포

### Railway 배포

1. Railway 계정 생성 및 프로젝트 연결
2. 환경 변수 설정:
   - `NEXT_PUBLIC_FIREBASE_*` - Firebase 설정
   - `NEXT_PUBLIC_API_URL` - 백엔드 API URL
3. 자동 배포 활성화

### 백엔드 배포

1. Railway에서 새 서비스 생성
2. GitHub 저장소 연결
3. 환경 변수 설정
4. Firebase 키 파일 업로드

## 📱 사용법

1. **영상 업로드**: "영상 업로드" 버튼 클릭 후 URL 입력
2. **그룹 선택**: 공유할 그룹 선택 (가족, 친구들, 팀 프로젝트)
3. **프라이버시 설정**: 다운로드/외부 공유 금지 옵션 설정
4. **영상 시청**: 그리드에서 영상 클릭하여 재생
5. **댓글 작성**: 영상 하단에서 댓글 작성 및 소통

## 🔒 보안 기능

- **다운로드 금지**: 영상 다운로드 방지
- **외부 공유 금지**: 링크 공유 제한
- **그룹별 접근 제어**: 지정된 그룹만 접근 가능
- **Firebase 보안 규칙**: 데이터베이스 레벨 보안

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**CloseTube** - 소중한 순간을 소중한 사람들과 함께 