/// <reference path="../node_modules/@types/node/index.d.ts"/>
/// <reference path="../node_modules/@types/mocha/index.d.ts"/>
const assert = require("assert");
import {Lexed} from "../src/index";

/**
 * 
 * The following example will prevent the sentence lexer
 * from splitting the word A! L! E! X! into multiple sentences.
 *
 * I don't know why would anyone do that! but it will just show you
 * how you can add your rules when you face similar situation
 *
**/

const beforeExtending = new Lexed("my new company's name is A! L! E! X!.").sentenceLevel();
// [ "my new company's name is A!", "L! E!", "X!." ]
// Now let's add the transformers:
Lexed.extend.transformers({
	// when adding a transformer it should be an object
	// with three keys
	// - when: can be "initial" or "final"
	when:"initial",
	// - level: can be "sentence" or "token"
	level:"sentence",
	// - transformer: is the transformer function
	// which when used on [initial][sentence] level
	// it receives a string and returns one too.
	transformer:function(str:string){
		return str.split("A! L! E! X!").join("{{{{THE-COMPANY-NAME-HAS-BEEN-TAKEN-OUT-OF-HERE-AND-THIS-IS-JUST-A-LONG-PLACEHOLDER}}}}");
	}
});
Lexed.extend.transformers({
	when:"final",
	level:"sentence",
	// the [final][sentence] level function
	// should receive an array and returns one
	transformer:function(arr:string[]){
		return arr.map((sentence:string)=>{
			return sentence.split("{{{{THE-COMPANY-NAME-HAS-BEEN-TAKEN-OUT-OF-HERE-AND-THIS-IS-JUST-A-LONG-PLACEHOLDER}}}}").join("A! L! E! X!");
		});
	}
});
// calling the same function with the same input:
const afterExtending = new Lexed("my new company's name is A! L! E! X!.").sentenceLevel();
// [ "my new company's name is A! L! E! X!." ]


/// EXAMPLE ENDS HERE ----------- the following are assertion test
describe('Extending the sentence transformers', function () {
	it('Before extending', function () {
		assert.equal(beforeExtending.length>1,true);
	});
	it('After extending', function () {
		assert.equal(afterExtending.length,1);
	});
});