# Lexed
Multi-lingual, extensible word and sentence tokenizer, for natural language processing.

## Installation

Install it on your node project via NPM.

```
npm i --save lexed
```

## Usage

This lexer can be used for both:

* Splitting string into an array of multiple sentences.
* Splitting a string into arrays of sentences and further into arrays of tokens

### Sentence Level

```javascript

const Lexed = require("lexed").Lexed;
const result = new Lexed('Sentece one. Sentece two! sentence 3? sentence "four." Sentece Five. Microsoft Co. released windows 10').sentenceLevel();
console.log(result);
// would give the following array:
[
	'Sentece one.',
	'Sentece two!',
	'sentence 3?',
	'sentence "four."',
	'Sentece Five.',
	'Microsoft Co.',
	'released windows 10'
];
```

> For Obvious reasons, the example above demonstrates how **lexed** core library isn't smart enough on it's own, since it didn't recognize that the `.` when preceded by Co. shouldn't be treated as full stopper.
> However, this is the behavior you should be expecting when using a multi-lingual lexer, since those type of detections are language specific, so the issue should be solved by adding extensions. As you will see later.

### Sentence and token level

```javascript
const Lexed = require("lexed").Lexed;
const result = new Lexed('Microsoft Co. released windows 10').lexer().tokens;
console.log(result);
// would give the following object:
[{
	tokens:[
		'Microsoft',
		'Co',
		'.'
		'released',
		'windows',
		'10'
	],
	raw:"Microsoft Co. released windows 10",
	meta:[null,null,null,null,null],
}];
```
> Again, the example above would really benefit from language specific rules that we'll show how to add later.

## Extensibility

If you're planning to only process english language sentences then you can skip this part and use the built-in english extensions like this:

```javascript
const Lexed = require("lexed").Lexed;
Lexed.extend.english();
```

> __Note__
> The built-in english extensions are tested against penn-treebank corpus and are 99.5% compliant.


### How extensibility works

The only reason I had to write my own lexer library is that I wanted it to be language agnostic, it shouldn't deal with contractions, abbreviations, entity detection, or even email and URL detection. all those detections should be left out for the the extensions that can be added, as they might be language specific or not useful for all of the use cases of this library.

Before starting to write your extensions, you should know how this lexer works.



#### Extending the sentence level lexer

The following diagram explains the exact steps of the sentence lexer:

![http://puu.sh/tesXh/fa48aaa425.png](http://puu.sh/tesXh/fa48aaa425.png)

What you can extend is:

* The initial sentence level transformers.
* The Abbreviations list.
* The final sentence level transformers.


The following examples will introduce you to the API and how you can write your own extensions:

- [Example (1): Extending the abbreviations list](https://github.com/alexcorvi/lexed/blob/master/test/extending.abbreviations.ts)
- [Example (1): Extending the sentence level transformers](https://github.com/alexcorvi/lexed/blob/master/test/extending.sentence.transformers.ts)


#### Extending the token level lexer
The following diagram explains the exact steps of the token lexer:

![http://puu.sh/teDlL/849870ea9b.png](http://puu.sh/teDlL/849870ea9b.png)

What you can extend is:

* The initial token level transformers.
* The final token level transformers. 

The following example will introduce you to the API and how you can write your own extensions:

- [Example: Extending the token level transformers](https://github.com/alexcorvi/lexed/blob/master/test/extending.token.transformers.ts)


You can see how the **lexed** library is actually just a framework (if this word applies here) to handle your transformations processes, an by it's own it would be really bad lexer. However, being able to hook your own rules will empower you and give you more control over the lexication process.


## Contributing

* Clone the repository: `git clone https://github.com/alexcorvi/lexed.git`
* Install dependencies: `cd lexed && npm install`
* Install Mocha globally: `npm install -g mocha`
* Install Typescript globally: `npm install -g typescript`
* ...
* Build `npm run build`
* Test `npm run test`

## License
The MIT License (MIT) - Copyright (c) 2017 Alex Corvi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.