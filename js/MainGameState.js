
var board_walls = [
	[1,1,1,0,0,0,1,1,0,0,0,1,1],
	[1,1,1,0,0,0,1,1,0,0,0,0,0],
	[1,1,1,0,0,0,0,1,0,0,0,1,1],
	[1,1,1,0,1,1,0,1,1,1,0,1,1],
	[1,1,1,0,1,1,0,1,1,1,0,1,1],
	[1,0,0,0,1,0,0,0,0,1,0,1,1],
	[1,1,1,1,1,0,0,0,0,1,0,1,1],
	[1,1,1,1,1,0,0,0,0,1,0,0,1],
	[1,0,0,0,0,0,1,1,1,1,0,0,1],
	[1,0,1,1,1,1,1,1,1,1,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,1,1,1,1,1,1,1]
];

var U = 0;
var D = 1;
var L = 2;
var R = 3;
var path = [R,R,U,U,U,U,R,R,D,R,D,D,D,R,D,D,L,L,D,L,L,L,L,D,D,D,R,R,R,R,U,R,R,R,R,R,R,U,L,U,U,U,U,U,U,U,L,U,U,R,D,R,R];

var MainGameState = function(){};

MainGameState.prototype = {
	preload : function () {
		this.load.image('map','assets/MapTest.png');

		this.load.image('floor','assets/floor.png');

		// spritesheet(name, filename, width of frame, height of frame, number of frames);
		this.load.spritesheet('stabber','assets/stabber.png', 50,50,1);
		this.load.spritesheet('runner','assets/runner.png', 50,50,2);

		this.load.spritesheet('ghost_down','assets/ghost_down.png', 50,50,6);
		this.load.spritesheet('ghost_up','assets/ghost_up.png', 50,50,4);
		this.load.spritesheet('ghost_left','assets/ghost_left.png', 50,50,5);
		this.load.spritesheet('ghost_right','assets/ghost_right.png', 50,50,5);

		this.load.image('up','assets/up.png');
		this.load.image('down','assets/down.png');
		this.load.image('left','assets/left.png');
		this.load.image('right','assets/right.png');

		this.load.image('add','assets/add.png');
		this.load.image('run','assets/run.png');
		this.load.image('selected','assets/selected.png');
		this.load.spritesheet('visitor','assets/visitor.png', 50, 50, 9);

		this.load.spritesheet('grn_heartbeat','assets/grn_heartbeat_sheet.png', 300,50,60);
		this.load.spritesheet('ylw_heartbeat','assets/ylw_heartbeat_sheet.png', 300,50,60);
		this.load.spritesheet('red_heartbeat','assets/red_heartbeat_sheet.png', 300,50,60);

		game.load.audio('scare', ['assets/Audio/Scare.wav']);

	},
	create : function() {
			game.stage.backgroundColor = 0xFFFFFF;
			this.map = this.add.sprite(0,0,'map');

      this.addGhostBtn = this.add.button(0, 50,'ghost_down', this.onClickActor, this);
      this.addStabberBtn = this.add.button(0, 150,'stabber', this.onClickActor, this);
      this.addRunnerBtn = this.add.button(0, 250,'runner', this.onClickActor, this);

      this.orienUBtn = this.add.button(50, 350,'up', this.onClickOrientation, this);
      this.orienLBtn = this.add.button(0, 400,'left', this.onClickOrientation, this);
      this.orienRBtn = this.add.button(100, 400,'right', this.onClickOrientation, this);
      this.orienDBtn = this.add.button(50, 450,'down', this.onClickOrientation, this);

      this.addActorBtn = this.add.button(0, 550,'add', this.onClickAdd, this);
      this.runBtn = this.add.button(0, 550,'add', this.onClickAdd, this);
      this.runBtn = this.add.button(0, 500,'run', this.onClickRun, this);

			this.board = [];
      for(var i=0;i<12;i++){ // rows
        this.board.push([]);
        for(var j=0;j<13;j++){ // cols
					if(board_walls[i][j] === 0){
						this.board[i].push({
	    				orientation: "up",
	            sprite: this.add.button(150 + 50*j,50*i,'floor', this.onClickBoard, this)
	    			});
					}else{
						this.board[i].push({
							orientation: null,
							sprite: null
						});
					}
        }
      }

			//visitor

			this.visitorStep = -1;
			this.startVisitorPos = {
				x: 175 + 50,
			 	y: 50*5
			};
			this.visitor = this.add.sprite(this.startVisitorPos.x, this.startVisitorPos.y, "visitor");
			this.visitor.animations.add("walkback", [0,1,0,2]);
			this.visitor.animations.add("walkfront", [3,4,3,5]);
			this.visitor.animations.add("walkside", [6,7,6,8]);
			this.visitor.anchor.setTo(.5, 0);

			this.visitor.scared = 0;
			this.visitor.pastScary = [];
			this.visitor.anticipation = 0;
			this.visitor.visible = false;

			//sounds
	    this.music = {
				'scare': game.add.audio('scare'),
			};

			//high score

	    var style = { font: "25px Arial", fill: "#ff0044", align: "left" };

	    this.scoreboard = game.add.text(160, 15, "HS: 0", style);

			//heartbeat

      this.heartbeat = this.add.sprite(500,550,"grn_heartbeat");

			this.heartbeat.loadTexture("ylw_heartbeat");
      this.heartbeat.animations.add("ylw_heartbeat");

			this.heartbeat.loadTexture("grn_heartbeat");
			this.heartbeat.animations.add("grn_heartbeat");

			this.heartbeat.loadTexture("red_heartbeat");
			this.heartbeat.animations.add("red_heartbeat");
	    //text.anchor.set(0);

      //state vars
      this.currentActor = "ghost_down";
      this.currentOrientation = "up";
      this.selected = this.add.sprite(0,0, "selected");
			this.selected.visible = false;
			this.score = 0;
			this.highscore = 0;
			this.isrunning = false;

	},

	update : function () {
	},

	onClickRun : function(){
		if(this.isrunning === true){
			this.isrunning = false;
			clearTimeout(this.runTimeout); //stop the animation
			this.resetVisitor();
			return;
		}

		this.isrunning = true;
		this.visitor.visible = true;
		this.score = 0;
		this.runVisitor();
	},

	updateScore : function(){
  	this.scoreboard.setText("HS: " + this.highscore + "\nScore: " + this.score);
	},

	runVisitor : function(){

		this.updateScore();
		this.moveVisitor();

		var pastScared = this.visitor.scared;
		this.evaluateVisitorScareFactor();
		var scared = this.visitor.scared;

		this.score += Math.floor(scared*10);

		this.updateHeartbeat();

		var gotscared = false;
		if(scared - pastScared > .3){
	  	this.music.scare.play();
			console.log("scare!!!");
			gotscared = true;
		}else{
			console.log("only : " + (scared-pastScared));
		}
		var that = this;
		if(this.visitorStep < path.length){
			if(gotscared === true){
				this.runTimeout = setTimeout(function(){that.runVisitor()}, 1500);
			}else {
				this.runTimeout = setTimeout(function(){that.runVisitor()}, 500);
			}
		}else{
			this.resetVisitor();
			if(this.score > this.highscore){
				console.log("HIGH SCORE!!!");
				this.highscore = Math.floor(this.score);
			}
			this.updateScore();
			this.isrunning = false;
		}
	},

	updateHeartbeat : function(){
		var curF = this.heartbeat.frame;
		if(this.visitor.scared > .8){
			this.heartbeat.loadTexture("red_heartbeat");
			this.heartbeat.play("red_heartbeat", 30, true);
		}else if(this.visitor.scared > .4){
			this.heartbeat.loadTexture("ylw_heartbeat");
			this.heartbeat.play("ylw_heartbeat", 30, true);
		}else{
			this.heartbeat.loadTexture("grn_heartbeat");
			this.heartbeat.play("grn_heartbeat", 30, true);
		}
		this.heartbeat.animations.currentAnim.setFrame(curF, true);
	},

	moveVisitor : function(){
		var nextStep = path[this.visitorStep];
		if(nextStep === U){
			this.visitor.position.y -= 50;
			this.visitor.play("walkback", 8, true);
			this.visitor.scale.x = 1;
		}
		if(nextStep === D){
			this.visitor.position.y += 50;
			this.visitor.play("walkfront", 8, true);
			this.visitor.scale.x = 1;
		}if(nextStep === L){
			this.visitor.position.x -= 50;
			this.visitor.play("walkside", 8, true);
			this.visitor.scale.x = -1;
		}if(nextStep === R){
			this.visitor.position.x += 50;
			this.visitor.play("walkside", 8, true);
			this.visitor.scale.x = 1;
		}
		this.visitorStep++;
	},

	resetVisitor : function(){
		this.visitorStep = -1;
		this.visitor.position.x = this.startVisitorPos.x;
		this.visitor.position.y = this.startVisitorPos.y;
		this.visitor.pastScary = [];
		this.visitor.scared = 0;
		this.visitor.visible=false;
		this.heartbeat.animations.currentAnim.setFrame(0, true);
		this.heartbeat.animations.stop(null, true);
	},

	evaluateVisitorScareFactor : function(){

		this.visitor.pastScary.push(this.visitor.scared);

		var vx = this.visitor.position.x;
		var vy = this.visitor.position.y;

		//scary factors

		//anticipation
		if(this.isLineOfSightClear())
			this.visitor.anticipation++;
		else
			this.visitor.anticipation = 0;

		// the closer to an actor, the more scared you get
		var actorsDistFactor = 0;

		//penaltys
		//penalize for too much sustained scary
		var tooMuchScaryPenalty = 1;

		var distToNearestActor = 10000;
		for(var rowI in this.board){
			for(var colI in this.board[rowI]){
				var sprite = this.board[rowI][colI].sprite;
				if(sprite !== null && sprite.key !== "floor"){
					var sx = sprite.position.x;
					var sy = sprite.position.y;
					var dist = Math.sqrt((vx - sx)*(vx - sx) + (vy - sy)*(vy - sy));

					// if its far away, its not scary
					var distToThisActorFactor = Math.pow(2, -1*dist/50);
					//console.log(sprite.key + " "  + distToThisActorFactor);
					actorsDistFactor = 1 - (1 - actorsDistFactor)*(1-distToThisActorFactor);

					if(distToNearestActor > dist)
						distToNearestActor = dist;
				}
			}
		}


		var recentPastScary = this.visitor.pastScary.slice(this.visitor.pastScary.length - 3);
		for(var pastSVal in recentPastScary){
			tooMuchScaryPenalty *= Math.pow(Math.abs(
				1-recentPastScary[pastSVal]
			), 1/10);
		}

		//jump scare factors
		// high anticipation and high change in distance is jump scare
		var dScare = Math.max(actorsDistFactor - this.visitor.scared, 0);
		var jumpScareFactor = Math.pow(actorsDistFactor, 1/3)*dScare * this.visitor.anticipation/53.0;  // 53 steps to finish


		this.visitor.scared = actorsDistFactor*tooMuchScaryPenalty;
		this.visitor.scared += (1 - this.visitor.scared)*jumpScareFactor;

		console.log("SCARYNESS: " + this.visitor.scared + " TMP: " + tooMuchScaryPenalty + " A: " + this.visitor.anticipation + " J: " + jumpScareFactor);

	},

	isLineOfSightClear : function (){
		var nextStep = path[this.visitorStep];

		//is line of sight clear
		var ilosc = true;

		var col = Math.floor((this.visitor.position.x - 150)/50);
		var row = Math.floor(this.visitor.position.y/50);
		if(nextStep === U){
			console.log("UP");
			while(row >= 0 && this.board[row][col].sprite !== null){
				if(this.board[row][col].sprite.key !== "floor"){
					ilosc = false;
				}
				row--;
			}
		}
		if(nextStep === D){
			console.log("D");
			while(row <= 11 && this.board[row][col].sprite !== null){
				if(this.board[row][col].sprite.key !== "floor"){
					ilosc = false;
				}
				row++;
			}
		}
		if(nextStep === L){
			console.log("L");
			while(col >= 0 && this.board[row][col].sprite !== null){
				if(this.board[row][col].sprite.key !== "floor"){
					ilosc = false;
				}
				col--;
			}
		}
		if(nextStep === R){
			console.log("R");
			while(col <= 11 && this.board[row][col].sprite !== null){
				if(this.board[row][col].sprite.key !== "floor"){
					ilosc = false;
				}
				col++;
			}
		}
		console.log(ilosc);
		return ilosc;
	},

  onClickActor : function (button) {
		if(this.isrunning === true)return;
		this.currentActor = button.key;
  },

  onClickOrientation : function (button) {
		if(this.isrunning === true)return;
		this.currentOrientation = button.key;
  },

  onClickAdd : function (button) {
		if(this.isrunning === true)return;
		// don't add if nothing selected
		if(this.selected.visible === false)
			return;

		// update sprite at location of the selected box
		var sprite = this.board[
			(this.selected.position.y)/50
		][
			(this.selected.position.x - 150)/50
		].sprite;

		var texture_name = this.currentActor;
		if(texture_name === "ghost_down"){
			texture_name = "ghost_" + this.currentOrientation;
		}
		console.log(texture_name + " " + this.currentActor);

		sprite.loadTexture(texture_name);
		sprite.animations.add(texture_name);
		sprite.play(texture_name, 4, true);

		// hide the selected indicator after placing an item
		this.selected.visible = false;
  },

  onClickBoard : function (button) {
		if(this.isrunning === true)return;
		this.selected.visible = true;
		this.selected.position = button.position;
  }
};
