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
			side: 'chipBlackWhite_Side'
		},
		blue: {
			main: 'chipBlueWhite',
			side: 'chipBlueWhite_Side'
		},
		green: {
			main: 'chipGreenWhite',
			side: 'chipGreenWhite_Side'
		},
		red: {
			main: 'chipRedWhite',
			side: 'chipRedWhite_Side'
		},
		white: {
			main: 'chipWhiteBlue',
			side: 'chipWhiteBlue_Side'
		},
		get: function(color, type = 'main'){
			if(type === 'side')
				if(color === 'White')
					return `${this.path}chip${color}Blue_Side.${this.ext}`;
				return `${this.path}chip${color}White_Side.${this.ext}`;

			if(color === 'White')
				return `${this.path}chip${color}Blue.${this.ext}`;
			return `${this.path}chip${color}White.${this.ext}`;
		}
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
