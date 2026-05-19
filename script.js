// HTML 요소들 가져오기
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-button');
const drawBtn = document.getElementById('draw-button');
const resultText = document.getElementById('result-text');
const playerCountInput = document.getElementById('player-count');

// 상태 변수
let isSpinning = false;
let currentFilteredGames = []; // 입력된 인원에 맞는 게임들만 담길 배열

// 🎮 마스터 게임 리스트 (최소/최대 인원 조건 완벽 세팅)
const allGames = [
    // 2인 이상 (소수 정예 피지컬 & 빠른 텐션)
    { name: "제로 ✊🖐️", min: 2, max: 5 },
    { name: "터치게임 📱", min: 2, max: 5 },
    { name: "묵찌빠 ✊✌️🖐️", min: 2, max: 2},
    { name: "홀짝 🎲", min: 2, max: 2 },
    { name: "지하철 🚇", min: 2, max: 10 },
    { name: "딸기 2진수 🔢", min: 2, max: 10 },

    // 3인 이상 (눈치 & 두뇌 회전 시작)
    { name: "눈치게임 👀", min: 3, max: 10 },
    { name: "고래고래 🐳", min: 3, max: 10 },
    { name: "훈민정음 🗣️", min: 3, max: 10 },
    { name: "딸기당근수박참외메론 🍉", min: 3, max: 10 },
    { name: "베스킨라빈스 31 🍦", min: 3, max: 10 },

    // 4인 이상 (다수 인원 텐션 폭발, 주력 게임들)
    { name: "딸기 3비트 🍓", min: 4, max: 10 },
    { name: "딸기 버스 🚌", min: 4, max: 10 },
    { name: "레코레코이이 🎵", min: 4, max: 10 },
    { name: "공산당 게임 🚩", min: 4, max: 10 },
    { name: "민주당 게임 🗽", min: 4, max: 10 },
    { name: "침묵의 공공칠빵 🤫", min: 4, max: 10 },
    { name: "바니바니 🐰", min: 4, max: 10 },
    { name: "슈퍼마리오 🍄", min: 4, max: 10 },
    { name: "호빵찐빵대빵 🫓", min: 4, max: 10 },
    { name: "출석부 📝", min: 4, max: 10 },
    { name: "부석출 🔄", min: 4, max: 10 },
    { name: "손병호 게임 🖐️", min: 4, max: 10 },
    { name: "사랑의 빵 🔫", min: 4, max: 10 },
    { name: "어목조동 🐟", min: 4, max: 10 },
    { name: "동조목어 ⏪", min: 4, max: 10 },

    // 5인 이상 (다수 전용 타겟팅/지목 게임)
    { name: "딸기 두부 🧊", min: 5, max: 10 },
    { name: "딸기 두부 지목 👈", min: 5, max: 10 },
    { name: "두부 게임 🟪", min: 5, max: 10 },
    { name: "지목게임 🎯", min: 5, max: 10 },
    { name: "더 게임 오브 데스 👆", min: 5, max: 10 }
];

// 1. 인원수 입력하고 시작하기 버튼 눌렀을 때
startBtn.addEventListener('click', function() {
    const count = parseInt(playerCountInput.value);

    // 유효성 검사
    if (isNaN(count) || count < 2) {
        alert("최소 2명 이상 입력해주세요! 🍻");
        return;
    }

    // 🔥 핵심: 입력한 인원에 맞는 게임만 필터링해서 뽑아내기
    currentFilteredGames = allGames
        .filter(game => count >= game.min && count <= game.max)
        .map(game => game.name); // 이름만 따로 배열로 만들기

    // 화면 전환
    setupScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    // 초기화
    resultText.innerHTML = `현재 <b style="color:#FF5A5F">${count}명</b>!<br>어떤 게임이 나올까요?`;
});

// 2. 다시 인원수 설정하러 돌아가기
backBtn.addEventListener('click', function() {
    if (isSpinning) return;
    
    gameScreen.style.display = 'none';
    setupScreen.style.display = 'block';
    resultText.innerHTML = "어떤 게임이 나올까요?<br>아래 버튼을 눌러주세요!";
});

// 3. 룰렛 돌리기 로직
drawBtn.addEventListener('click', function() {
    if (isSpinning) return; 

    isSpinning = true;
    drawBtn.innerText = "뽑는 중... ⏳"; 
    drawBtn.style.background = "#8B95A1"; // 회색으로 비활성화 느낌
    drawBtn.style.boxShadow = "none";

    let spinCount = 0;
    const maxSpins = 30; 
    let delay = 40; 

    function spin() {
        const randomIndex = Math.floor(Math.random() * currentFilteredGames.length);
        resultText.innerText = currentFilteredGames[randomIndex];
        spinCount++;

        if (spinCount < maxSpins) {
            if (spinCount > maxSpins - 10) delay += 40; 
            setTimeout(spin, delay); 
        } else {
            const finalIndex = Math.floor(Math.random() * currentFilteredGames.length);
            const finalGame = currentFilteredGames[finalIndex];

            // 결과 발표
            resultText.innerHTML = `<span style="color:#FF5A5F; font-size:1.2em; font-weight:900;">${finalGame}</span><br><span style="font-size:0.4em; color:#8B95A1; font-weight:normal;">마셔 마셔! 🍻</span>`;

            isSpinning = false;
            drawBtn.innerText = "다시 돌리기 🎲"; 
            drawBtn.style.background = "#FF5A5F"; // 원래 색 복구
            drawBtn.style.boxShadow = "0 8px 20px rgba(255, 90, 95, 0.25)";
        }
    }
    spin(); 
});
