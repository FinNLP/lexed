const Lexed = require("../dist/index.js").Lexed;
const sampleData = require("./penn-treebank-sample.json");
Lexed.extend.english();

var correct = 0;
var missed = 0;
var total = 0;
var diagnosis = [];

describe('Penn Treebank test', function () {
	it('description', function () {
		this.timeout(Infinity);
		sampleData.forEach((input,i)=>{
			if(i%1000 === 0) console.log("		-",i);
			new Lexed(input.sentence).lexer().tokens[0].tokens.forEach((token,index,tokensArr)=>{
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