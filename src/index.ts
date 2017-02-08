import sentenceLexer from "./sentence/index";
import tokenLexer  from "./token/index";
import {abbreviations}  from "./abbreviations";
import {ResultObject} from "./token/index";
import {tokenExtensions} from "./token/extensions";
import {sentenceExtensions} from "./sentence/extensions";
import englishExtensions from "./english/transformers";
import englishAbbreviations from "./english/abbreviations";

export interface Extension {
	level:string,
	when:string,
	transformer:Function
}

export class Lexed {
	public input:string
	public tokens:Array<ResultObject>
	public sentences:Array<string>

	constructor(input:string){
		this.input = input;
	}

	public sentenceLevel = function(){
		this.sentences =<Array<string>> sentenceLexer(this.input);
		return this.sentences;
	}

	public tokenLevel = function(){
		this.tokens =<Array<ResultObject>> this.sentences.map((sentence:string)=>{
			return tokenLexer(sentence);
		});
		return this.tokens;
	}

	public lexer = function(){
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