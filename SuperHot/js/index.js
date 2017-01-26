(function() {
  var Bullet, Enemy, Player, bulletEnemyHandler, bullet_time, bullets, bullets_count, checkInput, controls, create, currentHorizontalDirection, currentVerticalDirection, drawShape, enemies, enemies_bullets, enemies_count, game, gameOver, killEnemy, max_delay, min_delay, motion, motionUpdate, motion_timer, moveBullets, moveEnemies, movePlayer, nextLevel, player, playerEnemyHandler, preload, preview, render, resetGame, score, score_text, slowDownTime, spawnText, speed, speedUpTime, text, time, update, updateMotion, updateScore;

  player = null;

  bullets = null;

  bullets_count = 3;

  bullet_time = 0;

  enemies = null;

  enemies_count = 0;

  enemies_bullets = null;

  time = 0;

  speed = 10;

  motion = 0;

  motion_timer = null;

  max_delay = 60;

  min_delay = 1;

  text = null;

  score = 0;

  score_text = null;

  controls = [];

  currentVerticalDirection = false;

  currentHorizontalDirection = false;

  preview = new PreviewImage("https://s3-us-west-2.amazonaws.com/s.cdpn.io/150586/superhot2d.png");

  preload = function() {};

  create = function() {
    preview.clear();
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignVertically = true;
    game.scale.pageAlignHorizontally = true;
    game.stage.backgroundColor = '#CCCCCC';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);
    controls = {
      "up": game.input.keyboard.addKey(Phaser.Keyboard.UP),
      "down": game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
      "left": game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
      "right": game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    };
    return nextLevel();
  };

  resetGame = function() {
    var bullet, enemy, i;
    game.world.removeAll();
    score_text = game.add.text(game.world.width - 60, 10, score);
    score_text.align = 'right';
    score_text.font = 'Orbitron';
    score_text.fontSize = 40;
    score_text.fill = '#ff0000';
    player = new Player(game, game.rnd.integerInRange(100, game.world.width - 100), 500, drawShape(32, 32, '#FFFFFF'));
    bullets = game.add.group();
    i = 0;
    while (i < bullets_count) {
      bullet = new Bullet(game, 0, 0, drawShape(10, 10, '#000000'));
      bullets.add(bullet);
      bullet.events.onOutOfBounds.add(bullet.kill, bullet);
      i++;
    }
    enemies = game.add.group();
    enemies_bullets = game.add.group();
    i = 0;
    while (i < enemies_count) {
      enemy = new Enemy(game, game.rnd.integerInRange(100, game.world.width - 100), game.rnd.integerInRange(50, 150), drawShape());
      enemies.add(enemy);
      i++;
    }
    return motion_timer = game.time.events.loop(60, motionUpdate, this);
  };

  drawShape = function(width, height, color) {
    var bmd;
    if (width == null) {
      width = 64;
    }
    if (height == null) {
      height = 64;
    }
    if (color == null) {
      color = '#ff0000';
    }
    bmd = game.add.bitmapData(width, height);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fill();
    return bmd;
  };

  checkInput = function() {
    if (controls.up.isDown || controls.down.isDown || controls.left.isDown || controls.right.isDown) {
      speedUpTime();
    } else {
      slowDownTime();
    }
    if (controls.left.isDown) {
      currentHorizontalDirection = "left";
    } else if (controls.right.isDown) {
      currentHorizontalDirection = "right";
    } else {
      currentHorizontalDirection = false;
    }
    if (controls.up.isDown) {
      currentVerticalDirection = "up";
    } else if (controls.down.isDown) {
      currentVerticalDirection = "down";
    } else if (!currentHorizontalDirection) {
      currentVerticalDirection = "up";
    } else {
      currentVerticalDirection = false;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      return player.fireBullet(currentHorizontalDirection, currentVerticalDirection);
    }
  };

  movePlayer = function() {
    return player.motionUpdate();
  };

  moveEnemies = function() {
    return enemies.forEachAlive(function(enemy) {
      return enemy.motionUpdate();
    });
  };

  moveBullets = function() {
    bullets.forEachAlive(function(bullet) {
      return bullet.motionUpdate();
    });
    return enemies_bullets.forEachAlive(function(bullet) {
      return bullet.motionUpdate();
    });
  };

  playerEnemyHandler = function(player, enemy) {
    if (enemy.can_kill) {
      enemy.can_kill = false;
      player.tint = 0xff0000;
      return game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {
        return gameOver();
      }, this);
    }
  };

  bulletEnemyHandler = function(bullet, enemy) {
    enemy.tint = 0x000000;
    bullet.kill();
    enemy.can_kill = false;
    updateScore(score += 1);
    return game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {
      return killEnemy(enemy);
    }, this);
  };

  killEnemy = function(enemy) {
    enemy.kill();
    if (!enemies.getFirstAlive()) {
      return nextLevel();
    }
  };

  speedUpTime = function() {
    if (motion_timer.delay > min_delay) {
      motion_timer.delay -= 2;
    } else {
      motion_timer.delay = min_delay;
    }
    return time = motion_timer.delay + speed;
  };

  slowDownTime = function() {
    if (motion_timer.delay < max_delay) {
      motion_timer.delay += 2;
    } else {
      motion_timer.delay = max_delay;
    }
    return time = motion_timer.delay - speed;
  };

  updateMotion = function() {
    return motion = (100 - (time * 2)) + speed;
  };

  gameOver = function() {
    enemies_count = 1;
    updateScore(0);
    resetGame();
    spawnText("GAME");
    return game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
      return spawnText("OVER");
    }, this);
  };

  nextLevel = function() {
    enemies_count++;
    resetGame();
    spawnText("SUPER");
    return game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
      return spawnText("HOT");
    }, this);
  };

  spawnText = function(text, lifespan) {
    if (text == null) {
      text = false;
    }
    if (lifespan == null) {
      lifespan = 0.5;
    }
    if (text) {
      text = game.add.text(game.world.centerX, game.world.centerY, text);
      text.anchor.set(0.5);
      text.align = 'center';
      text.font = 'Orbitron';
      text.fontSize = 150;
      text.fill = '#ff0000';
      return game.time.events.add(Phaser.Timer.SECOND * lifespan, function() {
        return text.kill();
      }, this);
    }
  };

  updateScore = function(points) {
    score = points;
    return score_text.text = score;
  };

  motionUpdate = function() {
    updateMotion();
    movePlayer();
    moveEnemies();
    return moveBullets();
  };

  update = function() {
    checkInput();
    game.physics.arcade.overlap(player, enemies, playerEnemyHandler, null, this);
    game.physics.arcade.overlap(player, enemies_bullets, playerEnemyHandler, null, this);
    game.physics.arcade.overlap(bullets, enemies, bulletEnemyHandler, null, this);
    return game.physics.arcade.collide(bullets, enemies_bullets);
  };

  render = function() {};

  Player = function(game, x, y, sprite) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    game.physics.arcade.enable(this);
    this.game = game;
    this.anchor.set(0.5);
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add(this.reposition, this);
    this.body.drag.x = 1;
    this.body.drag.y = 1;
    return game.add.existing(this);
  };

  Player.prototype = Object.create(Phaser.Sprite.prototype);

  Player.prototype.constructor = Player;

  Player.prototype.motionUpdate = function() {
    var speed_modifier;
    speed_modifier = speed / 6;
    if (controls.up.isDown) {
      this.body.velocity.y = -motion * speed_modifier;
    } else if (controls.down.isDown) {
      this.body.velocity.y = motion * speed_modifier;
    }
    if (controls.left.isDown) {
      this.body.velocity.x = -motion * speed_modifier;
    } else if (controls.right.isDown) {
      this.body.velocity.x = motion * speed_modifier;
    }
    if (!controls.up.isDown && !controls.down.isDown && !controls.left.isDown && !controls.right.isDown) {
      if (this.body.velocity.x > 0) {
        this.body.velocity.x -= motion / 2;
      } else if (this.body.velocity.x < 0) {
        this.body.velocity.x += motion / 2;
      }
      if (this.body.velocity.y > 0) {
        return this.body.velocity.y -= motion / 2;
      } else if (this.body.velocity.y < 0) {
        return this.body.velocity.y += motion / 2;
      }
    }
  };

  Player.prototype.reposition = function() {
    if (this.x < 0) {
      return this.x = game.world.width;
    } else if (this.x > game.world.width) {
      return this.x = 0;
    } else if (this.y < 0) {
      return this.y = game.world.height;
    } else if (this.y > game.world.height) {
      return this.y = 0;
    }
  };

  Player.prototype.fireBullet = function(h, v) {
    var bullet;
    if (h == null) {
      h = false;
    }
    if (v == null) {
      v = false;
    }
    if (game.time.now > bullet_time) {
      bullet = bullets.getFirstExists(false);
      if (bullet) {
        bullet.reset(this.x, this.y);
        bullet.h = h;
        bullet.v = v;
        bullet.mass = 1;
        return bullet_time = game.time.now + 150;
      }
    }
  };

  Bullet = function(game, x, y, sprite, h, v) {
    if (h == null) {
      h = false;
    }
    if (v == null) {
      v = "up";
    }
    Phaser.Sprite.call(this, game, x, y, sprite);
    game.physics.arcade.enable(this);
    this.game = game;
    this.exists = false;
    this.visible = false;
    this.checkWorldBounds = true;
    this.angle = 45;
    this.anchor.set(0.5);
    this.mass = 0.2;
    this.can_kill = true;
    this.h = h;
    return this.v = v;
  };

  Bullet.prototype = Object.create(Phaser.Sprite.prototype);

  Bullet.prototype.constructor = Bullet;

  Bullet.prototype.motionUpdate = function() {
    var speed_modifier;
    speed_modifier = speed / 2;
    switch (this.h) {
      case "left":
        this.body.velocity.x = -motion * speed_modifier;
        break;
      case "right":
        this.body.velocity.x = motion * speed_modifier;
    }
    switch (this.v) {
      case "up":
        return this.body.velocity.y = -motion * speed_modifier;
      case "down":
        return this.body.velocity.y = motion * speed_modifier;
    }
  };

  Enemy = function(game, x, y, sprite) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    game.physics.arcade.enable(this);
    this.game = game;
    this.anchor.set(0.5);
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add(this.reposition, this);
    this.body.bounce.x = 1;
    this.body.bounce.y = 1;
    this.body.drag.x = 1;
    this.body.drag.y = 1;
    this.type = _.sample([1, 2, 3, 4, 5]);
    this.can_kill = true;
    return this.can_shoot = true;
  };

  Enemy.prototype = Object.create(Phaser.Sprite.prototype);

  Enemy.prototype.constructor = Enemy;

  Enemy.prototype.motionUpdate = function() {
    switch (this.type) {
      case 1:
        this.body.velocity.y = motion;
        break;
      case 2:
        this.body.velocity.x = -motion;
        break;
      case 3:
        this.body.velocity.x = motion;
        break;
      default:
        this.game.physics.arcade.moveToObject(this, player, motion);
    }
    if (this.can_shoot) {
      this.fireBullet();
      this.can_shoot = false;
      return this.game.time.events.add(Phaser.Timer.SECOND * this.game.rnd.integerInRange(3, 10), function() {
        return this.can_shoot = true;
      }, this);
    }
  };

  Enemy.prototype.reposition = function() {
    if (this.x < 0) {
      return this.x = game.world.width;
    } else if (this.x > game.world.width) {
      return this.x = 0;
    } else if (this.y < 0) {
      return this.y = game.world.height;
    } else if (this.y > game.world.height) {
      return this.y = 0;
    }
  };

  Enemy.prototype.fireBullet = function() {
    var buffer, bullet, h, v;
    bullet = new Bullet(game, 0, 0, drawShape(10, 10, '#ff0000'));
    enemies_bullets.add(bullet);
    bullet.reset(this.x, this.y);
    buffer = 100;
    if (player.x < this.x - buffer) {
      h = "left";
    } else if (player.x > this.x + buffer) {
      h = "right";
    } else {
      h = false;
    }
    if (player.y < this.y - buffer) {
      v = "up";
    } else if (player.y > this.y + buffer) {
      v = "down";
    } else {
      v = false;
    }
    bullet.h = h;
    return bullet.v = v;
  };

  game = new Phaser.Game(900, 600, Phaser.AUTO, "game", {
    preload: preload,
    create: create,
    update: update,
    render: render
  });

}).call(this);