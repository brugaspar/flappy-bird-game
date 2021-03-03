console.log('[FlappyBird]');

let frames = 0;

const hitSound = new Audio();
hitSound.src = './effects/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const getReady = {
  spriteX: 134,
  spriteY: 0,
  width: 174,
  height: 152,
  positionX: (canvas.width / 2) - 174 / 2,
  positionY: 50,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,
      this.width, this.height,
      this.positionX, this.positionY,
      this.width, this.height
    );
  }
};

const gameOver = {
  spriteX: 134,
  spriteY: 153,
  width: 226,
  height: 200,
  positionX: (canvas.width / 2) - 223 / 2,
  positionY: 50,
  draw() {
    if (globals.scoreboard.score > globals.best) {
      globals.best = globals.scoreboard.score;
    }

    context.beginPath();

    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,
      this.width, this.height,
      this.positionX, this.positionY,
      this.width, this.height
    );

    context.arc(96, 160, 20, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
    context.fillStyle = '#000';
    context.closePath();

    context.beginPath();
    context.font = '24px "VT323"';
    context.textAlign = 'right';
    context.fillText(`${globals.scoreboard.score}`, canvas.width - 70, 145);
    context.fillStyle = '#000';
    context.closePath();

    context.beginPath();
    context.font = '24px "VT323"';
    context.textAlign = 'right';
    context.fillText(`${globals.best}`, canvas.width - 70, 190);
    context.fillStyle = '#DAA520';
    context.closePath();
  }
};

const background = {
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  positionX: 0,
  positionY: canvas.height - 204,
  draw() {
    context.fillStyle = '#70c5ce';
    context.fillRect(0, 0, canvas.width, canvas.height);;

    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,
      this.width, this.height,
      this.positionX, this.positionY,
      this.width, this.height
    );

    context.drawImage(
      sprites,
      this.spriteX, this.spriteY,
      this.width, this.height,
      (this.positionX + this.width), this.positionY,
      this.width, this.height
    );
  }
};

function makeColision(flappyBird, floor) {
  const flappyBirdY = flappyBird.positionY + flappyBird.height;

  if (flappyBirdY >= floor.positionY) return true;

  return false;
}

function createFloor() {
  const floor = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    positionX: 0,
    positionY: canvas.height - 112,
    update() {
      const movementSize = 1;
      const repeatIn = this.width / 2;
      const movement = this.positionX - movementSize;

      this.positionX = movement % repeatIn
    },
    draw() {
      context.drawImage(
        sprites,
        this.spriteX, this.spriteY,
        this.width, this.height,
        this.positionX, this.positionY,
        this.width, this.height
      );

      context.drawImage(
        sprites,
        this.spriteX, this.spriteY,
        this.width, this.height,
        (this.positionX + this.width), this.positionY,
        this.width, this.height
      );
    }
  };

  return floor;
}

function createPipes() {
  const pipes = {
    width: 52,
    height: 400,
    floor: {
      spriteX: 0,
      spriteY: 169
    },
    sky: {
      spriteX: 52,
      spriteY: 169
    },
    space: 80,
    pairs: [],
    draw() {
      this.pairs.forEach(pair => {
        const randomY = pair.y;

        const spaceBetween = 90;

        const skyPipesX = pair.x;
        const skyPipesY = randomY;

        context.drawImage(
          sprites,
          this.sky.spriteX, this.sky.spriteY,
          this.width, this.height,
          skyPipesX, skyPipesY,
          this.width, this.height
        );

        const floorPipesX = pair.x;
        const floorPipesY = pipes.height + spaceBetween + randomY;

        pair.skyPipe = {
          x: skyPipesX,
          y: this.height + skyPipesY
        };

        pair.floorPipe = {
          x: floorPipesX,
          y: floorPipesY
        };

        context.drawImage(
          sprites,
          this.floor.spriteX, this.floor.spriteY,
          this.width, this.height,
          floorPipesX, floorPipesY,
          this.width, this.height
        );
      });
    },
    update() {
      const reached100Frames = frames % 100 === 0;

      if (reached100Frames) {
        this.pairs.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1)
        });
      }

      this.pairs.forEach(pair => {
        pair.x -= 2;

        if (this.hasColisionWithFlappyBird(pair)) {
          hitSound.play();

          changeToScreen(Screens.GAME_OVER);
        }

        if (pair.x + this.width <= 0) {
          this.pairs.shift();
        }
      });
    },
    hasColisionWithFlappyBird(pair) {
      const flappyBirdHead = globals.flappyBird.positionY;
      const flappyBirdFoot = globals.flappyBird.positionY + globals.flappyBird.height;

      if ((globals.flappyBird.positionX + globals.flappyBird.width - 5) >= pair.x) {
        if (flappyBirdHead <= pair.skyPipe.y) {
          return true;
        }

        if (flappyBirdFoot >= pair.floorPipe.y) {
          return true;
        }
      }

      return false;
    }
  };

  return pipes;
}

function createFlappyBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    positionX: 10,
    positionY: 50,
    gravity: 0.25,
    speed: 0,
    jumpHeight: 4.6,
    moves: [
      { spriteX: 0, spriteY: 0 },
      { spriteX: 0, spriteY: 26 },
      { spriteX: 0, spriteY: 52 },
      { spriteX: 0, spriteY: 26 }
    ],
    atualFrame: 0,
    updateAtualFrame() {
      const interval = 10;
      const reachedInterval = frames % interval === 0;

      if (reachedInterval) {
        const incrementBase = 1;
        const increment = incrementBase + this.atualFrame;
        const repeteIn = this.moves.length;

        this.atualFrame = increment % repeteIn;
      }
    },
    jump() {
      this.speed = -this.jumpHeight;
    },
    update() {
      if (makeColision(globals.flappyBird, globals.floor)) {
        hitSound.play();

        changeToScreen(Screens.GAME_OVER);

        return;
      }

      this.speed += this.gravity;
      this.positionY += this.speed;
    },
    draw() {
      this.updateAtualFrame();

      const { spriteX, spriteY } = this.moves[this.atualFrame];

      context.drawImage(
        sprites,
        spriteX, spriteY,
        this.width, this.height,
        this.positionX, this.positionY,
        this.width, this.height
      );
    }
  };

  return flappyBird;
}

function createScoreboard() {
  const scoreboard = {
    score: 0,
    draw() {
      context.font = '35px "VT323"';
      context.textAlign = 'right';
      context.fillStyle = '#fff';
      context.fillText(`Placar: ${this.score}`, canvas.width - 15, 35);
    },
    update() {
      const interval = 80;
      const reachedInterval = frames % interval === 0;

      if (reachedInterval) {
        this.score += 1;
      }
    }
  };

  return scoreboard;
}

let activeScreen = {};

const globals = {
  best: 0
};

function changeToScreen(newScreen) {
  activeScreen = newScreen;

  activeScreen.initialize && activeScreen.initialize();
}

const Screens = {
  MAIN: {
    initialize() {
      globals.flappyBird = createFlappyBird();
      globals.floor = createFloor();
      globals.pipes = createPipes();
    },
    draw() {
      background.draw();
      globals.floor.draw();
      globals.flappyBird.draw();
      getReady.draw();
    },
    click() {
      changeToScreen(Screens.GAME);
    },
    update() {
      globals.floor.update();
    }
  }
};

Screens.GAME = {
  initialize() {
    globals.scoreboard = createScoreboard();
  },
  draw() {
    background.draw();
    globals.pipes.draw();
    globals.floor.draw();
    globals.flappyBird.draw();
    globals.scoreboard.draw();
  },
  click() {
    globals.flappyBird.jump();
  },
  update() {
    globals.pipes.update();
    globals.floor.update();
    globals.flappyBird.update();
    globals.scoreboard.update();
  }
};

Screens.GAME_OVER = {
  draw() {
    gameOver.draw();
  },
  update() {},
  click() {
    changeToScreen(Screens.MAIN);
  }
}

function loop() {
  activeScreen.draw();
  activeScreen.update();

  frames++;

  requestAnimationFrame(loop);
}

window.addEventListener('click', () => {
  activeScreen.click && activeScreen.click();
});

changeToScreen(Screens.MAIN);
loop();