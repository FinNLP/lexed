import {ResultObject} from "./token/index";
import {abbreviations}  from "./abbreviations";
import englishAbbreviations from "./english/abbreviations";
import englishExtensions from "./english/transformers";
import {sentenceExtensions} from "./sentence/extensions";
import sentenceLexer from "./sentence/index";
import {tokenExtensions} from "./token/extensions";
import tokenLexer  from "./token/index";

export interface Extension {
	level:string,
	when:string,
	transformer:Function
}

export interface WholeResult {
	tokens:Array<ResultObject>,
	sentences:string[],
	input:string
}

export class Lexed {
	public input:string
	public tokens:Array<ResultObject>
	public sentences:Array<string>

	constructor(input:string){
		this.input = input;
	}

	public sentenceLevel = function():Array<string>{
		this.sentences =<Array<string>> sentenceLexer(this.input);
		return this.sentences;
	}

	public tokenLevel = function():Array<ResultObject>{
		this.tokens =<Array<ResultObject>> this.sentences.map((sentence:string)=>{
			return tokenLexer(sentence);
		});
		return this.tokens;
	}

	public lexer = function():WholeResult{
		this.sentenceLevel();
		this.tokenLevel();
		return this;
	}

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
	}
}

export default Lexed;
export const extend = Lexed.extend;