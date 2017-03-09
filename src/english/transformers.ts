/**
 * Those are ready to use extensions for English language
 * The order of those transformers is relevant.
**/

import escRegExp from "../escape_regex";
import {abbreviations} from "../abbreviations";
import {TokenObject as TokenObject} from "../token/extensions";

export default [

	/**
	 * 
	 * Date / years and yearly ranges
	 * Examples: 1970s 70s 1973's
	 * 
	**/
	{
		level:"token",
		when:"initial",
		transformer:function(arr:Array<string|TokenObject>):Array<string|TokenObject>{
			var year = /^((\d{4})('s))((\W+)*)$/i;
			var range = /((('\d+)|\d+)0s)((\W+)*)$/;
			const newArr:Array<string|TokenObject> = [];
			for (var index = 0; index < arr.length; index++) {
				let token = arr[index];
				if(typeof token !== "string") newArr.push(token);
				else if(range.test(token)) {
					token.replace(range,"$1 $4").split(" ").forEach((x,i)=>{
						if(i&&x) newArr.push(x);
						else newArr.push({
							token:x,
							meta:{pos:"NNS",yearlyRange:true},
						});
					});
				}
				else if(year.test(token)) {
					token.replace(year,"$1 $2 $3").split(" ").forEach((x,i)=>{
						if(i&&x) newArr.push(x);
						else newArr.push({
							token:x,
							meta:{pos:"CD",yearlyPOS:true}
						});
					});
				}
				else newArr.push(token);
			}
			return newArr;
		}
	},


	/**
	 * 
	 * Ratios and times (same RegExp)
	 * 45:13, 12:02, 01:30
	 *
	 * Time indicators a.m., p.m.
	 * 
	**/
	{
		level:"token",
		when:"initial",
		transformer:function(arr:Array<string|TokenObject>):Array<string|TokenObject>{
			var timeAndRatios = /(\d+:\d+)((\W+)*)/;
			var timeIndicatorWithDot = /((p|a)\.m\.)((\W+)?)/i;
			var timeIndicatorWithoutDot = /((p|a)\.m)((\W+)?)/i;
			var timeWithOptionalSeconds = /^(([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]((:[0-5][0-9])?))((\W+)*)$/;
			const newArr:Array<string|TokenObject> = [];
			for (var index = 0; index < arr.length; index++) {
				const token = arr[index];
				if(typeof token !== "string") newArr.push(token);
				else if(timeWithOptionalSeconds.test(token)) {
					token.replace(timeWithOptionalSeconds,"$1 $5").split(" ").forEach((x,i)=>{
						if(x&&i) newArr.push(x);
						else newArr.push({token:x,meta:{time:true,pos:"CD"}});
					});
				}
				else if(timeAndRatios.test(token)) {
					token.replace(timeAndRatios,"$1 $2").split(" ").forEach((x,i)=>{
						if(i&&x) newArr.push(x);
						else {
							var obj = {token:x,meta:{ratio:true,pos:"CD",time:false}};
							if(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(x)) obj.meta.time = true;
							newArr.push(obj);
						}
					});
				}
				else if(index !== arr.length -1 && timeIndicatorWithDot.test(token)) {
					token.replace(timeIndicatorWithDot,"$1 $3").split(" ").forEach((x,i)=>{
						if(i&&x) newArr.push(x);
						else newArr.push({token:x,meta:{timeIndicator:true,pos:"CD"}});
					});
				}
				else if(timeIndicatorWithoutDot.test(token)) {
					token.replace(timeIndicatorWithoutDot,"$1 $3").split(" ").forEach((x,i)=>{
						if(i&&x) newArr.push(x);
						else newArr.push({token:x,meta:{timeIndicator:true,pos:"CD"}});
					});
				}
				else newArr.push(token);
			}
			return newArr;
		}
	},


	/**
	 * Complex Words
	 * Example: Geo-location, T.F.-Based, 49%-owned
	**/
	{
		level:"token",
		when:"initial",
		transformer:function(arr:Array<string|TokenObject>):Array<string|TokenObject>{
			var complexWord = /^(((\w+)*(\-|\/)\w+)+)((\W+)*)$/; // geo-location
			var acronymComplexWord1 = /^((([A-Z]\.)+)(((\w+)*(\-|\/)\w+)+))((\W+)*)$/; // T.F.-based
			var acronymComplexWord2 = /((((\w+)*(\-|\/))+)(([A-Z]\.)+))((\W+)*)$/; // Canadian-U.S.
			var complexWordsWithNumbers = /^(([^\d]+)*((\d{1,3})+(,\d{3})*(\.\d+)?)+(([\W]+\w+)+))((\W+)*)$/; // 4.9%-held

			const newArr:Array<string|TokenObject> = [];
			for (var index = 0; index < arr.length; index++) {
				const token = arr[index];
				if(typeof token !== "string") newArr.push(token);
				else if(complexWord.test(token)) token.replace(complexWord,"$1 $5").split(" ").forEach((x,i)=>{
					if(i&&x) newArr.push(x);
					else newArr.push({
						token:x,
						meta:{complexWord:true}
					});
				});
				else if(acronymComplexWord1.test(token)) token.replace(acronymComplexWord1,"$1 $8").split(" ").forEach((x,i)=>{
					if(i&&x) newArr.push(x);
					else newArr.push({
						token:x,
						meta:{
							complexWord:true,
							startingWithAcronym:true,
						}
					});
				});
				else if(acronymComplexWord2.test(token)) token.replace(acronymComplexWord2,"$1 $8").split(" ").forEach((x,i)=>{
					if(i&&x) newArr.push(x);
					else newArr.push({
						token:x,
						meta:{
							complexWord:true,
							startingWithAcronym:true,
						}
					});
				});
				else if(complexWordsWithNumbers.test(token)) token.replace(complexWordsWithNumbers,"$1 $9").split(" ").forEach((x,i)=>{
					if(i&&x) newArr.push(x);
					else newArr.push({
						token:x,
						meta:{
							complexWord:true,
							startingWithNumber:true,
						}
					});
				});
				else newArr.push(token);
			};
			return newArr;
		}
	},


	/**
	 * Special punctuation, those punctuation should be considered as one
	 * Example: -- and ...
	**/
	{
		level:"token",
		when:"initial",
		transformer:function(arr:Array<string|TokenObject>):Array<string|TokenObject>{
			const newArr:Array<string|TokenObject> = [];
			for (var index = 0; index < arr.length; index++) {
				var token = arr[index];
				if(typeof token !== "string") newArr.push(token);
				else if(/^--$/.test(token)) newArr.push({token:token,meta:{midSentencePunct:true,specialPunct:true}});
				else if(/^([^\.]+)*((\.){2,})$/.test(token)) {
					token
					.replace(/^([^\.]+)*((\.){2,})$/,"$1 ...")
					.split(" ")
					.forEach((x,i)=>{
						if(i) newArr.push({token:x,meta:{specialPunct:true,triplePeriodPunct:true}});
						else newArr.push(x);
					});
				}
				else newArr.push(token);
			};
			return newArr; 
		}
	},


	/**
	 * 
	 * Numbers special cases:
	 * - 45$, 150USD, 52nd, '25
	 * 
	**/
	{
		when:"initial",
		level:"token",
		transformer:function(arr:Array<string|TokenObject>):Array<string|TokenObject>{
			var numAndSymb = /^([^\d]+)*((\d{1,3})+(,\d{3})*(\.\d+)?)+([^\d]+)*/;
			var orders = /^((\d+)*(1st|2nd|3rd|\dth))((\W+)*)$/i;
			var hyphenedOrders = /((\w+)*)(\'\d+)((\W+)?)/;
			const newArr:Array<string|TokenObject> = [];
			for (var index = 0; index < arr.length; index++) {
				var token = arr[index];
				if(typeof token !== "string") {
					newArr.push(token);
					continue;
				}
				else if(typeof token === "string" && orders.test(token)) token.replace(orders,"$1 $4").split(" ").forEach((x,i)=>{
					if(x&&i) newArr.push(x);
					else newArr.push({
						token:x,
						meta:{
							order:true,
							value:parseFloat((token as string).replace(/^([^\d]*)(\d+)([^\d]*)$/,"$2").trim())
						}
					});
				});
				else if(hyphenedOrders.test(token)) token.replace(hyphenedOrders,"$1 $3 $4").split(" ").forEach((x,i)=>{
					if(x&&i!==1) newArr.push(x);
					else newArr.push({
						token:x,
						meta:{
							hyphenedOrder:true,
							value:parseFloat(x.substr(1))
						}
					});
				});
				else if(numAndSymb.test(token)) token.replace(numAndSymb,"$1 $2 $6").split(" ").forEach((x,i,arr)=>{
					if(i===1) {
						var unit = (arr[0]||arr[2]||newArr[index+1]||newArr[index-1]||"");
						if(typeof unit === "string") unit = unit.replace(/\W/,"");
						else unit = unit.token;
						newArr.push({
							token:x,
							meta:{
								value:true,
								number:true,
								unit:unit
							}
						});
					}
					else if(x) newArr.push(x);
				});
				else newArr.push(token);
			};
			return newArr;
		}
	},


	/**
	 * 
	 * English language contractions:
	 * I'm He's Haven't I'd .. etc
	 * 
	**/
	{
		level:"token",
		when:"initial",
		transformer:function(arr:Array<string|TokenObject>):Array<string|TokenObject>{

			var POS = /((\w+)*)('s)((\W+)*)$/;
			var simple = /^((\w+)*)('ll|'m|'re|'ve|'d|'clock)((\W+)*)$/i;
			var negation = /^(do|does|did|ca|could|sha|should|are|were|wo|would|have|had|has|is|was|might|ai)(n't)((\W+)*)$/i;
			let newArr:Array<string|TokenObject> = [];
			for (var index = 0; index < arr.length; index++) {
				var token = arr[index];
				if(typeof token === "object") newArr.push(token);
				else if(POS.test(token)) {
					if(token === token.toUpperCase()) {
						var sentence = arr.filter((x:string)=>x.length).join("");
						if(sentence === sentence.toUpperCase()) newArr.push.apply(newArr,token.replace(POS,"$1 $3 $4").split(" "));
						else newArr.push.apply(newArr,token.replace(/^([A-Z0-9]+'s)(\W+)*$/," $1 $2").split(" "));
					}
					else newArr.push.apply(newArr,token.replace(POS,"$1 $3 $4").split(" "));
				}
				else if(simple.test(token)) newArr.push.apply(newArr,token.replace(simple,"$1 $3 $4").split(" "));
				else if(negation.test(token)) newArr.push.apply(newArr,token.replace(negation,"$1 $2 $3").split(" "));
				else if(/^s'$/i.test(token)) newArr.push({token:token,meta:{POS:true}});
				else if(/^ol'$/i.test(token.toLowerCase())) newArr.push({token:token,meta:{contraction:true}});
				else newArr.push(token);
			}
			newArr = newArr.filter(x=>{
				if(typeof x === "string") return x.length;
				else return x.token.length;
			});
			return newArr;
		}
	},


	/**
	 * 
	 * English common abbreviations
	 * 
	**/
	{
		level:"token",
		when:"initial",
		transformer:function(arr:Array<string|TokenObject>):Array<string|TokenObject>{
			return arr.reduce((newArr:Array<string|TokenObject>,token,index)=>{
				var regexGreedy = new RegExp(`^((${abbreviations.list.map(escRegExp).join("|")})\\.)((\\W+)*)$`,'i');
				var regexNONGreedy = new RegExp(`^((${abbreviations.list.map(escRegExp).join("|")}))((\\W+)*)$`,'i');
				if(typeof token !== "string") newArr.push(token);
				else if(regexGreedy.test(token)) token.replace(regexGreedy,"$1 $3").split(" ").forEach((x,i)=>{
					if(x&&i) newArr.push(x);
					else {
						newArr.push({
							token:x,
							meta:{abbrev:true}
						});
					}
				});
				else if(regexNONGreedy.test(token)) token.replace(regexNONGreedy,"$1 $3").split(" ").forEach((x,i)=>{
					if(x&&i) newArr.push(x);
					else {
						newArr.push({
							token:x,
							meta:{abbrev:true}
						});
					}
				});
				else newArr.push(token);
				return newArr;
			},[])
			.filter(x=>{
				if(typeof x === "string") return x.length;
				else return x.token.length;
			});
		}
	},


	/**
	 *
	 * Acronyms and unusual names
	 * U.S. U.K. O'Donnell E! 4SQ'EM .. etc
	 * 
	**/
	{
		level:"token",
		when:"initial",
		transformer:function(arr:Array<string|TokenObject>):Array<string|TokenObject>{
			var singleLetterAcronyms = /^([A-Z])(,*)$/;
			var pureAcronyms = /^(([A-Z]\.)+)((\W+)*)$/;
			var unusualNames = /^((([A-Z0-9])+[&!@#$%+-]+([A-Z0-9]){0,})+)((\W+)*)$/;
			var acronymsAndUnusualNamesGREEDY = /^(([A-Z0-9s].[\w.]*)+)((\W+)*)$/; // includes the "."
			var acronymsAndUnusualNamesNonGreedy = /^(([A-Z0-9].[\w.]??[A-Z0-9s]?)+)((\W+)*)$/; // doesn't include the last "."
			var capsNames = /^(([A-Z]|\d)+)((\W+)*)$/;
			const newArr:Array<string|TokenObject> = [];
			for (var index = 0; index < arr.length; index++) {
				var token = arr[index];
				if (typeof token !== "string") newArr.push(token);
				else if(unusualNames.test(token)) token.replace(unusualNames,"$1 $5").split(" ").forEach((x,i)=>{
					if(x&&i) newArr.push(x);
					else newArr.push({token:x,meta:{pos:"NNP",properNoun:true}});
				});
				else if(singleLetterAcronyms.test(token)) {
					token.replace(singleLetterAcronyms,"$1 $2").split(" ").forEach((x,i)=>{
						if(x&&i) newArr.push(x);
						else newArr.push({token:x,meta:{}});
					});
				}
				else if(pureAcronyms.test(token)) token.replace(pureAcronyms,"$1 $3").split(" ").forEach((x,i)=>{
					if(x&&i) newArr.push(x);
					else {
						if(x.charAt(x.length-1) === "." && index === arr.length -1) {
							x = x.substr(0,x.length-1);
							newArr.push({
								token:x,
								meta:{acronym:true,pos:"NNP"}
							});
							newArr.push(".");
						}
						else {
							newArr.push({
								token:x,
								meta:{acronym:true,pos:"NNP"}
							});
						}
					}
				});
				else if(index !== arr.length-1 && acronymsAndUnusualNamesGREEDY.test(token)) token.replace(acronymsAndUnusualNamesGREEDY,"$1 $3").split(" ").forEach((x,i)=>{
					if(x&&i) newArr.push(x);
					else {
						if(x.charAt(x.length - 1) !== "." || x === x.toUpperCase()) {
							var obj = {token:x,meta:{}};
							newArr.push(obj);
						}
						else {
							newArr.push(x.substr(0,x.length-1));
							newArr.push(x.charAt(x.length - 1));
						}
					}
				});
				else if(acronymsAndUnusualNamesNonGreedy.test(token)) token.replace(acronymsAndUnusualNamesNonGreedy,"$1 $3").split(" ").forEach((x,i)=>{
					if(x&&i) newArr.push(x);
					else {
						var obj = {token:x,meta:{acronym:false,properNoun:false}};
						if(/\./.test(x)) obj.meta.acronym = true;
						obj.meta.properNoun = true;
						newArr.push(obj);
					}
				});
				else if(capsNames.test(token)) token.replace(capsNames,"$1 $3").split(" ").forEach((x,i)=>{
					if(x&&i) newArr.push(x);
					else newArr.push({token:x,meta:{caps:true}});
				});
				else newArr.push(token);
			}
			return newArr;
		}
	}
].reverse();