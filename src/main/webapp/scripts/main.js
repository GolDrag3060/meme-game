const allData = {
    global: [
        {
            type: "audio",
            revealVideo: "video/is.mp4",
            options: ["Star Wars", "Schindler's list", "Dune", "Interstellar"],
            correct: 3,
            timed: false
        }
    ],
    armenian: [
        {
            type: "audio",
            revealVideo: "video/kargin1.MP4",
            options: ["Կարգին Հաղորդում", "Ալաբալանից", "Տնփեսա", "Ֆուլ Հաուս"],
            correct: 0,
            timed: false
        },
        {
            type: "image",
            content: "image/mms.jpg",
            revealPic: "image/mms_a.jpg",
            options: ["գոմաղբ", "թրիք", "արյուն", "խալ"],
            correct: 1,
            timed: true
        }
    ]
};
async function safeFetch(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            status: response.status,
            data: data
        };
    } catch (error) {
        console.error("Fetch failed:", error);
        return {status: 500, data: null, error: error.message};
    }
}

function loadMemes() {
    safeFetch('api/memes').then((response) => {
        const container = document.getElementById('meme-container');
        if (!container) return;
        if (response.status === 200) {
            container.innerHTML = response.data.map(({type, path}) => `
                <div class="meme-card">
                    <h3>${type}</h3>
                    <img src="${path}" alt="">
                </div>
            `).join('');
        } else {
            container.innerHTML = "There's no memes";
        }
    });
}

loadMemes();

let score = 0;
let currentLevel = 0;
let gameQuestions = [];
let userAnswers = [];
let timer;
let timeLeft = 10;


function clearUI() {
    // This is the "Nuclear Reset" to prevent doubling
    const box = document.getElementById("question-box");
    const btnBox = document.getElementById("answers-buttons");
    if (box) box.innerHTML = "";
    if (btnBox) btnBox.innerHTML = "";

    stopAllMedia();
    clearInterval(timer);
}

function stopAllMedia() {
    document.querySelectorAll('audio, video').forEach(m => {
        m.pause();
        m.currentTime = 0;
    });
}

// --- NAVIGATION ---

function startGame(mode) {
    gameQuestions = allData[mode];
    gameQuestions = allData[mode];
    score = 0;
    currentLevel = 0;
    userAnswers = new Array(gameQuestions.length).fill(null);

    document.getElementById("score-display").innerText = score;
    document.getElementById("start-menu").style.display = "none";
    document.getElementById("game-container").style.display = "flex";
    document.getElementById("bg-overlay").style.filter = "blur(15px)";

    loadLevel();
}

function showExitModal() {
    if (userAnswers.some(a => a !== null)) {
        document.getElementById("exit-modal").style.display = "flex";
    } else {
        goToMenu();
    }
}

function hideExitModal() {
    document.getElementById("exit-modal").style.display = "none";
}

function goToMenu() {
    clearUI();
    hideExitModal();
    document.getElementById("game-container").style.display = "none";
    document.getElementById("results-modal").style.display = "none";
    document.getElementById("start-menu").style.display = "flex";
    document.getElementById("bg-overlay").style.filter = "blur(0px)";
}

// --- GAME LOGIC ---

function loadLevel() {
    clearUI();

    const q = gameQuestions[currentLevel];
    const timerUI = document.getElementById("timer-display");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-action-btn");

    prevBtn.disabled = (currentLevel === 0);
    document.getElementById("level-display").innerText = `${currentLevel + 1}/${gameQuestions.length}`;

    // Update Next Button Text
    if (currentLevel === gameQuestions.length - 1) {
        nextBtn.innerText = "See Results";
        nextBtn.classList.add("btn-results-glow");
    } else {
        nextBtn.innerText = "Next Level →";
        nextBtn.classList.remove("btn-results-glow");
    }

    if (userAnswers[currentLevel] !== null) {
        timerUI.style.display = "none";
        renderAnsweredState(q, userAnswers[currentLevel]);
    } else {
        if (q.timed) {
            timerUI.style.display = "block";
            startCountdown();
        } else {
            timerUI.style.display = "none";
        }
        renderNewQuestion(q);
    }
}

function renderNewQuestion(q) {
    const box = document.getElementById("question-box");
    const btnBox = document.getElementById("answers-buttons");
    document.getElementById("result-controls").style.display = "none";

    // Double-check clear
    btnBox.innerHTML = "";

    if (q.type === "audio") {
        box.innerHTML = `<p>Guess the sound</p><audio autoplay controls style="width:90%"><source src="${q.content}"></audio>`;
    } else {
        box.innerHTML = `<img src="${q.content}" style="width:100%; height:100%; object-fit:cover;">`;
    }

    q.options.forEach((opt, idx) => {
        const b = document.createElement("button");
        b.innerText = opt;
        b.className = "ans-btn";
        b.onclick = () => checkAnswer(idx);
        btnBox.appendChild(b);
    });
}

function renderAnsweredState(q, selectedIdx) {
    const box = document.getElementById("question-box");
    const btnBox = document.getElementById("answers-buttons");
    const feedback = document.getElementById("feedback-text"); // Ensure this ID exists in HTML for the "Cool" UI
    document.getElementById("result-controls").style.display = "flex";

    btnBox.innerHTML = "";

    const isCorrect = selectedIdx === q.correct;
    const color = isCorrect ? "var(--success-green)" : "var(--error-red)";
    const msg = isCorrect ? "Ճիշտ է! ✨" : (selectedIdx === -1 ? "Time's Up! ⏱️" : "Սխալ է! 🍿");

    // Display feedback message
    if (feedback) {
        feedback.innerText = msg;
        feedback.style.color = color;
    }

    // LOGIC FIX: Check if we should show a Video or an Image reveal
    if (q.revealVideo) {
        box.innerHTML = `<video width="100%" height="100%" autoplay controls style="object-fit:contain;">
                            <source src="${q.revealVideo}" type="video/mp4">
                         </video>`;
    } else if (q.revealPic) {
        box.innerHTML = `<img src="${q.revealPic}" style="width:100%; height:100%; object-fit:contain;">`;
    } else {
        // Fallback if no reveal media is defined
        box.innerHTML = `<p style="padding:20px">The answer was: ${q.options[q.correct]}</p>`;
    }

    // Render disabled buttons
    q.options.forEach((opt, idx) => {
        const b = document.createElement("button");
        b.innerText = opt;
        b.className = "ans-btn";
        b.disabled = true;
        if (idx === q.correct) b.style.background = "var(--success-green)";
        if (idx === selectedIdx && !isCorrect) b.style.background = "var(--error-red)";
        btnBox.appendChild(b);
    });
}
function startCountdown() {
    timeLeft = 10;
    document.getElementById("seconds").innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("seconds").innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(-1);
        }
    }, 1000);
}

function checkAnswer(idx) {
    // Safety: don't allow re-answering a question that already has a saved answer
    if (userAnswers[currentLevel] !== null) return;

    clearInterval(timer);
    userAnswers[currentLevel] = idx;

    if (idx === gameQuestions[currentLevel].correct) {
        score += 10;
        document.getElementById("score-display").innerText = score;
    }
    renderAnsweredState(gameQuestions[currentLevel], idx);
}

function prevQuestion() {
    if (currentLevel > 0) {
        currentLevel--;
        loadLevel();
    }
}

function nextQuestion() {
    if (currentLevel < gameQuestions.length - 1) {
        currentLevel++;
        loadLevel();
    } else {
        showFinalResults();
    }
}

function showFinalResults() {
    clearUI();
    const modal = document.getElementById("results-modal");
    document.getElementById("final-score-val").innerText = score;

    const rankText = document.getElementById("rank-text");
    const maxScore = gameQuestions.length * 10;

    if (score === maxScore) rankText.innerText = "Cinema Legend! You know it all.";
    else if (score >= maxScore / 2) rankText.innerText = "True Movie Buff! Great job.";
    else rankText.innerText = "Novice Critic. Keep watching!";

    modal.style.display = "flex";

}
document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('#global').addEventListener('click',()=> startGame('global'));
});
