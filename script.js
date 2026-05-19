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
let currentFilteredGames = []; 
let spinTimeoutId = null;      

// 🎵 오디오 컨텍스트 세팅 (코드로 직접 신디사이저 효과음을 만듭니다!)
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// 🔊 '드르륵' 틱 소리 함수
function playTick() {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.type = 'square'; // 약간 거친 기계식 룰렛 느낌
    osc.frequency.setValueAtTime(150, audioCtx.currentTime); // 낮은음
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.05);
}

// 🔊 '짠!' 당첨 소리 함수
function playTada() {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.type = 'triangle'; // 경쾌한 느낌
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // 도
    osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // 미
    osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // 솔 (빠르게 빰빰빰!)
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.8);
}

// 🎮 마스터 게임 리스트 (최종본)
const allGames = [
    { name: "제로 ✊🖐️", min: 2, max: 5 },
    { name: "터치게임 📱", min: 2, max: 5 },
    { name: "묵찌빠 ✊✌️🖐️", min: 2, max: 2 },
    { name: "홀짝 🎲", min: 2, max: 2 },
    { name: "지하철 🚇", min: 2, max: 10 },
    { name: "딸기 2진수 🔢", min: 2, max: 10 },
    { name: "눈치게임 👀", min: 3, max: 10 },
    { name: "고래고래 🐳", min: 3, max: 10 },
    { name: "훈민정음 🗣️", min: 3, max: 10 },
    { name: "딸기당근수박참외메론 🍉", min: 3, max: 10 },
    { name: "베스킨라빈스 31 🍦", min: 3, max: 10 },
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
    { name: "딸기 두부 🧊", min: 5, max: 10 },
    { name: "딸기 두부 지목 👈", min: 5, max: 10 },
    { name: "두부 게임 🟪", min: 5, max: 10 },
    { name: "지목게임 🎯", min: 5, max: 10 },
    { name: "더 게임 오브 데스 👆", min: 5, max: 10 }
];

// 1. 인원수 입력하고 시작하기 버튼 눌렀을 때
startBtn.addEventListener('click', function() {
    const count = parseInt(playerCountInput.value);

    if (isNaN(count) || count < 2) {
        alert("최소 2명 이상 입력해주세요! 🍻");
        return;
    }

    currentFilteredGames = allGames
        .filter(game => count >= game.min && count <= game.max)
        .map(game => game.name);

    setupScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    resultText.innerHTML = `현재 <b style="color:#FF5A5F">${count}명</b>!<br>어떤 게임이 나올까요?`;
});

// 2. 다시 인원수 설정하러 돌아가기 (탈출 기능)
backBtn.addEventListener('click', function() {
    if (isSpinning) {
        clearTimeout(spinTimeoutId); 
        isSpinning = false;          
        drawBtn.innerText = "운명의 뽑기 🎲"; 
        drawBtn.style.background = "#FF5A5F"; 
        drawBtn.style.boxShadow = "0 8px 20px rgba(255, 90, 95, 0.25)";
    }
    
    gameScreen.style.display = 'none';
    setupScreen.style.display = 'block';
    resultText.innerHTML = "어떤 게임이 나올까요?<br>아래 버튼을 눌러주세요!";
});

// 3. 룰렛 돌리기 로직
drawBtn.addEventListener('click', function() {
    if (isSpinning) return; 

    // 브라우저 정책상 사용자 클릭 시 오디오 권한 강제 허용
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    isSpinning = true;
    drawBtn.innerText = "뽑는 중... ⏳"; 
    drawBtn.style.background = "#8B95A1"; 
    drawBtn.style.boxShadow = "none";

    let spinCount = 0;
    const maxSpins = 30; 
    let delay = 40; 

    function spin() {
        const randomIndex = Math.floor(Math.random() * currentFilteredGames.length);
        resultText.innerText = currentFilteredGames[randomIndex];
        spinCount++;

        // 📱 안드로이드 진동 & 🔊 드르륵 소리 재생
        if (navigator.vibrate) navigator.vibrate(15); 
        playTick(); 

        if (spinCount < maxSpins) {
            if (spinCount > maxSpins - 10) delay += 40; 
            spinTimeoutId = setTimeout(spin, delay); 
        } else {
            const finalIndex = Math.floor(Math.random() * currentFilteredGames.length);
            const finalGame = currentFilteredGames[finalIndex];

            resultText.innerHTML = `<span style="color:#FF5A5F; font-size:1.2em; font-weight:900;">${finalGame}</span><br><span style="font-size:0.4em; color:#8B95A1; font-weight:normal;">마셔 마셔! 🍻</span>`;

            // 📱 안드로이드 짠! 진동 & 🔊 짠! 소리 재생
            if (navigator.vibrate) navigator.vibrate([100, 50, 200]); 
            playTada();

            isSpinning = false;
            drawBtn.innerText = "다시 돌리기 🎲"; 
            drawBtn.style.background = "#FF5A5F"; 
            drawBtn.style.boxShadow = "0 8px 20px rgba(255, 90, 95, 0.25)";
        }
    }
    spin(); 
});
