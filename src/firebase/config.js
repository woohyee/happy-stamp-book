import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Vercel에 등록한 환경 변수(비밀 금고의 값)를 가져와서 사용합니다.
// 이제 우리 코드에는 더 이상 비밀 키가 직접 노출되지 않습니다.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
