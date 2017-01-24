const lexed = require("../lib/index.js");
const sampleData = require("./penn-treebank-sample.json");
lexed.english();

var correct = 0;
var missed = 0;
var total = 0;
var diagnosis = [];

describe('Penn Treebank test', function () {
	it('description', function () {
		this.timeout(Infinity);
		sampleData.forEach((input)=>{
			lexed.tokens(input.sentence).tokens.forEach((token,index,tokensArr)=>{
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
		this.test.title = `Complicance: ${Math.round((correct/total)*10000)/100}%, missed: ${missed} words out of ${total}.`;
		require("fs").writeFileSync("./diagnosis.json",JSON.stringify(diagnosis,null,4));
	});
});