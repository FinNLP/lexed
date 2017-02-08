const Lexed = require("../dist/index.js").Lexed;
const assert = require('assert');
Lexed.extend.english();

const instance = new Lexed("Mr. Jr. Co. Bros., are abbreviations. I'm he's they're we're don't can't won't wouldn't it's she's he's. 1970s 70s 1973's 45:13, 12:02, 01:30 Geo-location, T.F.-Based, 49%-owned -- ... 45$, 150USD, 52nd, '25 I'm He's Haven't I'd U.S. U.K. O'Donnell").lexer().tokens.map(x=>x.tokens);

describe('English extension test', function () {
	it('First sentence', function () {
		assert.equal(instance[0].length,8);
	});
	it('Second sentence', function () {
		assert.equal(instance[1].length,23);
	});
	it('Third sentence', function () {
		assert.equal(instance[2].length,16);
	});
	it('Fourth sentence', function () {
		assert.equal(instance[3].length,22);
	});
});