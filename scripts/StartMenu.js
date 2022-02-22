HoppyHolden.StartMenu = function(game) {
	this.startBG;
	this.startPrompt;
};


HoppyHolden.StartMenu.prototype = {

create: function () {
		startBG = this.add.image(0, 0, 'titlescreen');
		startBG.inputEnabled = true;
		startBG.events.onInputDown.addOnce(this.startGame, this);
		
		//startPrompt = this.add.bitmapText(0,0, 'eightbitwonder', 'Touch to Start!', 24);
	},

	startGame: function (pointer) {
		this.state.start('Game');
	}
};