const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// 파일 저장 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// 인보이스 번호와 사진 업로드 처리
app.post('/upload', upload.single('photo'), (req, res) => {
  const invoiceNumber = req.body.invoiceNumber; // 인보이스 번호
  const photoPath = req.file.path; // 업로드된 사진 경로
  console.log(`인보이스 번호: ${invoiceNumber}, 사진 경로: ${photoPath}`);
  res.send('파일 업로드 성공');
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
