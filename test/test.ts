/// <reference path="../node_modules/@types/node/index.d.ts"/>
/// <reference path="../node_modules/@types/mocha/index.d.ts"/>

describe('English', function () {
	require("./english.ts");
});

describe('Tricky cases', function () {
	require("./tricky.cases.ts");
});

describe('Penn Treebank', function () {
	require("./penn-treebank.ts");
});

describe('Extending abbreviations', function () {
	require("./extending.abbreviations.ts");
});