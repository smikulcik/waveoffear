
var Menu = function(){};

Menu.prototype = {
	preload : function(){
		this.load.image('menu','assets/menu.png');
			this.load.image('button','assets/block.png');
	},

	create : function(){
		this.menu = this.add.sprite(0,0,'menu');
		this.button = game.add.button(550, 500, 'button', this.onClick, this);
	},

	update : function(){
	},

	onClick : function(){
		game.state.start('MainGameState');
	}
};
