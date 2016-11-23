function init(){

	var stage = new createjs.Stage("canvas");

	var game = {

		deck: [],

		start: function(){
			this.buildDeck();
		},

		buildDeck: function(){
			for(var suit of suits){
				for(var i=2; i<11; i++)
					this.deck.push(new Card(suit, i));
				
				for(var v of ['J', 'Q', 'K', 'A'])
					this.deck.push(new Card(suit, v));
			}
		},

		deckValue: function(){

		}

	};

	var bank = {

		deck: [];

	};

	var player = {

		deck: [];
	};

	game.start();
	game.deck.forEach(v => console.log(v))
}