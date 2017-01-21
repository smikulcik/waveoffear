
var MainGameState = function(){};

MainGameState.prototype = {
	preload : function () {
	},
	create : function() {

			game.stage.backgroundColor = 0xFFFFFF;

	},
	onClick : function(){
		game.state.start('Menu');
	},

	update : function () {
	}
};
