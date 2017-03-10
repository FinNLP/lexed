/// <reference path="../node_modules/@types/node/index.d.ts"/>
/// <reference path="../node_modules/@types/mocha/index.d.ts"/>
const assert = require("assert");
import {Lexed} from "../src/index";



const sampleData = require("./penn-treebank-sample.json");



var correct = 0;
var missed = 0;
var total = 0;
var diagnosis:any[] = [];


sampleData.forEach((input:any,i:number)=>{
	if(i%1000 === 0 && !(global as any)["describe"]) console.log("		-",i);
	new Lexed(input.sentence).lexer().tokens[0].forEach((token,index,tokensArr)=>{
		total++;
		if(
			token === input.tokens[index] ||
			token === "'s" && input.tokens[index] === "'" // this is just a philosophical difference
															// since I like to make it a little bit easier for
															// my POS tagger.
		) correct++;
		else {
			missed++;
			diagnosis.push({
				sentenceExpected:input.sentence,
				sentenceGot:tokensArr.join("//"),
				expected:input.tokens[index],
				got:token
			});
		}
	});
});

const percent = Math.round((correct/total)*10000)/100;

if(!(global as any)["describe"]) {
	console.log(`Compliance: ${percent}%, missed: ${missed} words out of ${total}.`);
	require("fs").writeFileSync("./diagnosis.json",JSON.stringify(diagnosis,null,4));
}

else {
	describe("Compliance with Penn Treebank",function(){
		it("more than 99",function(){
			assert.equal(percent>99,true);
		});
	});
}