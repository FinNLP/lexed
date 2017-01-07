var lexed = require("../lib/index.js");
const assert = require("assert");

describe('Examples', function () {
	require("./extending.abbreviations.js");
	require("./extending.sentence.transformers.js");
	require("./extending.token.transformers.js");
});

lexed.extend.transformer(lexed.outOftheBox.englishContractions);
lexed.extend.transformer(lexed.outOftheBox.numbers);
lexed.extend.transformer(lexed.outOftheBox.complexWords);
lexed.extend.transformer(lexed.outOftheBox.abbreviationDot);
lexed.extend.abbreviations(lexed.outOftheBox.abbreviations);


describe('Sentence Lexication', function () {
	var lexedSentences = lexed.sentence(`Sentece one. Sentece two! sentence 3? sentence "four." Sentece Five. Alex Jr. is a name that I'll never giv to my child. Mr. robot is kinda good, but not that good. 😄😄😄😄😄😄😄😄😄😄😄😄😄😄😄😄😄😄😄😄😄`);
	it('number of sentences', function () {
		assert.equal(lexedSentences.length,8);
	});
	it('Special case: ends with ."', function () {
		assert.equal(lexedSentences[3].endsWith("\""),true);
	});
});

describe('Words tokenization', function () {
	var lexedSentences = lexed.lexer(`My plan was to quit my job, move home with my parents, read books, write books, and wallow in my spare time. In one glorious gesture I'd outdo all quarter-life crises to come before me. I'd find the real Paul, far away from all the noise, and become a better me.`);
	it('Sentences length', function () {
		assert.equal(lexedSentences.length,3);
	});
	it('tokens 1', function () {
		assert.equal(lexedSentences[0].tokens.length,27);
	});
	it('tokens 2', function () {
		assert.equal(lexedSentences[1].tokens.length,15);
	});
	it('tokens 3', function () {
		assert.equal(lexedSentences[2].tokens.length,20);
	});
});