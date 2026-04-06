<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cinema Guess Game</title>
    <link rel="stylesheet" href="styles/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Noto+Sans+Armenian:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
<div id="bg-overlay"></div>

<div id="start-menu" class="overlay">
    <div class="menu-content">
        <h1 class="logo">Cinema Guess</h1>
        <p class="playful-subtitle">Global Stars or Local Legends?</p>
        <div class="menu-buttons">
            <button class="menu-btn" id="global">Global Edition</button>
            <button class="menu-btn armenian-edition" onclick="startGame('armenian')">🇦🇲 Armenian Edition</button>
        </div>
    </div>
</div>

<div id="game-container" class="game-container" style="display: none;">
    <button class="round-home-btn" onclick="showExitModal()">✕</button>

    <header>
        <div class="score-board">Score: <span id="score-display">0</span></div>
        <div id="timer-display" class="timer-box" style="display:none;">⏱️ <span id="seconds">10</span>s</div>
        <div id="level-display" class="level-tag">1/2</div>
    </header>

    <main class="game-view">
        <div id="feedback-area" style="min-height: 40px; margin-bottom: 10px;">
            <h2 id="feedback-text" style="margin:0; font-size: 1.5rem;"></h2>
        </div>

        <div id="question-area">
            <div id="question-box" class="movie-screen"></div>
            <div id="question-content-hide"></div>
        </div>
        <div id="answers-buttons" class="options-grid"></div>
    </main>

    <footer id="result-controls" style="display: none;">
        <div class="nav-buttons-row">
            <button id="prev-btn" onclick="prevQuestion()" class="btn-secondary">← Previous</button>
            <button id="next-action-btn" onclick="nextQuestion()" class="next-btn">Next Level →</button>
        </div>
    </footer>
</div>

<div id="exit-modal" class="modal-overlay" style="display: none;">
    <div class="modal-box">
        <h3>Leaving so soon?</h3>
        <p>Your progress will not be saved.</p>
        <div class="modal-actions">
            <button class="menu-btn leave-btn" onclick="goToMenu()">Yeah, leave</button>
            <button class="menu-btn stay-btn" onclick="hideExitModal()">No, I'll stay</button>
        </div>
    </div>
</div>

<div id="results-modal" class="modal-overlay" style="display: none;">
    <div class="modal-box">
        <h2 class="logo">Final Score</h2>
        <div class="score-circle"><span id="final-score-val">0</span></div>
        <p id="rank-text">Analyzing your movie knowledge...</p>
        <div class="modal-actions">
            <button class="menu-btn leave-btn" onclick="location.reload()">Play Again</button>
            <button class="menu-btn stay-btn" onclick="goToMenu()">Main Menu</button>
        </div>
    </div>
</div>
<div id="meme-container"></div>
<script src="scripts/main.js"></script>

</body>
</html>
