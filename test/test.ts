var lexed = require("../dist/index.js");
const assert = require("assert");

describe('Examples', function () {
	require("./extending.abbreviations.ts");
	require("./extending.sentence.transformers.ts");
	require("./extending.token.transformers.ts");
});


describe('Tricky cases', function () {
	require("./tricky.cases.ts");
});

describe('English', function () {
	require("./english.ts");
});

describe('Penn Treebank', function () {
	require("./penn-treebank.ts");
});