# Lexed
English word and sentence tokenizer, for natural language processing.

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
// or ES6 imports
import Lexed from "lexed";

const result = new Lexed('Sentence one. Sentence two! sentence 3? sentence "four." Sentence Five. Microsoft Co. released windows 10').sentenceLevel();
console.log(result);
// would give the following array:
[
	'Sentence one.',
	'Sentence two!',
	'sentence 3?',
	'sentence "four."',
	'Sentence Five.',
	'Microsoft Co. released windows 10'
];
```

### Sentence and token level

```javascript
const Lexed = require("lexed").Lexed;
// or ES6 imports
import Lexed from "lexed";

const result = new Lexed('Microsoft Co. released windows 10').lexer().tokens;
console.log(result);
// would give the following object:
[
	[
		'Microsoft',
		'Co.'
		'released',
		'windows',
		'10'
	],
];
```

## Extensibility

Currently there's not much to extend in the lexer. Except the abbreviations list.

The abbreviations list is used to detect dots `.` that are not really a full stop for a sentence.

For example the following sentence: `Mr. Andrews went to the office`, if `Mr` isn't registered as an abbreviation, then it the string would be considered two sentences:

- `Mr.`
- `Andrews went to the office`

Which is obviously inaccurate. However, since `Mr.` _is_ actually registered as an abbreviation, then we'll get one sentence: `Mr. Andrews went to the office`.

Now if you want to extend the abbreviations list you should import the abbreviations from _Lexed_ library and add/remove values as you wish.

```javascript
const abbreviations = require("lexed").abbreviations;
// or ES6 imports
import {abbreviations} from "lexed";

// push new abbreviation
abbreviations.push("Mmm"); // french for madam
```

## Contributing

### Perquisites:

- Mocha (testing framework) installed globally
- TypeScript (language compiler) installed globally
- ts-node (typescript) runtime installed globally

### Contributing

* Clone the repository: `git clone https://github.com/alexcorvi/lexed.git`
* Install dependencies: `cd lexed && npm install`
* ...
* Test penn-treebank compliance: `npm run penn`
* Test the library: `npm run test`
* Build the library: `npm run build`

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