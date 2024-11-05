const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let currentScene;
let currentWord;
let timeLeft;
let score;
let isDrawing = false;
let graphics;
let wordText;
let timerText;
let scoreText;
let guessInput;
let feedbackText;
let clearButton;
let colorButtons;

const words = ['kat', 'hond', 'boom', 'huis', 'zon', 'bloem', 'auto', 'vliegtuig', 'vis', 'vogel'];
const colors = [0x000000, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

function preload() {
    this.load.image('background', 'assets/background.png');
    // Laad hier andere assets in
}

function create() {
    currentScene = this;

    this.add.image(400, 300, 'background');

    const title = this.add.text(400, 50, 'PictoKids', { fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);

    wordText = this.add.text(400, 100, '', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
    timerText = this.add.text(700, 50, '', { fontSize: '24px', fill: '#ffffff' }).setOrigin(1, 0.5);
    scoreText = this.add.text(100, 50, 'Score: 0', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0, 0.5);

    graphics = this.add.graphics();

    // Teken gebied
    const drawArea = this.add.rectangle(400, 300, 600, 300, 0xffffff).setOrigin(0.5);
    drawArea.setInteractive();
    drawArea.on('pointerdown', startDrawing);
    drawArea.on('pointermove', draw);
    drawArea.on('pointerup', stopDrawing);

    // Kleur knoppen
    colorButtons = colors.map((color, index) => {
        const button = this.add.circle(50 + index * 60, 550, 20, color);
        button.setInteractive();
        button.on('pointerdown', () => {
            graphics.lineStyle(4, color);
        });
        return button;
    });

    // Wis knop
    clearButton = this.add.text(700, 550, 'Wis', { fontSize: '24px', fill: '#ffffff' })
        .setOrigin(1, 0.5)
        .setInteractive()
        .on('pointerdown', clearCanvas);

    // Raad invoer
    const inputElement = this.add.dom(400, 500, 'input', {
        type: 'text',
        placeholder: 'Raad het woord',
        style: 'width: 200px; padding: 10px;'
    });
    guessInput = inputElement.node;

    // Raad knop
    const guessButton = this.add.text(550, 500, 'Raad', { fontSize: '24px', fill: '#ffffff' })
        .setOrigin(0, 0.5)
        .setInteractive()
        .on('pointerdown', submitGuess);

    feedbackText = this.add.text(400, 450, '', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);

    startNewRound();
}

function update() {
    if (timeLeft > 0) {
        timeLeft -= 1/60;  // Verminder tijd met 1/60 seconde (aannemende 60 FPS)
        timerText.setText(`Tijd: ${Math.ceil(timeLeft)}`);
    } else {
        endRound();
    }
}

function startNewRound() {
    currentWord = getRandomWord();
    timeLeft = 60;
    wordText.setText(`Teken: ${currentWord}`);
    clearCanvas();
}

function startDrawing(pointer) {
    isDrawing = true;
    graphics.beginPath();
    graphics.moveTo(pointer.x, pointer.y);
}

function draw(pointer) {
    if (!isDrawing) return;
    graphics.lineTo(pointer.x, pointer.y);
    graphics.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    graphics.clear();
}

function submitGuess() {
    const guess = guessInput.value.toLowerCase();
    if (guess === currentWord.toLowerCase()) {
        feedbackText.setText('Correct!');
        score += Math.ceil(timeLeft);
        scoreText.setText(`Score: ${score}`);
        startNewRound();
    } else {
        feedbackText.setText('Probeer opnieuw!');
    }
    guessInput.value = '';
}

function endRound() {
    feedbackText.setText(`Tijd voorbij! Het woord was: ${currentWord}`);
    startNewRound();
}

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}
