const closingWrapper = require("../wrappers").map((x)=>x[1]);
const abbreviations = require("../abbreviations.js");
const transformers = require("../transformers.js");

module.exports = {


	/**
	 * 
	 * Sentence Lexer
	 * Will convert a string of text into array of sentences
	 * @param  {String} str 		Text to process
	 * @return {Array}     			Resulting sentences
	 * 
	**/
	lexer:function(str){

		/**
		 * 
		 * The sentence lexer has been adopted from
		 * Xav Ulflander's amazing compendium-js.
		 * https://github.com/Ulflander/compendium-js/blob/master/src/lexer.js#L5
		 * Then it was refractored & optimized for performance and readability.
		 * 
		**/
		str = transformers.apply(str,"sentence","initial");
		var sentences = [];
		var arr = str.split(/(\S.+?[….\?!\n])(?=\s+|$|")/g);
		arr.forEach((single,index)=>{
			single = single.trim();
			if (new RegExp("(^| |\\\(|\\\[|\{)(" + abbreviations.list.join("|") + ")[\.!\?] ?$", "i").test(single) || /[ |\.][A-Za-z]\.?$/.test(single)) {
				// If next token is not a letter
				if (index < arr.length - 1 && !/^[A-Za-z]\s/.test(arr[index + 1])) arr[index + 1] = single + ' ' + arr[index + 1].trim();
				else sentences.push(single);
			}
			// If non empty string
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
				/^('|"|]|}|>|\/|\|`|"|\*|”|“|«|»|”|”|」|«|﹂|’|⟧|›|⸥|】|⁆|﴿|｝|〞|｠|〉|》|）) /.test(sentences[index+1]) &&
				new RegExp(`${item}('|"|]|}|>|\\\/|\|\\\`|"|\\\*|”|“|«|»|”|”|」|«|﹂|’|⟧|›|⸥|】|⁆|﴿|｝|〞|｠|〉|》|）) `).test(str)
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
				/^('|"|]|}|>|\/|\|`|"|\*|”|“|«|»|”|”|」|«|﹂|’|⟧|›|⸥|】|⁆|﴿|｝|〞|｠|〉|》|）)$/.test(item) &&
				new RegExp(`${sentences[index-1]}('|"|]|}|>|\\\/|\|\\\`|"|\\\*|”|“|«|»|”|”|」|«|﹂|’|⟧|›|⸥|】|⁆|﴿|｝|〞|｠|〉|》|）)\\s`).test(str)
			){
				sentences[index-1] = sentences[index-1] + item;
				sentences[index] = "";
			}
		});
		sentences = sentences.filter(x=>x); // filter out the empty strings

		sentences = transformers.apply(sentences,"sentence","final");
		return sentences;
	}
};