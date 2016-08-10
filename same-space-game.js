var game = new Game(); //Primary game instance

function imageRepository() {
  this.images = {}; // texture containerd
  var  sources = {
          bg: 'Resources/starBackground.png',
          ship: 'Resources/ship.png',
          enemy: 'Resources/player2.png',
          blueWpn: 'Resources/blueWeapon.png',
          redWpn: 'Resources/redWeapon.png',
          uiDisplay : 'Resources/metalbeamcenter.jpg'
      };
	// Ensure all images have loaded before starting the game

  var numImages = Object.keys(sources).length;

  for (var src in sources) {
     this.images[src] = new Image();
     this.images[src].src = sources[src];
  }
}

function Bullet(image, x, y, direction) {
    var speed = 3;
    this.alive = false; // Is true if the bullet is currently in use
    this.sprite = new Kinetic.Image({
          image: image,
          x: x,
          y: y,
          width: 3,
          height: 12
      });

    this.spawn = function(x, y) {
      this.sprite.setX(x);
      this.sprite.setY(y);
      //this.alive = true;
    };

    this.move = function () {
      if (this.sprite.getY() < 10 && this.sprite.getY() !== -20 && this.sprite.getX() !== -20) {
        this.sprite.setX(-20);
        this.sprite.setY(-20);
        console.log("asdasd");
      }
      else {
        this.sprite.setY(this.sprite.getY() + (speed * direction));
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

            /*
             * Draws any in use Bullets. If a bullet goes off the screen,-----
             * clears it and pushes it to the front of the array.
             */
    this.animate = function () {
      for (var j = 0; j < size; j++) {
        this.pool[j].move();
      }
       for (var i = 0; i < size; i++) {
           // Only draw until we find a bullet that is not alive
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
    var fireRate = 15;
    var counter = 0;
    this.collidableWith = "redWpn";
    this.type = "ship";
    this.up = false;
    this.left = false;
    this.down = false;
    this.right = false;
    this.hitPoints = 10;
    this.sprite = new Kinetic.Image({
        image: images.ship,
        x: x,//175
        y: y,//520
        width: 50,
        height: 50
    });

    this.move = function () {
        this.bulletPool.animate();

        if (this.right && this.sprite.getX() < 340) {
            this.sprite.setX(this.sprite.getX() + this.speed);
        }
        if (this.left && this.sprite.getX() > 5) {
            this.sprite.setX(this.sprite.getX() - this.speed);
        }
        if (this.up && this.sprite.getY() > 5) {
            this.sprite.setY(this.sprite.getY() - this.speed);
        }
        if (this.down && this.sprite.getY() < 540) {
            this.sprite.setY(this.sprite.getY() + this.speed);
        }
    };

    this.fire = function () {
        this.bulletPool.get(this.sprite.getX() + 23, this.sprite.getY() - 15, 3);
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
    this.sprite = new Kinetic.Image({
        image: images.enemy,
        x: x,
        y: y,
        width: 50,
        height: 50
        });

    this.move = function () {
        this.bulletPool.animate();

        if (this.right && this.sprite.getX() < 340) {
            this.sprite.setX(this.sprite.getX() + this.speed);
        }
        if (this.left && this.sprite.getX() > 10) {
            this.sprite.setX(this.sprite.getX() - this.speed);
        }
        if (this.up && this.sprite.getY() > 10) {
            this.sprite.setY(this.sprite.getY() - this.speed);
        }
        if (this.down && this.sprite.getY() < 540) {
            this.sprite.setY(this.sprite.getY() + this.speed);
        }
    };

    this.fire = function () {
        this.bulletPool.get(this.sprite.getX() + 23, this.sprite.getY() + 15, 3);
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

function UIDisplayBackground(images) {
    this.sprite = new Kinetic.Image({
        image: images.uiDisplay,
        x: 400,
        y: 0,
        width: 200,
        height: 600
    });
}

function Game() {
    var stage,
        background,
        shipLayer,
        backlayer,
        bulletLayer;

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
        uiDisplay = new Kinetic.Layer();

        this.ship = new Ship(this.textures.images, 175, 535);
        this.enemy = new Enemy(this.textures.images, 175, 20);
        background = new Background(this.textures.images);
        uiBackground = new UIDisplayBackground(this.textures.images);

        backlayer.add(background.sprite);
        uiDisplay.add(uiBackground.sprite);
        shipLayer.add(this.ship.sprite);
        shipLayer.add(this.enemy.sprite);

        for (var i = 0; i < 30; i++) {
          bulletLayer.add(this.ship.bulletPool.pool[i].sprite);
          bulletLayer.add(this.enemy.bulletPool.pool[i].sprite);
        }

        stage.add(backlayer);
        stage.add(uiDisplay);
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
        this.ship.move();
        shipLayer.draw();
    };

    this.drawUiDisplay = function () {
        uiDisplay.draw();
    };

    this.moveenemy = function () {
        this.enemy.move();
        shipLayer.draw();
    };

    // Start the animation loop
    this.start = function () {
        animate();
    };

    // Restart the game
    this.restart = function () {
    };

    // Game over
    this.gameOver = function () {
    };
}

function animate() {
    game.moveBackground();
    game.drawUiDisplay();
    game.moveship();
    game.moveenemy();
    window.requestAnimationFrame(animate);
}

//pass Kinetic.Image type objects
function detectCollision(objectA, objectB) {
    return (objectA.x < objectB.x + objectB.width &&
        objectA.x + objectA.width > objectB.x &&
        objectA.y < objectB.y + objectB.height &&
        objectA.height + objectA.y > objectB.y);
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
    } else if (keyCode === 45) { //numpadIns
        game.enemy.fire();
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
