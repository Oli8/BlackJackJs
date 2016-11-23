function init(){

	var stage = new createjs.Stage("canvas");

	var game = {

		deck: [],

		start: function(){
			this.buildDeck();
			this.distributeCard('player');
			this.distributeCard('player');
			this.distributeCard('bank');
			this.distributeCard('bank', true);
			console.table(bank.deck);
			console.table(player.deck);
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

		},

		distributeCard(to, hided = false){
			var index = rand(0, this.deck.length - 1);
			console.log(index, this.deck[index]);
			var card = this.deck[index];
			if(hided) card.hided = true;

			if(to == 'bank')
				bank.deck.push(card)
			else if(to == 'player')
				player.deck.push(card)

			this.deck.splice(index, 1);
		},

	};

	var bank = {

		deck: []

	};

	var player = {

		deck: [],
		funds: 1000

	};

	game.start();
	//game.deck.forEach(v => console.log(v))
	// console.table(bank.deck);
	// console.table(player.deck);
	l(game.deck.length);
}