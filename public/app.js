const invoiceInput = document.getElementById('invoiceInput');
const photoInput = document.getElementById('photoInput');
const takePhotoButton = document.getElementById('takePhotoButton');
const finishButton = document.getElementById('finishButton');
const gallery = document.getElementById('gallery');

let invoiceNumber = '';
let photoCount = 0;

takePhotoButton.addEventListener('click', () => {
  invoiceNumber = invoiceInput.value;
  if (!invoiceNumber) {
    alert('인보이스 번호를 입력하세요.');
    return;
  }
  photoInput.click(); // 파일 입력 클릭
});

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (file) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.width = 100; // 이미지 크기 조정
    img.alt = `사진 ${++photoCount} - 인보이스: ${invoiceNumber}`;
    gallery.appendChild(img);
    photoInput.value = ''; // 파일 입력 초기화
  }
  finishButton.style.display = 'block'; // 완료 버튼 표시
});

finishButton.addEventListener('click', () => {
  const formData = new FormData();
  formData.append('photo', photoInput.files[0]); // 사진 파일 추가
  formData.append('invoiceNumber', invoiceNumber); // 인보이스 번호 추가

  fetch('/upload', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data); // 서버로부터의 응답 표시
      gallery.innerHTML = ''; // 갤러리 초기화
      invoiceInput.value = ''; // 인보이스 번호 초기화
      finishButton.style.display = 'none'; // 완료 버튼 숨기기
    })
    .catch((error) => {
      console.error('업로드 오류:', error);
    });
});
