/// <reference path="../node_modules/@types/node/index.d.ts"/>
/// <reference path="../node_modules/@types/mocha/index.d.ts"/>
const assert = require("assert");
import {Lexed} from "../src/index";

/**
 *
 * This example adds the "M." and "Mme"
 * which means Monsieur. and Madame. respectively in French.
 * before adding the abbreviations
 * 
**/

const beforeExtending = new Lexed("M. et Mme. Pierre Dubois sont allés à la tribune hier soir.").sentenceLevel();
/**
 * The above will be equal to
 * ["M. et Mme.","Pierre Dubois sont allés à la tribune hier soir."]
**/
// Now let's add the abbreviations:
Lexed.extend.abbreviations(["m","mme"]);
// Note: The abbreviations should be passed as an array
// and when detected, the detection will be case-insensitive
// calling the same function with the same input:
const afterExtending = new Lexed("M. et Mme. Pierre Dubois sont allés à la tribune hier soir.").sentenceLevel();
// The above will be equal to
// ["M. et Mme. Pierre Dubois sont allés à la tribune hier soir."]


// EXAMPLE ENDS HERE ----------- the following are assertion test
describe('Extending the abbreviations', function () {
	it('Before extending', function () {
		assert.equal(beforeExtending.length,2);
	});
	it('After extending', function () {
		assert.equal(afterExtending.length,1);
	});
});