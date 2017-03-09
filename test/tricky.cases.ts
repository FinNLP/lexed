/// <reference path="../node_modules/@types/node/index.d.ts"/>
/// <reference path="../node_modules/@types/mocha/index.d.ts"/>
const assert = require("assert");
import {Lexed} from "../src/index";

const S1 = new Lexed("This is a quote \"Quote here.\" And this is another sentence.").sentenceLevel();
const S2 = new Lexed("This is a quote 'Quote here.' And this is another sentence.").sentenceLevel();
const S3 = new Lexed("This is a quote (Quote here.) And this is another sentence.").sentenceLevel();


describe('Sentence ending with . and " or \' or )', function () {
	it('"', function () {
		assert.equal(S1[0][S1[0].length-1],"\"");
		assert.equal(S1[1].charAt(0),"A");
	});
	it('\'', function () {
		assert.equal(S2[0][S1[0].length-1],"'");
		assert.equal(S2[1].charAt(0),"A");
	});
	it(')', function () {
		assert.equal(S3[0][S1[0].length-1],")");
		assert.equal(S3[1].charAt(0),"A");
	});
});