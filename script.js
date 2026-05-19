// 1. 화면에 있는 요소들 다 불러오기
const buttonGroup = document.getElementById('button-group'); // 첫 화면 (버튼 2개)
const gameScreen = document.getElementById('game-screen');   // 두 번째 화면 (게임 화면)

const smallGroupBtn = document.getElementById('small-group');
const largeGroupBtn = document.getElementById('large-group');
const backBtn = document.getElementById('back-button');

// 2. 2~3인용 버튼을 눌렀을 때
smallGroupBtn.addEventListener('click', function() {
    buttonGroup.style.display = 'none';  // 첫 화면 숨기기
    gameScreen.style.display = 'block';  // 게임 화면 보여주기
});

// 3. 4인 이상 버튼을 눌렀을 때
largeGroupBtn.addEventListener('click', function() {
    buttonGroup.style.display = 'none';  // 첫 화면 숨기기
    gameScreen.style.display = 'block';  // 게임 화면 보여주기
});

// 4. 처음으로 돌아가기 버튼을 눌렀을 때
backBtn.addEventListener('click', function() {
    gameScreen.style.display = 'none';   // 게임 화면 숨기기
    buttonGroup.style.display = 'flex';  // 첫 화면 다시 보여주기
});
