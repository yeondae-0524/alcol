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

// 4인 이상 텐션업 게임 리스트 (총 28개)
const largeGames = [
    "터치게임 📱", "지하철 🚇", "눈치게임 👀", "딸기 3비트 🍓", 
    "딸기 버스 🚌", "딸기 2진수 🔢", "딸기 두부 🧊", "딸기 두부 지목 👈", 
    "두부 게임 🟪", "고래고래 🐳", "레코레코이이 🎵", "공산당 게임 🚩", 
    "민주당 게임 🗽", "침묵의 공공칠빵 🤫", "바니바니 🐰", "슈퍼마리오 🍄", 
    "호빵찐빵대빵 🫓", "출석부 📝", "부석출 🔄", "훈민정음 🗣️", 
    "딸기당근수박참외메론 🍉", "지목게임 🎯", "손병호 게임 🖐️", 
    "더 게임 오브 데스 👆", "베스킨라빈스 31 🍦", "사랑의 빵 🔫", 
    "어목조동 🐟", "동조목어 ⏪"
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

// 4. 대망의 '운명의 뽑기' (스르륵 멈추는 룰렛 효과 업그레이드)
drawBtn.addEventListener('click', function() {
    if (isSpinning) return; 

    const gameList = (currentMode === 'large') ? largeGames : smallGames;

    isSpinning = true;
    drawBtn.innerText = "뽑는 중... ⏳"; 
    drawBtn.style.background = "#555"; // 비활성화 느낌
    drawBtn.style.boxShadow = "none";

    let spinCount = 0;
    const maxSpins = 30; // 총 돌아가는 횟수 (기존 20 -> 30으로 늘림)
    let delay = 40; // 처음 돌아가는 속도 (엄청 빠름)

    // 스르륵 효과를 위한 재귀 함수
    function spin() {
        // 랜덤으로 하나 뽑아서 화면에 보여주기
        const randomIndex = Math.floor(Math.random() * gameList.length);
        resultText.innerText = gameList[randomIndex];
        spinCount++;

        // 아직 덜 돌았으면 계속 돌리기
        if (spinCount < maxSpins) {
            // 핵심: 마지막 10번 남았을 때부터 딜레이를 팍팍 늘려서 브레이크를 건다!
            if (spinCount > maxSpins - 10) {
                delay += 40; // 속도가 점점 느려짐 (스르륵 효과)
            }
            setTimeout(spin, delay); // 변경된 딜레이만큼 이따가 다시 돌리기
        } 
        // 다 돌았으면 최종 결과 발표
        else {
            const finalIndex = Math.floor(Math.random() * gameList.length);
            const finalGame = gameList[finalIndex];

            // 글자 크기를 키우고 노란색으로 강조 (크기 비율 조절)
            resultText.innerHTML = `<span style="color:#ffcc00; font-size:1.2em; font-weight:900;">${finalGame}</span><br><span style="font-size:0.4em; color:#ddd; font-weight:normal;"></span>`;

            // 버튼 원래대로 예쁘게 복구
            isSpinning = false;
            drawBtn.innerText = "다시 돌리기 🎲"; 
            drawBtn.style.background = "linear-gradient(135deg, #ff3366, #ff6b33)";
            drawBtn.style.boxShadow = "0 10px 25px rgba(255, 51, 102, 0.5)";
        }
    }

    spin(); // 룰렛 돌리기 시작!
});
