import closingWrappers from "../wrappers";
import {abbreviations} from "../abbreviations";
import regexEscape from "../escape_regex";
import {sentenceExtensions as extensions} from "./extensions";

let wrappers = closingWrappers.map(x=>x.z);


export default function(str:string):Array<string>{

	/**
	 * 
	 * The sentence lexer has been adopted from
	 * Xav Ulflander's amazing compendium-js.
	 * https://github.com/Ulflander/compendium-js/blob/master/src/lexer.js#L5
	 * Then it was refactored & optimized for performance and readability.
	 * 
	**/

	str = extensions.initial(str);

	let sentences =<Array<string>> [];
	let arr = str.split(/(\S.+?[….\?!\n])(?=\s+|$|"|'|\))/);
	arr.forEach((single,index)=>{
		single = single.trim();
		if(new RegExp("(^| |\\\(|\\\[|\{)(" + abbreviations.list.map(regexEscape).join("|") + ")[\.!\?] ?$", "i").test(single) || /[ |\.][A-Za-z]\.?$/.test(single)) {
			if((index<arr.length-1) && !/^[A-Za-z]\s/.test(arr[index + 1])) arr[index + 1] = single + ' ' + arr[index + 1].trim();
			else sentences.push(single);
		}
		else if(~["'",'"',"`"].indexOf(single)) sentences[sentences.length-1] = sentences[sentences.length-1] + single;
		else if (single) sentences.push(single);
	});

	/**
	 *
	 * HACK: solves sentences that ends with ."
	 *
	 * For example: I felt like I'm "Corrupting my soul." I was awake at 3 AM.
	 * those were two sentence:
	 * 		I felt like I'm "Corrupting my soul."
	 * 		I was awake at 3 AM.
	 *
	 * Yet the above code might make them: (when there's line breaks between them)
	 * 		I felt like I'm "Corrupting my soul.
	 * 		"
	 * 		I was awake at 3 AM.
	 * 	Or:
	 * 		I felt like I'm "Corrupting my soul. (when it's spaces between them)
	 * 		" I was awake at 3 AM.
	**/

	// Case1: spaces between them
	sentences.forEach((item,index)=>{
		if(
			sentences[index+1] &&
			/^('|"|]|}|\)|>|\/|\|`|"|\*|”|“|«|»|”|”|」|«|﹂|’|⟧|›|⸥|】|⁆|﴿|｝|〞|｠|〉|》|）) /.test(sentences[index+1]) &&
			new RegExp(`${regexEscape(item)}('|"|]|\\\)|}|>|\\\/|\|\\\`|"|\\\*|”|“|«|»|”|”|」|«|﹂|’|⟧|›|⸥|】|⁆|﴿|｝|〞|｠|〉|》|）) `).test(str)
		){
			sentences[index] = sentences[index] + sentences[index+1].charAt(0);
			sentences[index+1] = sentences[index+1].substr(2);
		}
	});

	// Case2: line breaks between them
	sentences.forEach((item,index)=>{
		if(
			item.length === 1 &&
			sentences[index-1] &&
			/^('|"|]|}|\)|>|\/|\|`|"|\*|”|“|«|»|”|”|」|«|﹂|’|⟧|›|⸥|】|⁆|﴿|｝|〞|｠|〉|》|）)$/.test(item) &&
			new RegExp(`${regexEscape(sentences[index-1])}('|"|]|\\\)|}|>|\\\/|\|\\\`|"|\\\*|”|“|«|»|”|”|」|«|﹂|’|⟧|›|⸥|】|⁆|﴿|｝|〞|｠|〉|》|）)\\s`).test(str)
		){
			sentences[index-1] = sentences[index-1] + item;
			sentences[index] = "";
		}
	});

	sentences = sentences.filter(x=>x); // filter out the empty strings
	sentences = extensions.final(sentences);
	return sentences;
}