
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
		this.load.image('map','assets/mapTest.png');

    this.load.image('wall','assets/block.png');
		this.load.image('floor','assets/floor.png');

		this.load.image('ghost','assets/ghost.png');
		this.load.image('stabber','assets/stabber.png');
		this.load.image('runner','assets/runner.png');

		this.load.image('up','assets/up.png');
		this.load.image('down','assets/down.png');
		this.load.image('left','assets/left.png');
		this.load.image('right','assets/right.png');

		this.load.image('add','assets/addActor.png');
		this.load.image('selected','assets/selected.png');
		this.load.image('visitor','assets/visitor.png');
	},
	create : function() {
			game.stage.backgroundColor = 0xFFFFFF;
			this.map = this.add.sprite(0,0,'map');

      this.addGhostBtn = this.add.button(0, 50,'ghost', this.onClickActor, this);
      this.addStabberBtn = this.add.button(0, 150,'stabber', this.onClickActor, this);
      this.addRunnerBtn = this.add.button(0, 250,'runner', this.onClickActor, this);

      this.orienUBtn = this.add.button(50, 350,'up', this.onClickOrientation, this);
      this.orienLBtn = this.add.button(0, 400,'left', this.onClickOrientation, this);
      this.orienRBtn = this.add.button(100, 400,'right', this.onClickOrientation, this);
      this.orienDBtn = this.add.button(50, 450,'down', this.onClickOrientation, this);

      this.addActorBtn = this.add.button(0, 550,'add', this.onClickAdd, this);

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

			this.visitorStep = 0;
			this.startVisitorPos = {
				x: 150 + 50,
			 	y: 50*5
			};
			this.visitor = this.add.sprite(this.startVisitorPos.x, this.startVisitorPos.y, "visitor");
			this.visitor.scared = 0;

			game.time.events.loop(250, this.moveVisitor, this);
      //state vars
      this.currentActor = "ghost";
      this.currentOrientation = "up";
      this.selected = this.add.sprite(0,0, "selected");
			this.selected.visible = false;
	},

	update : function () {

	},

	moveVisitor : function(){
		var nextStep = path[this.visitorStep];
		if(nextStep === U)
			this.visitor.position.y -= 50;
		if(nextStep === D)
			this.visitor.position.y += 50;
		if(nextStep === L)
			this.visitor.position.x -= 50;
		if(nextStep === R)
			this.visitor.position.x += 50;

		this.evaluateVisitorScareFactor();

		this.visitorStep++;
		if(this.visitorStep >= path.length)
			this.resetVisitor();
	},

	resetVisitor : function(){
		this.visitorStep = 0;
		this.visitor.position.x = this.startVisitorPos.x;
		this.visitor.position.y = this.startVisitorPos.y;
	},

	evaluateVisitorScareFactor : function(){
		var vx = this.visitor.position.x;
		var vy = this.visitor.position.y;

		var actorsDistFactor = 0;

		for(var rowI in this.board){
			for(var colI in this.board[rowI]){
				var sprite = this.board[rowI][colI].sprite;
				if(sprite !== null && sprite.key !== "floor"){
					var sx = sprite.position.x;
					var sy = sprite.position.y;
					var dist = Math.sqrt((vx - sx)*(vx - sx) + (vy - sy)*(vy - sy));

					// if its far away, its not scary
					var distToThisActorFactor = Math.pow(2, -1*dist/50);
					actorsDistFactor = 1 - actorsDistFactor*(1-distToThisActorFactor);
				}
			}
		}
		var scareFactor = 1 - distNonScaryFactor;
		console.log("SCARYNESS: " + scareFactor);
	},

  onClickActor : function (button) {
		this.currentActor = button.key;
  },

  onClickOrientation : function (button) {
		this.currentOrientation = button.key;
  },

  onClickAdd : function (button) {
		// don't add if nothing selected
		if(this.selected.visible === false)
			return;

		// update sprite at location of the selected box
		this.board[
			(this.selected.position.y)/50
		][
			(this.selected.position.x - 150)/50
		].sprite.loadTexture(this.currentActor);

		// hide the selected indicator after placing an item
		this.selected.visible = false;
  },

  onClickBoard : function (button) {
		this.selected.visible = true;
		this.selected.position = button.position;
  }
};
