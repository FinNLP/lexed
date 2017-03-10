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
}

export default Lexed;
export const extend = Lexed.extend;