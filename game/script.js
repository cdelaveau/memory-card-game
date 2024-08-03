class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        document.getElementById('startSceneContainer').style.display = 'flex';

        const difficultyButtons = document.querySelectorAll('.difficultyButton');
        difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const difficulty = button.dataset.difficulty;
                document.getElementById('startSceneContainer').style.display = 'none';
                this.scene.start('MemoryGame', { difficulty: difficulty });
            });
        });
    }
}

class MemoryGame extends Phaser.Scene {
    constructor() {
        super('MemoryGame');
    }

    init(data) {
        this.difficulty = data.difficulty;
        this.setMoveLimit();
    }

    setMoveLimit() {
        switch (this.difficulty) {
            case 'beginner':
                this.moveLimit = 14;
                break;
            case 'intermediate':
                this.moveLimit = 12;
                break;
            case 'pro':
                this.moveLimit = 10;
                break;
            default:
                this.moveLimit = 14;
                break;
        }
    }

    preload() {
        this.load.image('cardBack', '/final/carte de jeu/card.png');
        this.load.image('a', '/final/carte de jeu/a.png');
        this.load.image('b', '/final/carte de jeu/b.png');
        this.load.image('c', '/final/carte de jeu/c.png');
        this.load.image('d', '/final/carte de jeu/d.png');
        this.load.image('e', '/final/carte de jeu/e.png');
        this.load.image('f', '/final/carte de jeu/f.png');
        this.load.image('g', '/final/carte de jeu/g.png');
        this.load.image('background', '/final/scenes/background.png');
    }

    create() {
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.resizeBackground();
        window.addEventListener('resize', this.resizeBackground.bind(this));

        this.cards = [];
        this.selectedCards = [];
        this.movesCount = 0;
        this.createBoard();
        this.movesText = this.add.text(10, 50, 'Movements: 0', { fontSize: '32px', fill: '#FFF' });
        this.movesText.setDepth(1000);

        this.gameOverContainer = document.getElementById('endSceneContainer');
        this.winSceneContainer = document.getElementById('winSceneContainer');
        this.restartButton = document.getElementById('restartButton');
        this.restartButton.addEventListener('click', () => this.restartGame());

        // Correction des IDs ici
        this.menuButtonEnd = document.getElementById('menuButtonEnd');
        console.log(this.menuButtonEnd); // Vérification de l'élément

        if (this.menuButtonEnd) {
            this.menuButtonEnd.addEventListener('click', () => this.goToMenu());
        } else {
            console.error('menuButtonEnd is null');
        }

        this.menuButtonWin = document.getElementById('menuButtonWin');
        console.log(this.menuButtonWin); // Vérification de l'élément

        if (this.menuButtonWin) {
            this.menuButtonWin.addEventListener('click', () => this.goToMenu());
        } else {
            console.error('menuButtonWin is null');
        }

        this.hideGameOver();
        this.hideWinScene();
    }

    createBoard() {
        const images = ['a', 'a', 'b', 'b', 'c', 'c', 'd', 'd', 'e', 'e', 'f', 'f', 'g', 'g'];
        Phaser.Utils.Array.Shuffle(images);

        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = ''; // Efface les cartes existantes

        images.forEach((imageKey) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.image = imageKey;

            const cardImage = document.createElement('img');
            cardImage.src = this.textures.get('cardBack').getSourceImage().src;
            cardImage.alt = "Memory card"; // Ajout d'un attribut alt pour l'accessibilité
            cardElement.appendChild(cardImage);

            cardElement.addEventListener('click', () => this.flipCard(cardElement));

            gameBoard.appendChild(cardElement);

            this.cards.push(cardElement);
        });
    }

    flipCard(cardElement) {
        if (this.selectedCards.length < 2 && !cardElement.classList.contains('flipped')) {
            const imageKey = cardElement.dataset.image;
            const image = this.textures.get(imageKey).getSourceImage().src;

            cardElement.querySelector('img').src = image;
            cardElement.classList.add('flipped');

            this.selectedCards.push(cardElement);

            if (this.selectedCards.length === 2) {
                this.movesCount++;
                this.movesText.setText('Movements: ' + this.movesCount);
                this.checkForMatch();
            }
        }
    }

    checkForMatch() {
        const [firstCard, secondCard] = this.selectedCards;

        if (firstCard.dataset.image === secondCard.dataset.image) {
            this.selectedCards = [];
            if (this.cards.every(card => card.classList.contains('flipped'))) {
                if (this.movesCount <= this.moveLimit) {
                    this.showWinScene();
                } else {
                    this.showGameOver();
                }
            }
        } else {
            setTimeout(() => {
                firstCard.querySelector('img').src = this.textures.get('cardBack').getSourceImage().src;
                secondCard.querySelector('img').src = this.textures.get('cardBack').getSourceImage().src;

                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');

                this.selectedCards = [];
            }, 1000);
        }
    }

    showGameOver() {
        this.gameOverContainer.style.display = 'flex';
        setTimeout(() => {
            this.restartButton.style.display = 'block';
            this.menuButtonEnd.style.display = 'block'; // Affiche le bouton Menu
        }, 5000);
    }

    showWinScene() {
        this.winSceneContainer.style.display = 'flex';
        const moveCountElement = document.getElementById('moveCount');
        moveCountElement.innerText = ` ${this.movesCount}`;
        setTimeout(() => {
            this.menuButtonWin.style.display = 'block'; // Affiche le bouton Menu pour l'écran de victoire
        }, 5000);
    }

    hideGameOver() {
        this.gameOverContainer.style.display = 'none';
        this.restartButton.style.display = 'none';
        this.menuButtonEnd.style.display = 'none'; // Masque le bouton Menu
    }

    hideWinScene() {
        this.winSceneContainer.style.display = 'none';
        this.menuButtonWin.style.display = 'none'; // Masque le bouton Menu pour l'écran de victoire
    }

    restartGame() {
        this.hideGameOver();
        this.hideWinScene();
        this.cards = [];
        this.selectedCards = [];
        this.movesCount = 0;
        this.movesText.setText('Movements: 0');
        this.createBoard();
    }

    goToMenu() {
        this.hideGameOver();
        this.hideWinScene();
        this.scene.start('StartScene'); // Retourne à la scène de démarrage
    }

    resizeBackground() {
        const scaleX = this.cameras.main.width / this.background.width;
        const scaleY = this.cameras.main.height / this.background.height;
        const scale = Math.max(scaleX, scaleY);
        this.background.setScale(scale).setScrollFactor(0);
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [StartScene, MemoryGame],
    parent: 'gameContainer',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);
