const transformers = require("./transformers.js");
const sentence = require("./sentence/index.js");
const token = require("./token/index.js");
const abbreviations = require("./abbreviations.js");
const englishTransfomers = require("./english/transformers.js");
const englishAbbreviations = require("./english/abbreviations.js");
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
	},
	// English ready to use extension
	english:function(){
		abbreviations.extend(englishAbbreviations);
		englishTransfomers.forEach((transformer)=>transformers.extend(transformer));
	}
};
module.exports = lexed;