function init(){

	var stage = new createjs.Stage("canvas");

	var game = {

		deck: [],
		buttons: [
			new Button('Hit', '#fff', 100, 100, () => player.hit()),
			new Button('Stand', '#fff', 200, 100, () => player.stand())
		],
		buttonContainer: false,

		start: function(){
			stage.enableMouseOver(10);
			createjs.Ticker.addEventListener("tick", tick);
			createjs.Ticker.setFPS(60);
			this.buildDeck();
			this.distributeCard('player');
			this.distributeCard('player');
			this.distributeCard('bank');
			this.distributeCard('bank', true);
			this.addButtons();
		},

		buildDeck: function(){
			for(var suit of suits){
				for(var i=2; i<11; i++)
					this.deck.push(new Card(suit, i));
				
				for(var v of ['J', 'Q', 'K', 'A'])
					this.deck.push(new Card(suit, v));
			}
		},

		deckValue: function(deck){
			var total = 0;

			deck.forEach(function(card){
				if(card.value >= 2 && card.value < 11)
					total += card.value;
				if(['J', 'Q', 'K'].includes(card.value))
					total += 10;
				if(card.value == 'A')
					total += 11; //review later
			});

			return total;
		},

		distributeCard(to, hidden = false){
			var index = rand(0, this.deck.length - 1);
			var card = this.deck[index];
			if(hidden) card.hidden = true;

			if(to == 'bank')
				bank.deck.push(card)
			else if(to == 'player')
				player.deck.push(card)

			this.deck.splice(index, 1);
			this.displayCard(card, to);
		},

		displayCard: function(card, owner){
			if(!bank.cardsContainer){
				bank.cardsContainer = new createjs.Container();
				bank.cardsContainer.y = -100;
				stage.addChild(bank.cardsContainer);
				bank.cardsContainer.x = 450; //do this better later
			}
			if(!player.cardsContainer){
				player.cardsContainer = new createjs.Container();
				player.cardsContainer.y = 300;
				stage.addChild(player.cardsContainer);
				player.cardsContainer.x = 450; //do this better later
			}

			if(owner === 'bank'){
				var cardSrc = card.hidden ? imgs.cards.path + imgs.cards.back.red + '.' + imgs.cards.ext : imgs.cards.get(card.suit, card.value);
				var bankCard = new createjs.Bitmap(cardSrc);
				bankCard.x = 0;
				bankCard.y = -100;
				bank.cardsContainer.addChild(bankCard);
				createjs.Tween.get(bankCard)
					.to({x: 50 * bank.deck.length, y: 100}, 750, createjs.Ease.getPowInOut(1))
				bank.cardsContainer.x -= 20;
			}
			else if(owner === 'player' ){
				var cardSrc = card.hidden ? imgs.cards.path + imgs.cards.back.red + '.' + imgs.cards.ext : imgs.cards.get(card.suit, card.value);
				var playerCard = new createjs.Bitmap(cardSrc);
				playerCard.x = 100;
				playerCard.y = -400;
				player.cardsContainer.addChild(playerCard);
				createjs.Tween.get(playerCard)
					.to({x: 50 * player.deck.length, y: 100}, 750, createjs.Ease.getPowInOut(1))
				player.cardsContainer.x -= 20;
				l(this.deckValue(player.deck));
				if(this.deckValue(player.deck) > 21){
					player.canHit = false;
					l('you lost');
				}
			}

		},

		addButtons: function(){
			this.buttonContainer = new createjs.Container();
			this.buttonContainer.x = -70;
			this.buttonContainer.y = 500;
			stage.addChild(this.buttonContainer);

			this.buttons.forEach(function(b){
				var button = new createjs.Text(b.text, '30px Arial', b.color);
				button.x = b.x;
				button.y = b.y;
				var hit = new createjs.Shape();
				hit.graphics.beginFill('#000').drawRect(0, 0, button.getMeasuredWidth(), button.getMeasuredHeight());
				button.hitArea = hit;
				button.alpha = 0.7;
				button.on('mouseover', function(event){
					button.alpha = 1;
					button.cursor = 'Pointer';
				});
				button.on('mouseout', event => button.alpha = 0.7);
				button.addEventListener('click', b.onclick);
				game.buttonContainer.addChild(button);
			})
		},

	};

	var bank = {

		deck: [],
		cardsContainer: false,

		play: function(){
			l('bank turn to play :D');
		},

	};

	var player = {

		deck: [],
		cardsContainer: false,
		canHit: true,
		funds: 1000,

		hit: function(){
			if(this.canHit)
				game.distributeCard('player');
			else
				l('no can do');
		},

		stand: function(){
			l('stand!');
			this.canHit = false;
			bank.play();
		}

	};

	function tick(){
		stage.update();
	}

	game.start();

}
