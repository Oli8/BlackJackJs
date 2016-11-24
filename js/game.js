function init(){

	var stage = new createjs.Stage("canvas");

	var game = {

		deck: [],

		start: function(){
			createjs.Ticker.addEventListener("tick", tick);
			createjs.Ticker.setFPS(60);
			this.buildDeck();
			this.distributeCard('player');
			this.distributeCard('player');
			this.distributeCard('bank');
			this.distributeCard('bank', true);
			this.displayCard();
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
			var card = this.deck[index];
			if(hided) card.hided = true;

			if(to == 'bank')
				bank.deck.push(card)
			else if(to == 'player')
				player.deck.push(card)

			this.deck.splice(index, 1);
		},

		displayCard: function(){
			if(!bank.cardsContainer){
				bank.cardsContainer = new createjs.Container();
				bank.cardsContainer.x = 450; //do this better later
				bank.cardsContainer.y = -100;
				stage.addChild(bank.cardsContainer);
			}
			if(!player.cardsContainer){
				player.cardsContainer = new createjs.Container();
				player.cardsContainer.x = 450; //do this better later
				player.cardsContainer.y = 300;
				stage.addChild(player.cardsContainer);
			}

			bank.deck.forEach(function(card, index){
				var cardSrc = card.hided ? imgs.cards.path + imgs.cards.back.red + '.' + imgs.cards.ext : imgs.cards.get(card.suit, card.value);
				var bankCard = new createjs.Bitmap(cardSrc);
				bankCard.x = 50 * index;
				bankCard.y = 100;
				bank.cardsContainer.addChild(bankCard);
			})

			player.deck.forEach(function(card, index){
				var cardSrc = card.hided ? imgs.cards.path + imgs.cards.back.red + '.' + imgs.cards.ext : imgs.cards.get(card.suit, card.value);
				var playerCard = new createjs.Bitmap(cardSrc);
				playerCard.x = 50 * index;
				playerCard.y = 100;
				player.cardsContainer.addChild(playerCard);
			})
		}

	};

	var bank = {

		deck: [],
		cardsContainer: false,

	};

	var player = {

		deck: [],
		cardsContainer: false,
		funds: 1000

	};

	function tick(){
		stage.update();
	}

	game.start();

}
