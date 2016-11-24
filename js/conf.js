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

function rand(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


function l(v){
	console.log(v);
}