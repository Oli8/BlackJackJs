function init(){

	var stage = new createjs.Stage("canvas");

	var game = {

		deck: [],
		chipsValue: {
			blue: 500,
			black: 100,
			green: 25,
			red: 5,
			white: 1
		},
		buttons: [
			new Button('Hit', '#fff', 100, 100, () => player.hit()),
			new Button('Stand', '#fff', 200, 100, () => player.stand()),
			new Button('Go', '#fff', 935, -430, () => game.go()),
			new Button('Insurance', '#fff', 100, -80, () => player.insure()),
			new Button('Split', '#fff', 100, -40, () => l('split')),
			new Button('Double', '#fff', 100, 0, () => l('double')),
			new Button('Give up', '#fff', 100, 40, () => l('give up'))
		],
		buttonContainer: false,
		dealtChipContainer: false,
		inProgress: false,
		dealt: {
			black: 0,
			blue: 0,
			green: 0,
			red: 0,
			white: 0
		},
		resetChips: function(){
			Object.keys(this.dealt).forEach(color => this.dealt[color] = 0);
		},
		message: {
			text: false,
			init: function(){
				this.text = new createjs.Text(messages.bet, '40px Arial', '#fff');
				this.text.x = 850;
				this.text.y = 0;
				stage.addChild(this.text);
			}
		},

		_alert: function(msg){
			var alertText = new createjs.Text(msg, '30px Arial', 'orange');
			alertText.x = 745;
			alertText.y = 120;
			stage.addChild(alertText);
			createjs.Tween.get(alertText)
				.wait(1000)
				.to({alpha: 0}, 1000, createjs.Ease.getPowInOut(1));
		},

		chipsFromValue: function(value){
			var chips = {
				black: 0,
				blue: 0,
				green: 0,
				red: 0,
				white: 0
			};

			while(value !== 0){
				for(let chip in this.chipsValue){
					//l(chip + ' ' + this.chipsValue[chip])
					if(value >= this.chipsValue[chip]){
						let c = Math.floor(value  / this.chipsValue[chip]);
						value -= c * this.chipsValue[chip];
						chips[chip] += c;
					}
				}
			}

			return chips;
		},

		start: function(){
			stage.enableMouseOver(10);
			createjs.Ticker.addEventListener("tick", tick);
			createjs.Ticker.setFPS(60);
			this.message.init();
			player.fundsText.init();
			this.buildDeck();
			this.addButtons();
			this.addChips();
		},

		go: function(){
			if(player.dealt && !this.inProgress){
				game.inProgress = true;
				player.betted = true;
				this.message.text.text = '';
				this.new();
			}
			else
				l('gotta bet duh')
		},

		end: function(){
			game.dealtChipContainer.removeAllChildren();
			game.inProgress = false;
			player.betted = false;
			player.insurance = false;
			player.deck = [];
			bank.deck = [];
			bank.cardsContainer.removeAllChildren();
			player.cardsContainer.removeAllChildren();
			this.message.text.text = messages.bet;
		},

		new: function(){
			//this.buttonContainer.getChildAt(2);
			bank.cardsContainer.x = player.cardsContainer.x = 450;
			this.distributeCard('player');
			setTimeout(function(){
				game.distributeCard('player');
				setTimeout(function(){
					game.distributeCard('bank');
					setTimeout(function(){
						game.distributeCard('bank', true);
					}, 750);
				}, 750);
			}, 750);
		},

		buildDeck: function(){
			for(let i=0; i<deckNumber; i++){
				for(var suit of suits){
					for(let i=2; i<11; i++)
						this.deck.push(new Card(suit, i));

					for(let v of ['J', 'Q', 'K', 'A'])
						this.deck.push(new Card(suit, v));
				}
			}
		},

		deckValue: function(deck){
			var total = 0;

			deck.forEach(function(card){
				if(card.value >= 2 && card.value < 11)
					total += card.value;
				if(['J', 'Q', 'K'].includes(card.value))
					total += 10;
				if(card.value === 'A')
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
				l('bank: ' + this.deckValue(bank.deck));
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
				l('player :' + this.deckValue(player.deck));
				if(this.deckValue(player.deck) > 21){
					player.lose();
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

		addChips: function(){
			l('add chips');
			if(!player.chipsContainer){
				player.chipsContainer = new createjs.Container();
				player.chipsContainer.x = 600;
				player.chipsContainer.y = 500;

				game.dealtChipContainer = new createjs.Container();
				stage.addChild(player.chipsContainer, game.dealtChipContainer);
			}
			else
				player.chipsContainer.removeAllChildren();

			var base = {x: 100, y: 45};
			for(var chip in player.chips){
				for(let i=0; i<player.chips[chip]; i++){
					l('add')
					var chipImg = new createjs.Bitmap(imgs.chips.get(chip, 'side'));
					chipImg.x = base.x;
					chipImg.y = base.y;
					chipImg.color = chip;
					chipImg.dealt = false;
					//chipImg.shadow = new createjs.Shadow("#000000", 3, 3, 5);
					player.chipsContainer.addChild(chipImg);
					base.y -= 10;
					if(i === player.chips[chip] - 1){ //add click event on top chip
						chipImg.cursor = 'Pointer';
						chipImg.on('mouseover', function(event){
							event.currentTarget.scaleX = 1.1;
							event.currentTarget.scaleY = 1.1;
							event.currentTarget.y -= 8;
						});
						chipImg.on('mouseout', function(event){
							event.currentTarget.scaleX = 1;
							event.currentTarget.scaleY = 1;
							event.currentTarget.y += 8;
						});
						chipImg.addEventListener('click', event => game.throwChip(event.currentTarget));
					}
				}
				base.y = 45;
				base.x += 75;
			}
		},

		throwChip: function(chip){
			if(chip.dealt || game.inProgress) return;
			chip.dealt = true;
			//remove chip from player.chipsContainer and add it to another container
			player.chipsContainer.removeChildAt(player.chipsContainer.getChildIndex(chip));
			chip.x = chip.x + player.chipsContainer.x;
			chip.y = chip.y + player.chipsContainer.y;
			game.dealtChipContainer.addChild(chip);
			createjs.Tween.get(chip)
				.to({x: rand(350, 675) , y: rand(190, 350)}, 750, createjs.Ease.getPowInOut(1));
			var color = chip.color;
			player.dealt += this.chipsValue[color]; //add chip value to player.dealt
			//l(player.dealt);
			player.chips[color] -= 1; //Reduce player chips number
			//l(player.chips);
			player.funds -= game.chipsValue[color];
			player.fundsText.update();
			l(player.funds);
			game.dealt[color] += 1;
			l(game.dealt);
			this.addChips();
		},

		check: function(){
			var bankScore = this.deckValue(bank.deck);
			var playerScore = this.deckValue(player.deck);

			if(bankScore === 21 && bank.deck.length === 2)
				bank.blackjack = true;
			if(playerScore === 21 && player.deck.length === 2)
				player.blackjack = true;

			if(bank.blackjack && player.blackjack)
				player.draw();
			else if(bank.blackjack){
				if(player.insurance)
					player.draw();
				else
					player.lose();
			}
			else if(player.blackjack)
				player.win();

			if(bankScore > 21)
				player.win();
			else if(bankScore >= 17 && bankScore <= 21){
				if(playerScore > bankScore)
					player.win();
				else
					player.lose();
			}
		}

	};

	var bank = {

		deck: [],
		cardsContainer: false,
		blackJack: false,

		play: function(){
			l('bank turn to play :D');
			if(this.deck.length === 2)
				this.cardsContainer.children[1].image.src = imgs.cards.get(this.deck[1].suit, this.deck[1].value);

			var total = game.deckValue(this.deck);
			if(total < 17){
				game.distributeCard('bank');
				l(game.deckValue(this.deck))
				if(game.deckValue(this.deck) < 17)
					setTimeout(() => bank.play(), 1000);
				else
					game.check();
			}
			else
				game.check();
		},

	};

	var player = {

		deck: [],
		cardsContainer: false,
		chipsContainer: false,
		blackjack: false,
		insurance: false,
		funds: 1000,
		fundsText: {
			text: false,
			init: function(){
				this.text = new createjs.Text(player.funds, '30px Arial', '#fff');
				this.text.x = 880;
				this.text.y = 590;
				stage.addChild(this.text);
			},
			update: function(){
				this.text.text = player.funds;
			}
		},
		betted: false,
		dealt: 0,
		chips: {
			blue: 1, //500
			black: 2, //200
			green: 8, // 200
			red: 15, // 75
			white: 15 //15
		},

		hit: function(){
			if(this.betted){
				game.inProgress = true;
				game.distributeCard('player');
			}
			else
				game._alert(messages.warning.bet);
		},

		stand: function(){
			l('stand!');
			if(!this.betted)
				return game._alert(messages.warning.bet);
			game.inProgress = true;
			bank.play();
		},

		insure: function(){
			l('insure');
			if(game.inProgress && bank.deck.length === 2 && bank.deck[0].value === 'A'){
				this.insurance = Math.round(this.funds / 2);
				l('use Insurance')
			}
			else
				game._alert(messages.warning.insurance);
		},

		win: function(){
			l('win!');
			game.message.text.text = messages.win;
			setTimeout(function(){
				game.end();
				player.funds += player.blackjack ? player.dealt * 3 : player.dealt * 2;
				player.fundsText.update();
				player.dealt = 0;
				//get Chips
				for(var chip in game.dealt){
					l([chip, game.dealt[chip]].join(' '))
					player.chips[chip] += player.blackjack ? game.dealt[chip] * 3 : game.dealt[chip] * 2;
				}
				player.blackjack = false;
				game.resetChips(); //reset game.dealt
				game.addChips();
				l(player.chips);
			}, 2000);
		},

		lose: function(){
			l('lose');
			game.message.text.text = messages.lose;
			setTimeout(function(){
				game.end();
				if(player.insurance){
					player.funds -= player.insurance;
					//need to withdraw chip
				}
				player.dealt = 0;
				game.resetChips(); //reset game.dealt
				game.addChips();
				l(player.chips);
			}, 2000);
		},

		draw: function(){
			l('draw :|');
			game.message.text.text = messages.draw;
			setTimeout(function(){
				game.end();
				player.funds += player.dealt;
				player.fundsText.update();
				player.dealt = 0;
				//get Chips
				for(var chip in game.dealt){
					l([chip, game.dealt[chip]].join(' '))
					player.chips[chip] += game.dealt[chip] ;
				}
				player.blackjack = false;
				game.resetChips(); //reset game.dealt
				game.addChips();
				l(player.chips);
			}, 2000);
		}

	};

	function tick(){
		stage.update();
	}

	game.start();

}
