var game = new Game(); //Primary game instance

function imageRepository() {
    this.images = {}; // texture containerd
    var sources = {
        bg: 'Resources/starBackground.png',
        ship: 'Resources/ship.png',
        enemy: 'Resources/player2.png',
        blueWpn: 'Resources/blueWeapon.png',
        redWpn: 'Resources/redWeapon.png',
        plasma: 'Resources/plasmaShot.png',
        plasmaExplosion: 'Resources/plasmaExplosion.png',
        uiDisplay: 'Resources/metalbeamcenter.jpg',
        healthBlue: 'Resources/blueHealthBar.png',
        healthGreen: 'Resources/greenHealthBar.png'

    };

    var numImages = Object.keys(sources).length;

    for (var src in sources) {
        this.images[src] = new Image();
        this.images[src].src = sources[src];
    }
}

function Bullet(image, x, y, direction) {
    var speed = 4;
    this.alive = false;
    this.sprite = new Kinetic.Image({
        image: image,
        x: x,
        y: y,
        width: 3,
        height: 12
    });

    this.spawn = function (x, y) {
        this.sprite.setX(x);
        this.sprite.setY(y);
    };

    this.move = function () {
        if (detectCollision(this.sprite, game.enemy.sprite)) {
            game.enemy.hitPoints -= 1;
            this.sprite.setX(-20);
            this.sprite.setY(-20);
        }

        if (detectCollision(this.sprite, game.ship.sprite)) {
            game.ship.hitPoints -= 1;
            this.sprite.setX(-20);
            this.sprite.setY(-20);
        }

        if (detectCollision(this.sprite, game.enemy.plasma.sprite)) {
            this.sprite.setX(-20);
            this.sprite.setY(-20);
            game.enemy.plasma.explode();
        }

        if (detectCollision(this.sprite, game.ship.plasma.sprite)) {
            this.sprite.setX(-20);
            this.sprite.setY(-20);
            game.ship.plasma.explode();
        }

        if (this.sprite.getY() < 10 && this.sprite.getY() !== -20 && this.sprite.getX() !== -20) {
            this.sprite.setX(-20);
            this.sprite.setY(-20);
        }
        else {
            this.sprite.setY(this.sprite.getY() + (speed * direction));
        }
    };
}

function Plasma(image, explosionImg, direction) {
    var speed = 2;
    this.isInUse = false;
    this.exploded = false;
    var counter = 0;
    this.explosion = new Kinetic.Image({
        image: explosionImg,
        x: 600,
        y: 600,
        width: 182,
        height: 182
    });
    this.sprite = new Kinetic.Image({
        image: image,
        x: 600,
        y: 600,
        width: 16,
        height: 16
    });

    this.spawn = function (x, y) {
        this.sprite.setX(x);
        this.sprite.setY(y);
    };

    this.explode = function() {
      this.explosion.setX(this.sprite.getX() - 100);
      this.explosion.setY(this.sprite.getY() - 100);
      this.sprite.setX(600);
      this.sprite.setY(600);
      this.exploded = true;
    };

    this.move = function () {

        if (this.exploded) {
          counter += 1;
        }
        if (this.exploded && counter > 30) {
          this.explosion.setX(600);
          this.explosion.setY(600);
          this.exploded = false;
          this.isInUse = false;
          counter = 0;
        }

        if (detectCollision(this.sprite, game.enemy.sprite)) {
            game.enemy.hitPoints -= 1;
            this.sprite.setX(600);
            this.sprite.setY(600);
        }

        if (detectCollision(this.sprite, game.ship.sprite)) {
            game.ship.hitPoints -= 1;
            this.sprite.setX(-20);
            this.sprite.setY(-20);
        }

        if (detectCollision(this.explosion, game.enemy.sprite)) {
            game.enemy.hitPoints -= 1;
            this.explosion.setX(600);
            this.explosion.setY(600);
            counter = 31;
        }

        if (detectCollision(this.explosion, game.ship.sprite)) {
            game.ship.hitPoints -= 1;
            this.explosion.setX(-20);
            this.explosion.setY(-20);
            counter = 31;
        }

        if (!this.exploded && this.sprite.getY() < 10 && this.sprite.getY() !== -20 && this.sprite.getX() !== -20 || !this.exploded && this.sprite.getX() < 2 || !this.exploded && this.sprite.getX() > 380) {
            this.sprite.setX(600);
            this.sprite.setY(600);
            this.isInUse = false;
        }
        else {
            this.sprite.setY(this.sprite.getY() + (speed * direction));
            this.sprite.setX(this.sprite.getX() + 3 *  Math.sin(this.sprite.getY() * 0.02));
        }
    };
}

function Pool(maxSize, image, direction) {
    var size = maxSize; // Max bullets allowed in the pool
    this.pool = [];

    this.init = function () {
        var bullet,
            enemy,
            enemyBullet, i;

        for (i = 0; i < size; i += 1) {
            bullet = new Bullet(image, -20, -20, direction);
            this.pool[i] = bullet;
        }
    };

    this.get = function (x, y) {
        if (!this.pool[size - 1].alive) {
            this.pool[size - 1].spawn(x, y);
            this.pool.unshift(this.pool.pop());
        }
    };

    this.animate = function () {
        for (var j = 0; j < size; j++) {
            this.pool[j].move();
        }
        for (var i = 0; i < size; i++) {
            if (this.pool[i].alive) {
                this.pool.push((this.pool.splice(i, 1))[0]);
            }
            else {
                this.pool[i].sprite.SetX = -20;
                this.pool[i].sprite.SetY = -20;
            }
            break;
        }
    };
}

function Ship(images, x, y) {
    this.speed = 3;
    this.bulletPool = new Pool(30, images.redWpn, -1);
    this.bulletPool.init();
    this.collidableWith = "redWpn";
    this.type = "ship";
    this.up = false;
    this.left = false;
    this.down = false;
    this.right = false;
    this.hitPoints = 10;
    this.plasma = new Plasma(images.plasma , images.plasmaExplosion, -1);
    this.sprite = new Kinetic.Image({
        image: images.ship,
        x: x,//175
        y: y,//520
        width: 50,
        height: 50
    });


    this.move = function () {
        this.bulletPool.animate();

        if (this.plasma.isInUse) {
          this.plasma.move();
        }

        if (this.right && this.sprite.getX() < 340) {
            this.sprite.setX(this.sprite.getX() + this.speed);
        }
        if (this.left && this.sprite.getX() > 10) {
            this.sprite.setX(this.sprite.getX() - this.speed);
        }
        if (this.up && this.sprite.getY() > 300) {
            this.sprite.setY(this.sprite.getY() - this.speed);
        }
        if (this.down && this.sprite.getY() < 540) {
            this.sprite.setY(this.sprite.getY() + this.speed);
        }
    };

    this.fire = function () {
        this.bulletPool.get(this.sprite.getX() + 23, this.sprite.getY() - 15);
    };

    this.firePlasma = function() {
      if (!this.plasma.isInUse) {
        this.plasma.spawn(this.sprite.getX() + 23, this.sprite.getY() - 55);
        this.plasma.isInUse = true;
      }
    };
}

function Enemy(images, x, y) {
    this.speed = 3;
    this.bulletPool = new Pool(30, images.blueWpn, 1);
    this.bulletPool.init();
    this.collidableWith = "blueWpn";
    this.up = false;
    this.left = false;
    this.down = false;
    this.right = false;
    this.hitPoints = 10;
    this.plasma = new Plasma(images.plasma , images.plasmaExplosion, 1);
    this.sprite = new Kinetic.Image({
        image: images.enemy,
        x: x,
        y: y,
        width: 50,
        height: 50
    });

    this.move = function () {
        this.bulletPool.animate();

        if (this.plasma.isInUse) {
          this.plasma.move();
        }

        if (this.right && this.sprite.getX() < 340) {
            this.sprite.setX(this.sprite.getX() + this.speed);
        }
        if (this.left && this.sprite.getX() > 10) {
            this.sprite.setX(this.sprite.getX() - this.speed);
        }
        if (this.up && this.sprite.getY() > 10) {
            this.sprite.setY(this.sprite.getY() - this.speed);
        }
        if (this.down && this.sprite.getY() < 245) {
            this.sprite.setY(this.sprite.getY() + this.speed);
        }
    };

    this.fire = function () {
        this.bulletPool.get(this.sprite.getX() + 23, this.sprite.getY() + 60);
    };

    this.firePlasma = function() {
      if (!this.plasma.isInUse) {
        this.plasma.spawn(this.sprite.getX() + 23, this.sprite.getY() + 65);
        this.plasma.isInUse = true;
      }
    };
}

function Background(images) {
    this.sprite = new Kinetic.Image({
        image: images.bg,
        x: 0,
        y: -9800,
        width: 400,
        height: 10527
    });
}

function UIDisplay(images) {
    this.sprite = new Kinetic.Image({
        image: images.uiDisplay,
        x: 400,
        y: 0,
        width: 200,
        height: 600
    });
}

function setupUILayer(uiLayer, images, ship, enemy) {

    this.shipHealth = game.ship.hitPoints;
    this.enemyHealth = game.enemy.hitPoints;
    uiLayer.add(uiDisplay.sprite);

    var shipHp = [];
    var enemyHp = [];

    var gameTitle = new Kinetic.Text({
        x: 410,
        y: 280,
        text: 'SPACE DUEL',
        fontSize: 32,
        fontFamily: 'Capture it',
        fill: 'white'
    }),
        i;

    var firstPlayerControls = new Kinetic.Text({
        x: 410,
        y: 360,
        text: 'Player 1\nControls:\n\n    Move: W A S D\nShoot: Space',
        fontSize: 20,
        align: 'center',
        fontFamily: 'Capture it',
        fill: 'white'
    });

    // Watch out for compatibility through browsers with new line char
    var secondPlayerControls = new Kinetic.Text({
        x: 410,
        y: 130,
        text: 'Player 2\nControls:\n\n    Move: ↑ ← ↓ →\nShoot: 0',
        fontSize: 20,
        align: 'center',
        fontFamily: 'Capture it',
        fill: 'white'
    });

    for (i = 0; i < 10; i += 1) {
        enemyHp[i] = new Kinetic.Image({
            image: images.healthBlue,
            x: 420 + (i * 16),
            y: 50,
            width: 16,
            height: 20,
        });
        uiLayer.add(enemyHp[i]);
    }

    for (i = 0; i < 10; i += 1) {
        shipHp[i] = new Kinetic.Image({
            image: images.healthGreen,
            x: 420 + (i * 16),
            y: 525,
            width: 16,
            height: 20,
        });
        uiLayer.add(shipHp[i]);
    }

    uiLayer.add(gameTitle);
    uiLayer.add(firstPlayerControls);
    uiLayer.add(secondPlayerControls);
    uiLayer.draw();

    this.decreaseEnemyHp = function () {
        enemyHp.pop().destroy();
        this.enemyHealth -= 1;
    };

    this.decreaseShipHp = function () {
        shipHp.pop().destroy();
        this.shipHealth -= 1;
    };

}

function Game() {
    var stage,
        background,
        shipLayer,
        backlayer,
        bulletLayer,
        uiDisplayLayer,
        uiContainer;

    this.init = function () {

        this.textures = new imageRepository();

        stage = new Kinetic.Stage({
            container: 'game-container',
            width: 600,
            height: 600
        });

        bulletLayer = new Kinetic.Layer();
        shipLayer = new Kinetic.Layer();
        backlayer = new Kinetic.Layer();
        uiDisplayLayer = new Kinetic.Layer();

        this.ship = new Ship(this.textures.images, 175, 535);
        this.enemy = new Enemy(this.textures.images, 175, 20);
        background = new Background(this.textures.images);
        uiDisplay = new UIDisplay(this.textures.images);

        uiContainer = new setupUILayer(uiDisplayLayer, this.textures.images, this.ship, this.enemy);

        backlayer.add(background.sprite);
        shipLayer.add(this.ship.sprite);
        shipLayer.add(this.enemy.sprite);

        for (var i = 0; i < 30; i++) {
            bulletLayer.add(this.ship.bulletPool.pool[i].sprite);
            bulletLayer.add(this.enemy.bulletPool.pool[i].sprite);
        }
        bulletLayer.add(this.ship.plasma.sprite);
        bulletLayer.add(this.ship.plasma.explosion);
        bulletLayer.add(this.enemy.plasma.sprite);
        bulletLayer.add(this.enemy.plasma.explosion);

        stage.add(backlayer);
        stage.add(uiDisplayLayer);
        stage.add(shipLayer);
        stage.add(bulletLayer);
    };

    this.moveBackground = function () {
        if (background.sprite.getY() === 0) {
            background.sprite.setY(-9600);
        }
        background.sprite.setY(background.sprite.getY() + 1);
        backlayer.draw();
        bulletLayer.draw();
    };

    this.moveship = function () {
        if (this.ship.hitPoints > 0) {
            this.ship.move();
            shipLayer.draw();
        }
        else {
            var winnerPlayer = 'Player 2';
            this.gameOver(winnerPlayer);
            this.restart();
        }
    };

    this.moveEnemy = function () {
        if (this.enemy.hitPoints > 0) {
            this.enemy.move();
            shipLayer.draw();
        }
        else {
            var winnerPlayer = 'Player 1';
            this.gameOver(winnerPlayer);
            this.restart();
        }
    };

    this.drawUiDisplay = function () {
        if (uiContainer.enemyHealth > this.enemy.hitPoints && this.enemy.hitPoints >= 0) {
            uiContainer.decreaseEnemyHp();
            uiDisplayLayer.draw();
        }
        if (uiContainer.shipHealth > this.ship.hitPoints && this.ship.hitPoints >= 0) {
            uiContainer.decreaseShipHp();
            uiDisplayLayer.draw();
        }
        else {
            uiDisplayLayer.draw();
        }
    };

    // Start the animation loop
    this.start = function () {
        animate();
    };

    // Restart the game
    this.restart = function () {
        //Implementation
    };

    // Game over
    this.gameOver = function (winnerPlayer) {
        shipLayer.removeChildren();
        bulletLayer.remove(this.ship.bulletPool);

        var gameOverText = new Kinetic.Text({
            x: 30,
            y: 200,
            text: 'GAME OVER',
            fontSize: 60,
            align: 'center',
            fontFamily: 'Capture it',
            fill: 'red'
        });

        var winnerPlayerText = new Kinetic.Text({
            x: 90,
            y: 300,
            text: winnerPlayer + ' wins!',
            fontSize: 30,
            align: 'center',
            fontFamily: 'Capture it',
            fill: 'white'
        });

        shipLayer.add(gameOverText);
        shipLayer.add(winnerPlayerText);
    };
}

function animate() {
    game.moveBackground();
    game.drawUiDisplay();
    game.moveship();
    game.moveEnemy();
    window.requestAnimationFrame(animate);
}

//pass Kinetic.Image type objects
function detectCollision(objectA, objectB) {
    return (objectA.getX() < objectB.getX() + objectB.getWidth() &&
        objectA.getX() + objectA.getWidth() > objectB.getX() &&
        objectA.getY() < objectB.getY() + objectB.getHeight() &&
        objectA.getHeight() + objectA.getY() > objectB.getY());
}

document.body.onkeydown = function (e) {
    var keyCode = e.keyCode;
    if (keyCode === 38) { //upKey
        game.enemy.up = true;
        game.enemy.down = false;
    } else if (keyCode === 40) { //downKey
        game.enemy.down = true;
        game.enemy.up = false;
    } else if (keyCode === 37) { //leftKey
        game.enemy.left = true;
        game.enemy.right = false;
    } else if (keyCode === 39) { //rightKey
        game.enemy.right = true;
        game.enemy.left = false;
    } else if (keyCode === 98) { //numPad 2
        game.enemy.fire();
    } else if (keyCode === 99) { //numPad 3
        game.enemy.firePlasma();
    } else if (keyCode === 87) { //w
        game.ship.up = true;
        game.ship.down = false;
    } else if (keyCode === 65) { //a
        game.ship.left = true;
        game.ship.right = false;
    } else if (keyCode === 83) { //s
        game.ship.down = true;
        game.ship.up = false;
    } else if (keyCode === 68) { //d
        game.ship.right = true;
        game.ship.left = false;
    } else if (keyCode === 32) { //space
        game.ship.fire();
    } else if (keyCode === 77) { //m
        game.ship.firePlasma();
    }
};
document.body.onkeyup = function (e) {
    var keyCode = e.keyCode;
    if (keyCode === 38) { //upKey
        game.enemy.up = false;
    } else if (keyCode === 40) { //downKey
        game.enemy.down = false;
    } else if (keyCode === 37) { //leftKey
        game.enemy.left = false;
    } else if (keyCode === 39) { //rightKey
        game.enemy.right = false;
    } else if (keyCode === 87) { //w
        game.ship.up = false;
    } else if (keyCode === 65) { //a
        game.ship.left = false;
    } else if (keyCode === 83) { //s
        game.ship.down = false;
    } else if (keyCode === 68) { //d
        game.ship.right = false;
    }
};
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.onload = function () {
    game.init();
    game.start();
};
