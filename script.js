// ================= HTML 요소 가져오기 =================
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-button');
const drawBtn = document.getElementById('draw-button');
const resultText = document.getElementById('result-text');
const playerCountInput = document.getElementById('player-count');

// 터치 게임 요소
const touchGameScreen = document.getElementById('touch-game-screen');
const touchCanvas = document.getElementById('touch-canvas');
const touchBackBtn = document.getElementById('touch-back-btn');
const touchInstruction = document.getElementById('touch-instruction');

// 홀짝 게임 요소
const oeScreen = document.getElementById('odd-even-screen');
const oeBackBtn = document.getElementById('oe-back-btn');
const oeCheckBtn = document.getElementById('oe-check-btn');
const oeQuestion = document.getElementById('oe-question');
const oeResult = document.getElementById('oe-result');

// ================= 전역 변수 =================
let isSpinning = false;
let currentFilteredGames = [];
let spinTimeoutId = null;

let playerCount = 2;

// 터치게임 관련 변수
let activeFingers = {};
let touchPickTimer = null;
let touchGameFinished = false;

const colors = [
    '#FF3B30',
    '#FF9500',
    '#FFCC00',
    '#4CD964',
    '#5AC8FA',
    '#007AFF',
    '#5856D6',
    '#FF2D55'
];

// ================= 오디오 세팅 =================
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

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

// ================= 게임 목록 =================
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

const spicyComments = [
    "이번 판은 제대로 가보자 🔥",
    "걸린 사람은 분위기 살리기 담당 😎",
    "오늘의 주인공은 과연 누구일까 👀",
    "피할 수 없다면 즐겨라 🎲",
    "이건 운명이다... 받아들여라 🍻",
    "방금 눈 마주친 사람 조심해라 😏",
    "분위기 끊기 금지 🚫",
    "다음 판도 바로 간다 🔥",
    "오늘 레전드 하나 나온다 📸",
    "룰 모르면 옆 사람한테 바로 물어보기 👂"
];

const trapCards = [
    "🚨 전원 한 모금 🚨<br><span style='font-size:0.5em; color:#aaa;'>다 같이 분위기 올리기</span>",
    "🚨 양옆 사람 미션 🚨<br><span style='font-size:0.5em; color:#aaa;'>걸린 사람 양옆도 같이 참여</span>",
    "🚨 이번 게임 벌칙 2배 🚨<br><span style='font-size:0.5em; color:#aaa;'>다음 걸리는 사람 조심</span>",
    "🚨 나 빼고 다 참여 🚨<br><span style='font-size:0.5em; color:#aaa;'>걸린 사람은 잠깐 구경</span>",
    "🚨 옵션 추가 발동 🚨<br><span style='font-size:0.5em; color:#aaa;'>걸린 사람이 룰 하나 추가</span>"
];

// ================= 시작 버튼 =================
startBtn.addEventListener('click', function () {
    const count = parseInt(playerCountInput.value);

    if (isNaN(count) || count < 2) {
        alert("최소 2명 이상 입력해주세요! 🍻");
        return;
    }

    playerCount = count;

    let filterCount = count;

    // 10명 초과는 10명 기준 게임으로 추천
    if (filterCount > 10) {
        filterCount = 10;
    }

    currentFilteredGames = allGames
        .filter(game => filterCount >= game.min && filterCount <= game.max)
        .map(game => game.name);

    if (currentFilteredGames.length === 0) {
        alert("추천할 수 있는 게임이 없어요!");
        return;
    }

    setupScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    resultText.innerHTML = `
        현재 <b style="color:#FF5A5F">${count}명</b>!<br>
        어떤 게임이 나올까요?
    `;
});

// ================= 메인 뒤로가기 =================
backBtn.addEventListener('click', function () {
    if (isSpinning) {
        clearTimeout(spinTimeoutId);
        isSpinning = false;

        drawBtn.innerText = "운명의 뽑기 🎲";
        drawBtn.style.background = "linear-gradient(135deg, #FF5A5F, #E03136)";
        drawBtn.style.boxShadow = "0 8px 25px rgba(255, 90, 95, 0.5)";
    }

    gameScreen.style.display = 'none';
    setupScreen.style.display = 'block';

    resultText.innerHTML = "어떤 게임이 나올까요?<br>아래 버튼을 눌러주세요!";
});

// ================= 룰렛 뽑기 =================
drawBtn.addEventListener('click', function () {
    if (isSpinning) return;

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (currentFilteredGames.length === 0) {
        alert("먼저 인원을 설정해주세요!");
        return;
    }

    isSpinning = true;

    drawBtn.innerText = "뽑는 중... ⏳";
    drawBtn.style.background = "#2C2C2C";
    drawBtn.style.boxShadow = "none";

    let spinCount = 0;
    const maxSpins = 30;
    let delay = 40;

    function spin() {
        const randomIndex = Math.floor(Math.random() * currentFilteredGames.length);
        resultText.innerText = currentFilteredGames[randomIndex];

        spinCount++;

        if (navigator.vibrate) {
            navigator.vibrate(15);
        }

        playTick();

        if (spinCount < maxSpins) {
            if (spinCount > maxSpins - 10) {
                delay += 40;
            }

            spinTimeoutId = setTimeout(spin, delay);
        } else {
            finishSpin();
        }
    }

    spin();
});

function finishSpin() {
    const isTrapCard = Math.random() < 0.10;
    let finalGame = "";

    if (isTrapCard) {
        const randomTrap = trapCards[Math.floor(Math.random() * trapCards.length)];

        resultText.innerHTML = `
            <span style="
                color:#FF0000;
                font-size:1.3em;
                font-weight:900;
                text-shadow: 2px 2px 4px rgba(255,0,0,0.3);
                line-height: 1.4;
            ">
                💀 함정 카드 💀<br>${randomTrap}
            </span>
        `;

        if (navigator.vibrate) {
            navigator.vibrate([500]);
        }

        playBuzzer();
    } else {
        const finalIndex = Math.floor(Math.random() * currentFilteredGames.length);
        finalGame = currentFilteredGames[finalIndex];

        const randomComment = spicyComments[Math.floor(Math.random() * spicyComments.length)];

        resultText.innerHTML = `
            <span style="color:#FF5A5F; font-size:1.2em; font-weight:900;">
                ${finalGame}
            </span>
            <br>
            <span style="
                font-size:0.4em;
                color:#8B95A1;
                font-weight:normal;
                margin-top:10px;
                display:block;
            ">
                ${randomComment}
            </span>
        `;

        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 200]);
        }

        playTada();
    }

    isSpinning = false;

    drawBtn.innerText = "다시 돌리기 🎲";
    drawBtn.style.background = "linear-gradient(135deg, #FF5A5F, #E03136)";
    drawBtn.style.boxShadow = "0 8px 25px rgba(255, 90, 95, 0.5)";

    if (finalGame === "터치게임 📱") {
        setTimeout(openTouchGame, 1500);
    } else if (finalGame === "홀짝 🎲") {
        setTimeout(openOddEvenGame, 1500);
    }
}

// ================= 터치 게임 열기 =================
function openTouchGame() {
    gameScreen.style.display = 'none';
    touchGameScreen.style.display = 'flex';

    resetTouchGame();

    touchInstruction.innerHTML = `
        모두 화면에<br>
        손가락을 올리세요! 👆<br>
        <span style="font-size:1rem; color:#8B95A1;">
            손가락이 ${Math.min(playerCount, 5)}개 이상 올라가면 자동으로 뽑아요
        </span>
    `;
}

// ================= 터치 게임 초기화 =================
function resetTouchGame() {
    activeFingers = {};
    touchCanvas.innerHTML = '';
    touchGameFinished = false;

    clearTimeout(touchPickTimer);
    touchPickTimer = null;
}

// ================= 터치 게임 뒤로가기 =================
touchBackBtn.addEventListener('click', function () {
    resetTouchGame();

    touchGameScreen.style.display = 'none';
    gameScreen.style.display = 'block';
});

// ================= 터치 시작 =================
touchCanvas.addEventListener('touchstart', function (e) {
    e.preventDefault();

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (touchGameFinished) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];

        // 이미 등록된 손가락이면 무시
        if (activeFingers[touch.identifier]) continue;

        const circle = document.createElement('div');
        circle.classList.add('finger-circle');

        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        circle.style.left = touch.clientX + 'px';
        circle.style.top = touch.clientY + 'px';
        circle.style.backgroundColor = randomColor;
        circle.style.boxShadow = `0 0 25px ${randomColor}`;

        touchCanvas.appendChild(circle);

        activeFingers[touch.identifier] = circle;
    }

    checkTouchReady();
});

// ================= 터치 이동 =================
touchCanvas.addEventListener('touchmove', function (e) {
    e.preventDefault();

    if (touchGameFinished) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const circle = activeFingers[touch.identifier];

        if (circle) {
            circle.style.left = touch.clientX + 'px';
            circle.style.top = touch.clientY + 'px';
        }
    }
});

// ================= 터치 끝 / 취소 =================
function removeTouch(e) {
    e.preventDefault();

    if (touchGameFinished) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const circle = activeFingers[touch.identifier];

        if (circle) {
            circle.remove();
            delete activeFingers[touch.identifier];
        }
    }

    // 손가락 수가 부족해지면 뽑기 취소
    const requiredCount = Math.min(playerCount, 5);

    if (Object.keys(activeFingers).length < requiredCount) {
        clearTimeout(touchPickTimer);
        touchPickTimer = null;

        touchInstruction.innerHTML = `
            모두 화면에<br>
            손가락을 올리세요! 👆<br>
            <span style="font-size:1rem; color:#8B95A1;">
                손가락이 ${requiredCount}개 이상 올라가면 자동으로 뽑아요
            </span>
        `;
    }
}

touchCanvas.addEventListener('touchend', removeTouch);
touchCanvas.addEventListener('touchcancel', removeTouch);

// ================= 터치게임 준비 확인 =================
function checkTouchReady() {
    const currentFingerCount = Object.keys(activeFingers).length;
    const requiredCount = Math.min(playerCount, 5);

    touchInstruction.innerHTML = `
        현재 ${currentFingerCount}개 감지됨 👆<br>
        <span style="font-size:1rem; color:#8B95A1;">
            ${requiredCount}개 이상이면 자동으로 뽑아요
        </span>
    `;

    if (currentFingerCount >= requiredCount && touchPickTimer === null) {
        touchInstruction.innerHTML = `
            선정 중... 🔥<br>
            <span style="font-size:1rem; color:#8B95A1;">
                손가락 떼면 취소됩니다
            </span>
        `;

        touchPickTimer = setTimeout(pickRandomFinger, 1500);
    }
}

// ================= 랜덤 손가락 뽑기 =================
function pickRandomFinger() {
    const fingerIds = Object.keys(activeFingers);

    if (fingerIds.length === 0) {
        resetTouchGame();
        return;
    }

    touchGameFinished = true;

    const pickedId = fingerIds[Math.floor(Math.random() * fingerIds.length)];
    const pickedCircle = activeFingers[pickedId];

    // 전체 손가락 흐리게 처리
    Object.values(activeFingers).forEach(circle => {
        circle.style.opacity = "0.2";
        circle.style.transform = "translate(-50%, -50%) scale(0.75)";
        circle.style.boxShadow = "none";
    });

    // 당첨 손가락 강조
    pickedCircle.style.opacity = "1";
    pickedCircle.style.transform = "translate(-50%, -50%) scale(1.6)";
    pickedCircle.style.backgroundColor = "#FF5A5F";
    pickedCircle.style.boxShadow = "0 0 45px rgba(255, 90, 95, 0.95)";
    pickedCircle.style.zIndex = "10";

    touchInstruction.innerHTML = `
        당첨! 🎉<br>
        <span style="font-size:1.2rem; color:#FF5A5F;">
            이 손가락 주인공!
        </span>
        <br>
        <button id="touch-retry-btn" style="
            margin-top:25px;
            background:linear-gradient(135deg, #3182F6, #1B64DA);
            color:white;
            border:none;
            border-radius:20px;
            padding:14px 24px;
            font-size:1rem;
            font-weight:800;
            cursor:pointer;
        ">
            다시 뽑기 🔁
        </button>
    `;

    const retryBtn = document.getElementById('touch-retry-btn');

    retryBtn.addEventListener('click', function () {
        resetTouchGame();

        touchInstruction.innerHTML = `
            모두 화면에<br>
            손가락을 올리세요! 👆<br>
            <span style="font-size:1rem; color:#8B95A1;">
                손가락이 ${Math.min(playerCount, 5)}개 이상 올라가면 자동으로 뽑아요
            </span>
        `;
    });

    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 300]);
    }

    playTada();

    touchPickTimer = null;
}

// ================= 홀짝 게임 열기 =================
function openOddEvenGame() {
    gameScreen.style.display = 'none';
    oeScreen.style.display = 'flex';

    oeQuestion.style.display = 'block';
    oeCheckBtn.style.display = 'block';
    oeResult.style.display = 'none';

    oeQuestion.innerText = "동전은 던져졌다... 과연 결과는?";
}

// ================= 홀짝 뒤로가기 =================
oeBackBtn.addEventListener('click', function () {
    oeScreen.style.display = 'none';
    gameScreen.style.display = 'block';
});

// ================= 홀짝 결과 확인 =================
oeCheckBtn.addEventListener('click', function () {
    const isOdd = Math.random() < 0.5;

    if (isOdd) {
        oeResult.innerText = "홀! 🖐️";
        oeResult.style.color = "#FFCC00";
        oeResult.style.textShadow = "0 0 25px rgba(255, 204, 0, 0.5)";
    } else {
        oeResult.innerText = "짝! ✌️";
        oeResult.style.color = "#5AC8FA";
        oeResult.style.textShadow = "0 0 25px rgba(90, 200, 250, 0.5)";
    }

    oeQuestion.style.display = 'none';
    oeCheckBtn.style.display = 'none';
    oeResult.style.display = 'block';

    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 200]);
    }

    playTada();
});
