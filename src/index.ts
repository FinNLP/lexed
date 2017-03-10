import abbreviations from "./abbreviations";
import sentenceLexer from "./sentence_level";
import tokenLexer  from "./token_level";

export interface WholeResult {
	tokens:string[][];
	sentences:string[];
	input:string;
}

export class Lexed {
	public input:string;
	public tokens:string[][];
	public sentences:string[];

	constructor(input:string){
		this.input = input;
	};

	public sentenceLevel():string[]{
		this.sentences = sentenceLexer(this.input);
		return this.sentences;
	};

	public tokenLevel():string[][]{
		this.tokens = this.sentences.map((sentence:string)=>tokenLexer(sentence));
		return this.tokens;
	};

	public lexer():WholeResult{
		this.sentenceLevel();
		this.tokenLevel();
		return this;
	};

	static extend = {
		
		transformers:function(extension:Extension){
			if(extension.level === "token") tokenExtensions.add(extension.transformer,extension.when);
			else sentenceExtensions.add(extension.transformer,extension.when);
		},
		
		abbreviations:function(input:Array<string>){
			abbreviations.extend(input);
		},

		english:function(){
			Lexed.extend.abbreviations(englishAbbreviations);
			englishExtensions.forEach(e=>Lexed.extend.transformers(e));
		},

		sentenceExtensions:sentenceExtensions,
		tokenExtensions:tokenExtensions.initialExtensions,
	};
}

export default Lexed;
export const extend = Lexed.extend;