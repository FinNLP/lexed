import padWrappers from "./pad_wrappers";
import padNonWords from "./pad_non_words";
import {tokenExtensions as extensions} from "./extensions";
import {TokenObject as TokenObject} from "./extensions";

export interface ResultObject {
	meta:Array<any>;
	tokens:Array<string>;
}

export default function(input:string):ResultObject{
	let arr1:Array<string> = input.replace(/(\w)('s )/,"$1 $2").split(/ +/);
	arr1 = padWrappers(arr1);
	let arr2:Array<string|TokenObject> = extensions.initial(arr1);
	arr2 = arr2.map((token)=>{
		if(typeof token === "string") return padNonWords(token);
		else return token;
	});
	arr2 = arr2.reduce((newArr:Array<string>,token:string)=>{
		if(typeof token === "string") token.split(" ").forEach(subToken=>newArr.push(subToken));
		else newArr.push(token);
		return newArr;
	},[]);
	arr2 = extensions.final(arr2);
	let result = {
		tokens:<Array<string>>[],
		meta:<Array<any>>[],
	};
	arr2.filter((token)=>{
		if(typeof token === "string") return token.length;
		else return token.token;
	}).forEach((token)=>{
		if(typeof token === "string") result.tokens.push(token);
		else {
			result.tokens.push(token.token);
			result.meta.push(token.meta);
		}
	});
	return result;
}