const imgs = {
	cards: {
		path: 'assets/PNG/Cards/',
		ext: 'png',
		back: {
			blue: 'cardBack_blue5',
			red: 'cardBack_red5',
		},
		get: function(suit, value){
			return `${this.path}card${suit}${value}.${this.ext}`;
		},
	}
};

const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
var cards = [];
for(let i=2; i<11; i++)
	cards.push(i);

cards.push('J', 'Q', 'K', 'A');

class Card{

	constructor(suit, value){
		this.suit = suit;
		this.value = value;
	}

}

// var deck = [];
// for(var suit of suits){
// 	for(var i=2; i<11; i++)
// 		deck.push(new Card(suit, i));
	
// 	for(var v of ['J', 'Q', 'K', 'A'])
// 		deck.push(new Card(suit, v));
// }

