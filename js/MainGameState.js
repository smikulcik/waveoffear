
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
	[1,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1]
];

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
	            sprite: this.add.button(150 + 50*j,50*i,'floor')
	    			});
					}else{
							this.board[i].push({
		    				orientation: "up",
		            sprite: this.add.button(150 + 50*j,50*i,'wall')
		    			});
					}
        }
      }

      //state vars
      this.currentActor = "ghost";
      this.currentOrientation = "up";
      this.selected = this.add.sprite(0,0, "selected");
			this.selected.visible = false;
	},

	update : function () {
	},

  onClickActor : function (button) {
		this.currentActor = button.key;
  },

  onClickOrientation : function (button) {
		this.currentOrientation = button.key;
  },

  onClickAdd : function (button) {
		this.board[3][4].sprite.loadTexture(this.currentActor);
  }
};
