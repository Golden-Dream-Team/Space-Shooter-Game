var game = new Game(); //Primary game instance

function imageRepository() {
	// this.background = new Kinetic.Layer();
	// this.ship = new Kinetic.Layer();
	// this.enemy = new Kinetic.Layer();
	// this.blueWpn = new Kinetic.Layer();
	// this.redWpn = new Kinetic.Layer();
  this.images = {}; // texture container
  var  sources = {
          bg: 'Resources/starBackground.png',
          ship: 'Resources/ship.png',
          enemy: 'Resources/player2.png',
          blueWpn: 'Resources/blueWeapon.png',
          redWpn: 'Resources/redWeapon.png'
      }
	// Ensure all images have loaded before starting the game

  var numImages = Object.keys(sources).length;

  for (var src in sources) {
      this.images[src] = new Image();
     this.images[src].src = sources[src];
  }
  //
	// var numImages = 5;
	// var numLoaded = 0;
  //
	// function imageLoaded() {
	// 	numLoaded++;
	// 	if (numLoaded === numImages) {
	// 		window.init();
	// 	}
	// }
	// this.background.onload = function() {
	// 	imageLoaded();
	// }
	// this.spaceship.onload = function() {
	// 	imageLoaded();
	// }
	// this.enemy.onload = function() {
	// 	imageLoaded();
	// }
  //   this.blueWpn.onload = function() {
	// 	imageLoaded();
	// }
  //   this.redWpn.onload = function() {
	// 	imageLoaded();
	// }
	// // Set images src
	// this.background.src = "Resources/starBackground.png";
	// this.ship.src = "'Resources/ship.png";
	// this.enemy.src = "Resources/player2.png";
	// this.blueWpn.src = "Resources/blueWeapon.png";
	// this.redWpn.src = "Resources/redWeapon.png";

}

function Bullet() {
    var type = "bullet",
        isColliding = false;
    this.alive = false; // Is true if the bullet is currently in use


    // Spawn
    this.spawn = function (x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.alive = true;
    };

    //TODO: Draw
    // this.draw = function() {
    // 	this.context.clearRect(this.x, this.y, this.width, this.height);
    // 	this.y -= this.speed;
    // 	if (this.y <= 0 - this.height) {
    // 		return true;
    // 	}
    // 	else {
    // 		this.context.drawImage(images.bullet, this.x, this.y);
    // 	}
    // };

    // Clear
    this.clear = function () {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.alive = false;
    };

}

function Pool(maxSize) {
    var size = maxSize; // Max bullets allowed in the pool
    var pool = [];

    // TODO : Pool init should take second parameter to see who is using it (enemy-redWpn, ship-blueWpn)

    /*
     * Populates the pool array with the given object
     */
    this.init = function (object) {
        var bullet,
            enemy,
            enemyBullet, i;
            
        if (object == "blueWpn") {
            for (i = 0; i < size; i += 1) {
                bullet = new Bullet();
                bullet.init(0,0, game.textures.images.blueWpn.width,
			            game.textures.images.blueWpn.height);
                bullet.type = "bullet";
                pool[i] = bullet;
                console.log(5);
                
            }
        }
        else if (object == "redWpn") {
            for (i = 0; i < size; i += 1) {
                enemyBullet = new Bullet("blueWpn");
                enemyBullet.init(images.blueWpn, 0, 0);
                enemyBullet.type = "bullet";
                pool[i] = enemyBullet;
            }
        }
    };

    /*
     * Grabs the last item in the list and initializes it and
     * pushes it to the front of the array.
     */
    this.get = function (x, y, speed) {
        if (!pool[size - 1].alive) {
            pool[size - 1].spawn(x, y, speed);
            pool.unshift(pool.pop());
        }
    };

    /*
     * Draws any in use Bullets. If a bullet goes off the screen,
     * clears it and pushes it to the front of the array.
     */
    this.animate = function () {
        for (var i = 0; i < size; i++) {
            // Only draw until we find a bullet that is not alive
            if (pool[i].alive) {
                if (pool[i].draw()) {
                    pool[i].clear();
                    pool.push((pool.splice(i, 1))[0]);
                }
            }
            else
                break;
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

function Ship(images, x, y) {
    this.speed = 3;
    this.bulletPool = new Pool(30);
    this.bulletPool.init("blueWpn");
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
        this.bulletPool.get(this.x + 6, this.y, 3);
    };
}

function Enemy(images, x, y) {
    this.speed = 3;
    this.bulletPool = new Pool(30);
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

    /*
     * Fires a bullet
     */
    this.fire = function () {
        this.bulletPool.get(this.x + this.width / 2, this.y + this.height, -2.5);
    };

    /*
     * Resets the enemy values
     */
    //TODO: Not sure if this should stay with one enemy ( probably not )
    // this.clear = function () {
    //     this.x = 0;
    //     this.y = 0;
    //     this.speed = 0;
    //     this.speedX = 0;
    //     this.speedY = 0;
    //     this.alive = false;
    //     this.isColliding = false;
    // };
}

// TODO: Should intergrate imagePepository and change the rources of init and draw images ( I have retup the image repo for kinetic, I think )



function Game() {
    var background;

    this.init = function () {

         this.textures = new imageRepository();

         stage = new Kinetic.Stage({
             container: 'game-container',
             width: 400,
             height: 600
         });

        shipLayer = new Kinetic.Layer();
        backlayer = new Kinetic.Layer();

        this.ship = new Ship(this.textures.images, 175, 535);
        this.enemy = new Enemy(this.textures.images, 175, 20);
        background = new Background(this.textures.images);

        backlayer.add(background.sprite);
        shipLayer.add(this.ship.sprite);
        shipLayer.add(this.enemy.sprite);
        stage.add(backlayer);
        stage.add(shipLayer);
    };

    this.getImgs = function () {
        return images;
    }

    this.moveBackground = function () {
        if (background.sprite.getY() === 0) {
            background.sprite.setY(-9600);
        }
        background.sprite.setY(background.sprite.getY() + 1);
        backlayer.draw();
    };

    this.moveship = function () {
        this.ship.move();
        shipLayer.draw();
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
    game.moveship();
    game.moveenemy();
    window.requestAnimationFrame(animate);
}

//pass Kinetic.Image type objects
function detectCollision(objectA, objectB) {
    return (objectA.x < objectB.x + objectB.width &&
        objectA.x + objectA.width > objectB.x &&
        objectA.y < objectB.y + objectB.height &&
        objectA.height + objectA.y > objectB.y)
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
    } else if (keyCode === 17) { //rightCtrl
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
