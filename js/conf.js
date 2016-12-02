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
	},
	chips: {
		path: 'assets/PNG/Chips/',
		ext: 'png',
		black: {
			main: 'chipBlackWhite',
			side: 'chipBlackWhite_side'
		},
		blue: {
			main: 'chipBlueWhite',
			side: 'chipBlueWhite_side'
		},
		green: {
			main: 'chipGreenWhite',
			side: 'chipGreenWhite_side'
		},
		red: {
			main: 'chipRedWhite',
			side: 'chipRedWhite_side'
		},
		white: {
			main: 'chipWhiteBlue',
			side: 'chipWhiteBlue_side'
		},
		get: function(color, type = 'main'){
			return `${this.path}${this[color][type]}.${this.ext}`;
		}
	}
};

const deckNumber = 6;
const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
var cards = [];
for(let i=2; i<11; i++)
	cards.push(i);

cards.push('J', 'Q', 'K', 'A');

const messages = {
	bet: 'Bet !',
	win: 'You win !',
	draw: 'Draw !',
	lose: 'Dealer wins'
};

function rand(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


function l(v){
	console.log(v);
}

function t(v){
	console.table(v);
}
