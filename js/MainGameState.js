
var MainGameState = function(){};


MainGameState.prototype = {
	preload : function () {
    this.load.image('block','assets/block.png');
		this.load.image('floor','assets/floor.png');

		this.load.image('ghost','assets/ghost.png');
		this.load.image('stabber','assets/stabber.png');
		this.load.image('runner','assets/runner.png');

		this.load.image('up','assets/up.png');
		this.load.image('down','assets/down.png');
		this.load.image('left','assets/left.png');
		this.load.image('right','assets/right.png');

		this.load.image('add','assets/addActor.png');
	},
	create : function() {
			game.stage.backgroundColor = 0xFFFFFF;

      this.addGhostBtn = this.add.sprite(50, 75,'ghost');
      this.addStabberBtn = this.add.sprite(50, 150,'stabber');
      this.addRunnerBtn = this.add.sprite(50, 225,'runner');

      this.orienUBtn = this.add.sprite(50, 300,'up');
      this.orienLBtn = this.add.sprite(25, 350,'left');
      this.orienRBtn = this.add.sprite(75, 350,'right');
      this.orienDBtn = this.add.sprite(50, 400,'down');

      this.addActorBtn = this.add.sprite(50, 500,'add');

			this.board = [];
      for(var i=0;i<12;i++){ // rows
        this.board.push([]);
        for(var j=0;j<13;j++){ // cols
          this.board[i].push({
    				actor: NOACTOR,
    				orientation: UP,
            sprite: this.add.sprite(150 + 50*j,50*i,'block')
    			});
        }
      }

      //state vars
      this.currentOrientation = UP;
      this.currentBlockRow = 0;
      this.currentBlockCol = 0;

	},

	update : function () {
	},

  onClick : function () {

  }
};
