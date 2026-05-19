// 1. 화면에 있는 요소들 다 불러오기
const mainTitle = document.getElementById('main-title');
const buttonGroup = document.getElementById('button-group');
const gameScreen = document.getElementById('game-screen');

const smallGroupBtn = document.getElementById('small-group');
const largeGroupBtn = document.getElementById('large-group');
const backBtn = document.getElementById('back-button');
const drawBtn = document.getElementById('draw-button');
const resultText = document.getElementById('result-text');

// 2. 게임 리스트 데이터 구축

// 4인 이상 텐션업 게임 리스트 (총 26개)
const largeGames = [
    "터치게임 📱", "지하철 🚇", "눈치게임 👀", "딸기 3비트 🍓", 
    "딸기 버스 🚌", "딸기 2진수 🔢", "딸기 두부 🧊", "딸기 두부 지목 👈", 
    "두부 게임 🟪", "고래고래 🐳", "레코레코이이 🎵", "공산당 게임 🚩", 
    "민주당 게임 🗽", "침묵의 공공칠빵 🤫", "바니바니 🐰", "슈퍼마리오 🍄", 
    "호빵찐빵대빵 🫓", "출석부 📝", "부석출 🔄", "훈민정음 🗣️", 
    "딸기당근수박참외메론 🍉", "지목게임 🎯", "손병호 게임 🖐️", 
    "더 게임 오브 데스 👆", "베스킨라빈스 31 🍦", "사랑의 빵 🍞"
];

// 2~3인 소수정예 게임 리스트 (추후 업데이트 예정)
const smallGames = [
    "콘텐츠 준비 중... ⏳", 
    "아이디어를 짜내는 중입니다 🤔"
];

let currentMode = '';   // 현재 어떤 버튼을 누르고 들어왔는지 기억하는 변수
let isSpinning = false; // 뽑기가 돌아가고 있는 중인지 확인 (광클 방지)

// 3. 메인 화면 버튼 이벤트 (화면 전환)

// 2~3인용 버튼을 눌렀을 때
smallGroupBtn.addEventListener('click', function() {
    buttonGroup.style.display = 'none';
    gameScreen.style.display = 'block';
    mainTitle.innerText = '👥 2~3인 소수정예';
    currentMode = 'small'; 
    resultText.innerHTML = "어떤 게임이 나올까요?<br>아래 버튼을 눌러주세요!";
});

// 4인 이상 버튼을 눌렀을 때
largeGroupBtn.addEventListener('click', function() {
    buttonGroup.style.display = 'none';
    gameScreen.style.display = 'block';
    mainTitle.innerText = '🔥 4인 이상 텐션업';
    currentMode = 'large'; 
    resultText.innerHTML = "어떤 게임이 나올까요?<br>아래 버튼을 눌러주세요!";
});

// 처음으로 돌아가기 버튼을 눌렀을 때
backBtn.addEventListener('click', function() {
    if (isSpinning) return; // 룰렛이 돌아가는 도중에는 도망가지 못하게 막기
    gameScreen.style.display = 'none';
    buttonGroup.style.display = 'flex';
    mainTitle.innerText = '🍻 오늘의 술게임 🍻';
});

// 4. 대망의 '운명의 뽑기' 룰렛 효과!
drawBtn.addEventListener('click', function() {
    // 이미 돌아가고 있으면 클릭 무시 (중복 실행 방지)
    if (isSpinning) return; 

    // 현재 모드에 맞는 배열을 선택
    const gameList = (currentMode === 'large') ? largeGames : smallGames;

    isSpinning = true;
    drawBtn.innerText = "뽑는 중... ⏳"; 
    drawBtn.style.backgroundColor = "#555"; // 버튼 비활성화 느낌 색상

    let count = 0;

    // 0.05초(50ms)마다 텍스트를 무작위로 계속 바꿈 (슈육 돌아가는 효과)
    const rouletteInterval = setInterval(function() {
        const randomIndex = Math.floor(Math.random() * gameList.length);
        resultText.innerText = gameList[randomIndex];
        count++;

        // 20번 정도(약 1초) 돌아갔으면 멈추고 결과 발표!
        if (count > 20) {
            clearInterval(rouletteInterval); // 타이머 정지

            // 진짜 최종 결과 하나 뽑기
            const finalIndex = Math.floor(Math.random() * gameList.length);
            const finalGame = gameList[finalIndex];

            // 결과를 노란색으로 크고 굵게 보여주기
            resultText.innerHTML = `<span style="color:#ffcc00; font-size:1.5em; font-weight:bold;">${finalGame}</span><br><br>시작하세요! 🍻`;

            // 상태 원상복구 (다시 뽑을 수 있게)
            isSpinning = false;
            drawBtn.innerText = "다시 뽑기 🎲"; 
            drawBtn.style.backgroundColor = "#ff3366"; 
        }
    }, 50); 
});
