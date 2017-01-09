const transformers = require("./transformers.js");
const sentence = require("./sentence/index.js");
const token = require("./token/index.js");
const abbreviations = require("./abbreviations.js");
const lexed = {
	// extension methods
	extend:{
		transformer:transformers.extend,
		abbreviations:abbreviations.extend
	},
	// lexer methods
	sentences:sentence.lexer,
	tokens:token,
	// apply both (sentence level & word level)
	lexer:function(str){
		return sentence.lexer(str).map((sentence)=>token(sentence));
	}
};
module.exports = lexed;