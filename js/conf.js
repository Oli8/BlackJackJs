const imgs = {
	cards: {
		path: 'assets/Cards/',
		ext: 'png',
		back: {
			blue: 'cardBack_blue5',
			red: 'cardBack_red5',
		},
		getCard: function(suit, value){
			return `${this.path}card${suit}${value}.${this.ext}`;
		},
	}
};

const suits = ['Clubs', 'Diamonds', 'Heartds', 'Spades'];
var cards = [];
for(let i=2; i<11; i++)
	cards.push(i);

cards.push('J', 'Q', 'K', 'A');
