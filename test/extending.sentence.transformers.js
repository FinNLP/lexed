/**
 * 
 * The following example will prevent the sentence lexer
 * from splitting the word A! L! E! X! into multiple sentences.
 *
 * I don't know why would anyone do that! but it will just show you
 * how you can add your rules when you face similar situation
 *
**/

const lexed = require("../lib/index.js");
const beforeExtending = lexed.sentences("my new company's name is A! L! E! X!.");
// [ "my new company's name is A!", "L! E!", "X!." ]
// Now let's add the transformers:
lexed.extend.transformer({
	// when adding a transformer it should be an object
	// with three keys
	// - when: can be "initial" or "final"
	when:"initial",
	// - level: can be "sentence" or "token"
	level:"sentence",
	// - transformer: is the transformer function
	// which when used on [initial][sentence] level
	// it receives a string and returns one too.
	transformer:function(str){
		return str.split("A! L! E! X!").join("{{{{THE-COMPANY-NAME-HAS-BEEN-TAKEN-OUT-OF-HERE-AND-THIS-IS-JUST-A-LONG-PLACEHOLDER}}}}");
	}
});
lexed.extend.transformer({
	when:"final",
	level:"sentence",
	// the [final][sentence] level function
	// should receive an array and returns one
	transformer:function(arr){
		return arr.map((sentence)=>{
			return sentence.split("{{{{THE-COMPANY-NAME-HAS-BEEN-TAKEN-OUT-OF-HERE-AND-THIS-IS-JUST-A-LONG-PLACEHOLDER}}}}").join("A! L! E! X!");
		});
	}
});
// calling the same function with the same input:
const afterExtending = lexed.sentences("my new company's name is A! L! E! X!.");
// [ "my new company's name is A! L! E! X!." ]





/// EXAMPLE ENDS HERE ----------- the following are assertion test
const assert = require("assert");
describe('Extending the sentence transformers', function () {
	it('Before extending', function () {
		assert.equal(beforeExtending.length,3);
	});
	it('After extending', function () {
		assert.equal(afterExtending.length,1);
	});
});