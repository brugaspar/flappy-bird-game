console.log('[FlappyBird]');

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

const floor = {
  spriteX: 0,
  spriteY: 610,
  width: 224,
  height: 112,
  positionX: 0,
  positionY: canvas.height - 112,
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

const flappyBird = {
  spriteX: 0,
  spriteY: 0,
  width: 33,
  height: 24,
  positionX: 10,
  positionY: 50,
  gravity: 0.25,
  speed: 0,
  update() {
    this.speed += this.gravity;
    this.positionY += this.speed;
  },
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

let activeScreen = {};

function changeToScreen(newScreen) {
  activeScreen = newScreen;
}

const Screens = {
  MAIN: {
    draw() {
      background.draw();
      floor.draw();
      flappyBird.draw();
      getReady.draw();
    },
    click() {
      changeToScreen(Screens.GAME);
    },
    update() {}
  }
};

Screens.GAME = {
  draw() {
    background.draw();
    floor.draw();
    flappyBird.draw();
  },
  update() {
    flappyBird.update();
  }
};

function loop() {
  activeScreen.draw();
  activeScreen.update();

  requestAnimationFrame(loop);
}

window.addEventListener('click', () => {
  activeScreen.click && activeScreen.click();
});

changeToScreen(Screens.MAIN);
loop();