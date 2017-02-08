/**
 * 
 * The following example will prevent the token lexer
 * form treating the hash symbol "#" as separate token when
 * it's immediatly followed by a word.
 *
 * i.e. detects hash-tags
 *
**/

const Lexed = require("../dist/index.js").Lexed;
var beforeExtending = new Lexed("Sia's song `The Greatest` begins with the #WeAreTheChildren hash tag.").lexer().tokens[0].tokens;
// ["Sia","'","s","song","`","The","Greatest","`","begins","with","the","#","WeAreTheChildren","hash","tag","."]
// Now let's add the transformers:
Lexed.extend.transformers({
	// since we're adding a token level transformer
	// we'll set the level to: token
	level:"token",
	// this transformer will work initially
	// to transform hash tag tokens into objects
	// when the token is an object it will be ignored
	// from the core (not extended) transformations
	// (the green ones in the chart)
	// like adding a space before every non-word
	// character
	when:"initial",
	transformer:function(arr){
		return arr.map((token)=>{
			// detect if it's a hash tag
			if(/^\#\w+$/.test(token)) {
				return {
					// the returned object can have two keys
					// the token key is the actual token
					// which in this case we didn't change anything
					// in it really
					// we're just wrapping it inside an object so it would
					// be ignored for any core (not extended) transformations
					token:token,
					meta:{
						// the meta object can be used to
						// store values information about the token
						// or anything..
						// this might be used by other NLP process
						hashTag:true,
						value:token.substr(1)
					}
				};
			}
			else return token;
		});
	}
});
// calling the same function with the same input:
var afterExtending = new Lexed("Sia's song `The Greatest` begins with the #WeAreTheChildren hash tag.").lexer().tokens[0].tokens;
// [ "Sia","'","s","song","`","The","Greatest","`","begins","with","the","#WeAreTheChildren","hash","tag","." ];


/// EXAMPLE ENDS HERE ----------- the following are assertion test
const assert = require("assert");
describe('Extending the sentence transformers', function () {
	it('Before extending', function () {
		assert.equal(beforeExtending.length,16);
	});
	it('After extending', function () {
		assert.equal(afterExtending.length,15);
	});
});