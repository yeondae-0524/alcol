// 1. 화면에 있는 요소들 다 불러오기
const mainTitle = document.getElementById('main-title');     // 👈 상단 제목 추가!
const buttonGroup = document.getElementById('button-group'); 
const gameScreen = document.getElementById('game-screen');   

const smallGroupBtn = document.getElementById('small-group');
const largeGroupBtn = document.getElementById('large-group');
const backBtn = document.getElementById('back-button');

// 2. 2~3인용 버튼을 눌렀을 때
smallGroupBtn.addEventListener('click', function() {
    buttonGroup.style.display = 'none';  
    gameScreen.style.display = 'block';  
    mainTitle.innerText = '👥 2~3인 소수정예'; // 👈 제목 글자 바꾸기!
});

// 3. 4인 이상 버튼을 눌렀을 때
largeGroupBtn.addEventListener('click', function() {
    buttonGroup.style.display = 'none';  
    gameScreen.style.display = 'block';  
    mainTitle.innerText = '🔥 4인 이상 텐션업'; // 👈 제목 글자 바꾸기!
});

// 4. 처음으로 돌아가기 버튼을 눌렀을 때
backBtn.addEventListener('click', function() {
    gameScreen.style.display = 'none';   
    buttonGroup.style.display = 'flex';  
    mainTitle.innerText = '🍻 오늘의 술게임 🍻'; // 👈 원래 제목으로 되돌리기!
});
