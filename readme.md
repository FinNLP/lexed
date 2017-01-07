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
* Splitting a string (supposedly one sentence) into multiple tokens (words).

### Sentence Level

```javascript

const lexed = require("lexed");
const result = lexed.sentence('Sentece one. Sentece two! sentence 3? sentence "four." Sentece Five. Microsoft Co. released windows 10');
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

> For Obvious reasons, the example above demonstrates how **lexed** core library isn't smart enough on it's own, since it didn't recognize that the `.` when preceeded by Co. shouldn't be treated as sentence stopper.
> However, this is the behavior you should be expecting when using a multi-lingual lexer, since those type of detections are language specific, so the issue should be solved by adding extensions. As you will see later.

### Token (word) level

```javascript
const lexed = require("lexed");
const result = lexed.token('Microsoft Co. released windows 10');
console.log(result);
// would give the following object:
{
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
};
```
> Again, the example above would really benefit from language specific rules that we'll show how to add later.

### Sentence & token (word) level

Both of token level & sentence level tokenization can be done on the same string

```javascript
const lexed = require("lexed");
const result = lexed.lexer("I've listened to you. I've learned something new");
console.log(result);
// would give the following object:
[
	{
		tokens: [ 'I', '\'', 've', 'listened', 'to', 'you', '.' ],
    	raw: 'I\'ve listened to you.',
    	meta:[null,null,null,null,null,null,null],
    },
	{
    	tokens: [ 'I', '\'', 've', 'learned', 'something', 'new' ],
    	raw: 'I\'ve learned something new',
    	meta: [null,null,null,null,null,null],
    }
]
```

> Once more, you can notice how it didn't detect the `'ve` contraction and considered the `'` separate token from the `ve`. This is an English language specific problem that should be solved by adding extensions as we'll see in the examples below.

## Extensibility

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

- [Example (1): Extending the abbreviations list](https://github.com/alexcorvi/lexed/blob/master/test/extending.abbreviations.js)
- [Example (1): Extending the sentence level transformers](https://github.com/alexcorvi/lexed/blob/master/test/extending.sentence.transformers.js)


#### Extending the token level lexer
The following diagram explains the exact steps of the token lexer:

![http://puu.sh/teDlL/849870ea9b.png](http://puu.sh/teDlL/849870ea9b.png)

What you can extend is:

* The initial token level transformers.
* The final token level transformers. 

The following example will introduce you to the API and how you can write your own extensions:

- [Example: Extending the token level transformers](https://github.com/alexcorvi/lexed/blob/master/test/extending.token.transformers.js)


You can see how the **lexed** library is actually just a framework (if this word applies here) to handle your transformations processes, an by it's own it would be really bad lexer. However, being able to hook your own rules will empower you and give you more control over the lexication process.

## Out of the box extensions

If you're feeling lazy, don't want to write your own rules and transformers, then **lexed** library might also be suitable for your needs, since it comes with few rules out of the box:

```javascript
const lexed = require("lexed");

// solve english contractions:
// "I've" => ["I","'ve"]
// "Didn't" => ["did","n't"]
// "Books'" => ["Books","'s"]
lexed.extend.transformer(lexed.outOftheBox.englishContractions);

// solve number
// "100,500,300.5" => ["100,500,300.5"] instead of ["100",",","500"...]
lexed.extend.transformer(lexed.outOftheBox.numbers);

// Solve complex words
// "geo-location" => ["geo-location"] instead of ["geo","-","location"]
lexed.extend.transformer(lexed.outOftheBox.complexWords);

// Solve abbreviations
// "Microsoft Co." => ["Microsoft","Co."] instead of ["Microsoft","Co","."]
lexed.extend.transformer(lexed.outOftheBox.abbreviationDot);


// Extending list of abbreviations
// to the most common 150+ abbreviations
// in English
lexed.extend.abbreviations(lexed.outOftheBox.abbreviations);
```


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