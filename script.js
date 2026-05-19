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

// 🎵 오디오 컨텍스트 세팅
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// 🔊 1. '드르륵' 틱 소리 (룰렛 도는 중)
function playTick() {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.05);
}

// 🔊 2. '짠!' 당첨 소리 (일반 게임 당첨 시)
function playTada() {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
    osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); 
    osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); 
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.8);
}

// 🔊 3. '삐이익-!' 경고음 (🚨 함정 카드 발동 시)
function playBuzzer() {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.type = 'sawtooth'; 
    osc.frequency.setValueAtTime(120, audioCtx.currentTime); 
    osc.frequency.setValueAtTime(90, audioCtx.currentTime + 0.2); 
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.6);
}

// 🎮 마스터 게임 리스트 
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

// 🌶️ 극악무도 킹받는 랜덤 도발 멘트 리스트
const spicyComments = [
    "원샷 못하면 오늘 밤 전여친/전남친한테 '자니?' 카톡 보냄 📱",
    "반샷하면 지금 당장 인스타 스토리에 엽사 박제함 📸",
    "원샷 안 하면 내일 아침 에브리타임 핫게시물 주인공 됨 🏫",
    "이거 못 마시면 이번 학기 전공 전부 C+ 폭격 맞음 💣",
    "술 뺄 거면 니가 오늘 술값 다 계산하고 집 가든가 💸",
    "마시기 싫으면 춤이라도 추든가 🕺💃 (아니면 조용히 마셔)",
    "이거 남기면 평생 롤 브론즈/아이언에서 못 벗어남 🎮",
    "알쓰 특) 지금 이 타이밍에 물잔 힐끔거림 👀💧",
    "취한 척 연기하면 명치 맞는다 진짜 🥊",
    "방금 한숨 쉰 사람 누구냐? 입 벌려 소주 들어간다 😮🍶",
    "토할 거면 나가서 토해라, 테이블에 뿜으면 사형 🤮❌",
    "혓바닥이 왜 이렇게 길어? 변명할 시간에 잔이나 들어라 👅",
    "뇌정지 왔쥬? 어버버하다가 한 잔 더 마시쥬? 🤪",
    "너 빼고 다 재밌는 이 분위기 어쩔 건데~ 얼른 마셔~ 📉",
    "마실까~ 말까~ 마실까~ 말까~ (빨리 마셔라 진짜 팍씨) 🤬",
    "안주 먹지 마라 술 깰라 🍖❌",
    "술잔 비는 꼴을 못 보겠네, 당장 채우고 입으로 직행 🚰"
];

// 🃏 극악의 확률 함정 카드 리스트
const trapCards = [
    "🚨 전원 원샷 🚨<br><span style='font-size:0.5em; color:#555;'>잔 비우고 머리 위에 털어라</span>",
    "🚨 양옆 사람 마시기 🚨<br><span style='font-size:0.5em; color:#555;'>걸린 사람 양옆 흑기사 당첨 ㅋㅋㅋ</span>",
    "🚨 이번 게임 벌칙 2배 🚨<br><span style='font-size:0.5em; color:#555;'>다음 걸리는 사람 무조건 두 잔</span>",
    "🚨 나 빼고 다 마시기 🚨<br><span style='font-size:0.5em; color:#555;'>걸린 사람 빼고 전원 짠~</span>",
    "🚨 옵션 추가 발동 🚨<br><span style='font-size:0.5em; color:#555;'>걸린 사람이 지금 당장 룰 하나 추가하기</span>"
];

// 1. 인원수 입력하고 시작
startBtn.addEventListener('click', function() {
    let count = parseInt(playerCountInput.value); // ⭐ 값을 변경할 수 있도록 let으로 수정

    if (isNaN(count) || count < 2) {
        alert("최소 2명 이상 입력해주세요! 🍻");
        return;
    }

    // ⭐ 핵심 보정 로직: 10명이 넘어가면 무조건 10명짜리 게임이 돌아가도록 제한!
    let filterCount = count;
    if (filterCount > 10) {
        filterCount = 10;
    }

    currentFilteredGames = allGames
        .filter(game => filterCount >= game.min && filterCount <= game.max)
        .map(game => game.name);

    setupScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    resultText.innerHTML = `현재 <b style="color:#FF5A5F">${count}명</b>!<br>어떤 게임이 나올까요?`;
});

// 2. 뒤로 가기 (탈출)
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

// 3. 룰렛 로직
drawBtn.addEventListener('click', function() {
    if (isSpinning) return; 

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

        if (navigator.vibrate) navigator.vibrate(15); 
        playTick(); 

        if (spinCount < maxSpins) {
            if (spinCount > maxSpins - 10) delay += 40; 
            spinTimeoutId = setTimeout(spin, delay); 
        } else {
            const isTrapCard = Math.random() < 0.10; 

            if (isTrapCard) {
                const randomTrap = trapCards[Math.floor(Math.random() * trapCards.length)];
                resultText.innerHTML = `<span style="color:#FF0000; font-size:1.3em; font-weight:900; text-shadow: 2px 2px 4px rgba(255,0,0,0.3); line-height: 1.4;">💀 함정 카드 💀<br>${randomTrap}</span>`;
                if (navigator.vibrate) navigator.vibrate([500]); 
                playBuzzer();
            } else {
                const finalIndex = Math.floor(Math.random() * currentFilteredGames.length);
                const finalGame = currentFilteredGames[finalIndex];
                const randomComment = spicyComments[Math.floor(Math.random() * spicyComments.length)];

                resultText.innerHTML = `<span style="color:#FF5A5F; font-size:1.2em; font-weight:900;">${finalGame}</span><br><span style="font-size:0.4em; color:#8B95A1; font-weight:normal; margin-top:10px; display:block;">${randomComment}</span>`;
                if (navigator.vibrate) navigator.vibrate([100, 50, 200]); 
                playTada();
            }

            isSpinning = false;
            drawBtn.innerText = "다시 돌리기 🎲"; 
            drawBtn.style.background = "#FF5A5F"; 
            drawBtn.style.boxShadow = "0 8px 20px rgba(255, 90, 95, 0.25)";
        }
    }
    spin(); 
});
