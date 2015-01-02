BasicGame.Game = function (game) {

};

BasicGame.Game.prototype = {
    preload:function(){
        this.load.image('player','assets/invaders/Ship.png');    this.load.spritesheet('enemyA','assets/invaders/InvaderA_sprite.png',24,16,2); this.load.spritesheet('enemyB','assets/invaders/InvaderB_sprite.png',24,16,2);  this.load.spritesheet('enemyC','assets/invaders/InvaderC_sprite.png',24,16,2);

        this.load.image('playerBullet','assets/invaders/bullet.png')
        this.load.image('explosion','assets/invaders/explosion.png');
        this.load.image('shield_top_left','assets/shield/top_left.png');
        this.load.image('shield_top_right','assets/shield/top_right.png');
        this.load.image('shield_plain','assets/shield/plain.png');
    },

    create:function(){
        this.setupBackground();
        this.setupShields();
        this.setupText();
        this.setupPlayer();
        this.setupEnemies();
        this.setupBullets();
        this.setupExplosions();
        this.spawnEnemies();
        this.cursors = this.input.keyboard.createCursorKeys()
    },

    update: function () {
        this.checkCollisions();
        this.processPlayerInput();
        this.moveInvaders();
    },

    render:function(){
        // this.game.debug.body(this.ground)
    },

    setupText:function(){
        //score<1> HI-Score
        this.scoreHeader = this.add.text(25,30,'SCORE<1>',
        { font: '25px monospace', fill: '#fff', align: 'center' })

        //score values
        this.scoreText = this.add.text(25,60,"000",{ font: '25px monospace', fill: '#fff', align: 'center' })

        this.highScoreHeader = this.add.text(200,30,'HI-SCORE',
        { font: '25px monospace', fill: '#fff', align: 'center' })
        this.highScoreText = this.add.text(200,60,"000",{ font: '25px monospace', fill: '#fff', align: 'center' })

        // lifes and credits
        this.lifesText = this.add.text(25,this.game.height -40,'3',
        { font: '25px monospace', fill: '#fff', align: 'center' })

        this.creditsText = this.add.text(this.game.width - 200,this.game.height - 40,'CREDITS 00',
        { font: '25px monospace', fill: '#fff', align: 'center' })
    },
    setupBackground: function(){
        // green line
        var GROUND_HEIGHT = 10
        var graphics = this.add.graphics(0,0);
        graphics.boundsPadding = 0;
        graphics.beginFill(0x1FFF1F);
        graphics.drawRect(0, 0, this.game.width, GROUND_HEIGHT);

        this.ground = this.add.sprite(0, this.game.height-50);
        this.ground.height = GROUND_HEIGHT;
        this.ground.width = this.game.width;
        this.ground.addChild(graphics);
        this.physics.enable(this.ground, Phaser.Physics.ARCADE);
    },

    setupShields: function(){
        this.shield = this.add.group();

        this.shield_top_left = this.add.sprite(100,this.game.height-150,'shield_top_left');
        this.shield_top_left.anchor.setTo(0.5,0.5);
        this.physics.enable(this.shield_top_left,Phaser.Physics.ARCADE);
        this.shield_top_left.body.collideWorldBounds = true;
        this.shield_top_left.scale.set(0.5 , 0.5 );

        this.shield_top_middle = this.add.sprite(120,this.game.height-150,'shield_plain');
        this.shield_top_middle.anchor.setTo(0.5,0.5);
        this.physics.enable(this.shield_top_middle,Phaser.Physics.ARCADE);
        this.shield_top_middle.body.collideWorldBounds = true;
        this.shield_top_middle.scale.set(0.5 , 0.5 );

        this.shield_top_right = this.add.sprite(140,this.game.height-150,'shield_top_right');
        this.shield_top_right.anchor.setTo(0.5,0.5);
        this.physics.enable(this.shield_top_right,Phaser.Physics.ARCADE);
        this.shield_top_right.body.collideWorldBounds = true;
        this.shield_top_right.scale.set(0.5 , 0.5 );

        this.shield.add(this.shield_top_left);
        this.shield.add(this.shield_top_right);
        this.shield.add(this.shield_top_middle);
    },

    setupPlayer: function(){
        this.player = this.add.sprite(this.game.width/2,this.game.height -100,'player')
        this.player.anchor.setTo(0.5,0.5);
        this.physics.enable(this.player,Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
        this.player.speed =  BasicGame.PLAYER_SPEED;
    },

    setupEnemies: function(){
        this.invadersPool = this.add.group()
        this.invadersPool.enableBody = true;
        this.invadersPool.physicsBodyType = Phaser.Physics.ARCADE

        //top line
        this.invaderCPool = this.add.group(this.invadersPool);
        this.invaderCPool.enableBody = true;
        this.invaderCPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.invaderCPool.createMultiple(11,'enemyC');
        this.invaderCPool.setAll('anchor.x', 0.5);
        this.invaderCPool.setAll('anchor.y', 0.5);
        this.invaderCPool.setAll('outOfBoundsKill', true);
        this.invaderCPool.setAll('checkWorldBounds', true);
        this.invaderCPool.setAll('reward', 10, false, false, 0, true);
        this.invaderCPool.forEach(function (enemy) {
            enemy.animations.add('move', [ 1, 0], 24, true);
            enemy.play('move',1,true);
        });

        this.invaderBPool = this.add.group(this.invadersPool);
        this.invaderBPool.enableBody = true;
        this.invaderBPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.invaderBPool.createMultiple(22,'enemyB');
        this.invaderBPool.setAll('anchor.x', 0.5);
        this.invaderBPool.setAll('anchor.y', 0.5);
        this.invaderBPool.setAll('outOfBoundsKill', true);
        this.invaderBPool.setAll('checkWorldBounds', true);
        this.invaderBPool.setAll('reward', 10, false, false, 0, true);
        this.invaderBPool.forEach(function (enemy) {
            enemy.animations.add('move', [ 0, 1], 24, true);
            enemy.play('move',1,true);
        });

        //bottom two lines
        this.invaderAPool = this.add.group(this.invadersPool);
        this.invaderAPool.enableBody = true;
        this.invaderAPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.invaderAPool.createMultiple(22,'enemyA');
        this.invaderAPool.setAll('anchor.x', 0.5);
        this.invaderAPool.setAll('anchor.y', 0.5);
        // this.invaderAPool.setAll('outOfBoundsKill', true);
        this.invaderAPool.setAll('body.collideWorldBounds', true);
        this.invaderAPool.setAll('reward', 10, false, false, 0, true);
        this.invaders_direction = 1;
        this.invaderAPool.forEach(function (enemy) {
            enemy.animations.add('move', [ 0, 1], 24, true);
            enemy.play('move',1,true);
        });
    },

    spawnEnemies:function(){
        var i = 0;
        var space = 20;
        var invader_width = 24;
        var invader_height = 16
        var per_line = 11
        var bound = 100;
        var height_bound = 100;

        this.invaderCPool.forEach(function (enemy) {
            if(i == (per_line)){
                i = 0;
                height_bound += invader_height + 20
            } enemy.reset(bound+i*space+((i+1)*(invader_width/2)),height_bound+invader_width/2);
            i++
        })

        this.invaderBPool.forEach(function (enemy) {
            if(i == (per_line)){
                i = 0;
                height_bound += invader_height + 20
            } enemy.reset(bound+i*space+((i+1)*(invader_width/2)),height_bound+invader_width/2);
            i++
        })

        this.invaderAPool.forEach(function (enemy) {
            if(i == (per_line)){
                i = 0;
                height_bound += invader_height + 20
            } enemy.reset(bound+i*space+((i+1)*(invader_width/2)),height_bound+invader_width/2);
            i++
        })
    },

    setupExplosions:function(){
        this.explosionPool = this.add.group();
        this.explosionPool.enableBody = true;
        this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.explosionPool.createMultiple(50, 'explosion');
        this.explosionPool.setAll('anchor.x', 0.5);
        this.explosionPool.setAll('anchor.y', 0.5);
        this.explosionPool.forEach(function (explosion) {
            explosion.animations.add('boom');
        });
    },

    setupBullets:function(){
        this.playerBullet = this.add.group();
        this.playerBullet.enableBody = true
        this.playerBullet.physicsType = Phaser.Physics.ARCADE;
        this.playerBullet.createMultiple(1,'playerBullet');
        this.playerBullet.setAll('anchor.x',0.5)
        this.playerBullet.setAll('anchor.y',0.5)
        this.playerBullet.setAll('outOfBoundsKill', true);
        this.playerBullet.setAll('checkWorldBounds', true);
    },

    processPlayerInput:function(){
        this.player.body.velocity.x = 0;
        if(this.cursors.left.isDown){
            this.player.body.velocity.x = -this.player.speed;
        }else if(this.cursors.right.isDown){
            this.player.body.velocity.x = this.player.speed;
        }

        if(this.input.keyboard.isDown(Phaser.Keyboard.Z)){
            this.fire();
        }
    },

    fire:function(){
        var bullet;
        if(this.playerBullet.countDead()===0){
            return;
        }
        bullet = this.playerBullet.getFirstExists(false);
        bullet.reset(this.player.x,this.player.y - 20);
        bullet.body.velocity.y = -500;
    },
    moveInvaders: function(){
        //move each line on direction (1 or -1)
        //if reach bound, stop
        var ENEMY_SPEED = 100;
        var ENEMY_DROP = 10;

        //if group is moving to right and have not reach end
        if(this.invaders_direction == 1 && this.invadersPool.getBounds().topRight.x < this.game.width - 50){
        this.invaderAPool.forEach(function(enemy){
            enemy.body.velocity.x = ENEMY_SPEED;
        });
        this.invaderBPool.forEach(function(enemy){
            enemy.body.velocity.x = ENEMY_SPEED;
        });
        this.invaderCPool.forEach(function(enemy){
            enemy.body.velocity.x = ENEMY_SPEED;
        });
    }

        if(this.invadersPool.getBounds().topRight.x >= this.game.width - 50){
            this.invaders_direction = -1
            this.invaderAPool.addAll('body.y', ENEMY_DROP)
            this.invaderBPool.addAll('body.y', ENEMY_DROP)
            this.invaderCPool.addAll('body.y', ENEMY_DROP)
        }

        if(this.invaders_direction == -1 && this.invadersPool.getBounds().topLeft.x > 50){
            this.invaderAPool.forEach(function(enemy){
                enemy.body.velocity.x = -ENEMY_SPEED;
            });
            this.invaderBPool.forEach(function(enemy){
                enemy.body.velocity.x = -ENEMY_SPEED;
            });
            this.invaderCPool.forEach(function(enemy){
                enemy.body.velocity.x = -ENEMY_SPEED;
            });
        }

        if(this.invadersPool.getBounds().topLeft.x <= 50){
            this.invaders_direction = 1
            this.invaderAPool.addAll('body.y', ENEMY_DROP)
            this.invaderBPool.addAll('body.y', ENEMY_DROP)
            this.invaderCPool.addAll('body.y', ENEMY_DROP)
        }
    },

    checkCollisions:function(){
        this.physics.arcade.overlap(    this.playerBullet,[this.invaderAPool,this.invaderBPool,this.invaderCPool],this.enemyHit,null,this
        );

        this.physics.arcade.overlap(    this.ground,[this.invaderAPool,this.invaderBPool,this.invaderCPool],this.groundHit,null,this
        );
    },

    enemyHit: function(bullet,enemy){
        console.log("hit",bullet,enemy)
        bullet.kill();
        this.damageEnemy(enemy)
    },

    groundHit:function(ground,enemy){
        console.log("HIT GROUND")
        this.damageEnemy(enemy)
    },

    damageEnemy: function(enemy){
        this.explode(enemy);
        enemy.kill();
    },
    explode: function(sprite){
        if(this.explosionPool.countDead() === 0){
            return;
        }

        var explosion = this.explosionPool.getFirstExists(false);
        explosion.reset(sprite.x,sprite.y);
        explosion.play('boom', 5, false, true);

        explosion.body.velocity.x = sprite.body.velocity.x
        explosion.body.velocity.y = sprite.body.velocity.y
    },
}
