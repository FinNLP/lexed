/**
 * Those are ready to use extensions for English language
 * The order of those transformers is relevant.
 * TODO: Add meta
 * 
**/
module.exports = [

	/**
	 * 
	 * Date / years and yearly ranges
	 * Examples: 1970s 70s 1973's
	 * 
	**/
	{
		level:"token",
		when:"initial",
		transformer:function(arr){
			var year = /^(\d{4})('s)((\W+)*)$/i;
			var range = /((('\d+)|\d+)0s)((\W+)*)$/;
			return arr.reduce((newArr,token)=>{
				if(typeof token !== "string") newArr.push(token);
				else if(range.test(token)) {
					token.replace(range,"$1 $4").split(" ").forEach((x,i)=>{
						if(i&&x) newArr.push(x);
						else newArr.push({
							token:x,
							meta:{
								yearlyRange:true
							},
						});
					});
				}
				else if(year.test(token)) {
					token.replace(year,"$1 $2 $3").split(" ").forEach((x,i)=>{
						if(i&&x) newArr.push(x);
						else newArr.push({
							token:x,
							meta:{
								yearPOS:true,
							}
						});
					});
				}
				else newArr.push(token);
				return newArr;
			},[]);
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
		transformer:function(arr){
			var timeAndRatios = /(\d+:\d+)((\W+)*)/;
			var timeIndicatorWithDot = /((p|a)\.m\.)((\W+)?)/i;
			var timeIndicatorWithoutDot = /((p|a)\.m)((\W+)?)/i;
			var timeWithOptionalSeconds = /^(([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]((:[0-5][0-9])?))((\W+)*)$/;
			return arr.reduce((newArr,token,index)=>{
				if(typeof token !== "string") newArr.push(token);
				else if(timeWithOptionalSeconds.test(token)) {
					token.replace(timeWithOptionalSeconds,"$1 $5").split(" ").forEach((x,i)=>{
						if(x&i) newArr.push(x);
						else newArr.push({token:x,meta:{time:true}});
					});
				}
				else if(timeAndRatios.test(token)) {
					token.replace(timeAndRatios,"$1 $2").split(" ").forEach((x,i)=>{
						if(i&&x) newArr.push(x);
						else {
							var obj = {token:x,meta:{ratio:true}};
							if(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(x)) obj.meta.time = true;
							newArr.push(obj);
						}
					});
				}
				else if(index !== arr.length -1 && timeIndicatorWithDot.test(token)) {
					token.replace(timeIndicatorWithDot,"$1 $3").split(" ").forEach((x,i)=>{
						if(i&&x) newArr.push(x);
						else newArr.push({token:x,meta:{timeIndicator:true}});
					});
				}
				else if(timeIndicatorWithoutDot.test(token)) {
					token.replace(timeIndicatorWithoutDot,"$1 $3").split(" ").forEach((x,i)=>{
						if(i&&x) newArr.push(x);
						else newArr.push({token:x,meta:{timeIndicator:true}});
					});
				}
				else newArr.push(token);
				return newArr;
			},[]);
		}
	},


	/**
	 * Complex Words
	 * Example: Geo-location, T.F.-Based, 49%-owned
	**/
	{
		level:"token",
		when:"initial",
		transformer:function(arr){
			var complexWord = /^(((\w+)*(\-|\/)\w+)+)((\W+)*)$/; // geo-location
			var acronymComplexWord1 = /^((([A-Z]\.)+)(((\w+)*(\-|\/)\w+)+))((\W+)*)$/; // T.F.-based
			var acronymComplexWord2 = /((((\w+)*(\-|\/))+)(([A-Z]\.)+))((\W+)*)$/; // Canadian-U.S.
			var complexWordsWithNumers = /^(([^\d]+)*((\d{1,3})+(,\d{3})*(\.\d+)?)+(([\W]+\w+)+))((\W+)*)$/; // 4.9%-held
			return arr
			.reduce((newArr,token)=>{
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
				else if(complexWordsWithNumers.test(token)) token.replace(complexWordsWithNumers,"$1 $9").split(" ").forEach((x,i)=>{
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
				return newArr;
			},[]);
		}
	},


	/**
	 * Special punctuations, those punctuations should be considered as one
	 * Example: -- and ...
	**/
	{
		level:"token",
		when:"initial",
		transformer:function(arr){
			return arr.reduce((newArr,token)=>{
				if(/^--$/.test(token)) newArr.push({token:token,meta:{midSentencePunct:true,specialPunct:true}});
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
				return newArr;
			},[]); 
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
		transformer:function(arr){
			var numAndSymb = /^([^\d]+)*((\d{1,3})+(,\d{3})*(\.\d+)?)+([^\d]+)*/;
			var orders = /^((\d+)*(1st|2nd|3rd|\dth))((\W+)*)$/i;
			var hyphenedOrders = /((\w+)*)(\'\d+)((\W+)?)/;
			return arr
			.reduce((newArr,token,index,tokensArr)=>{
				if(typeof token !== "string") newArr.push(token);
				else if(orders.test(token)) token.replace(orders,"$1 $4").split(" ").forEach((x,i)=>{
					if(x&&i) newArr.push(x);
					else newArr.push({
						token:x,
						meta:{
							order:true,
							value:token.replace(/^([^\d]*)(\d+)([^\d]*)$/,"$2").trim()*1
						}
					});
				});
				else if(hyphenedOrders.test(token)) token.replace(hyphenedOrders,"$1 $3 $4").split(" ").forEach((x,i)=>{
					if(x&&i!==1) newArr.push(x);
					else newArr.push({
						token:x,
						meta:{
							hyphenedOrder:true,
							value:x.substr(1)*1
						}
					});
				});
				else if(numAndSymb.test(token)) token.replace(numAndSymb,"$1 $2 $6").split(" ").forEach((x,i,arr)=>{
					if(i===1) {
						var unit = (arr[0]||arr[2]||tokensArr[index+1]||tokensArr[index-1]||"");
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
				return newArr;
			},[]);
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
		transformer:function(arr){
			return arr
			.map((token)=>{
				var POS = /((\w+)*)('s)((\W+)*)$/;
				var simple = /^((\w+)*)('ll|'m|'re|'ve|'d|'clock)((\W+)*)$/i;
				var negation = /^(do|does|did|ca|could|sha|should|are|were|wo|would|have|had|has|is|was|might|ai)(n't)((\W+)*)$/i;

				if(typeof token !== "string") return token;
				else if(POS.test(token)) {
					if(token === token.toUpperCase()) {
						var sentence = arr.filter((x)=>x.length).join("");
						if(sentence === sentence.toUpperCase()) return token.replace(POS,"$1 $3 $4");
						else return token.replace(/^([A-Z0-9]+'s)(\W+)*$/," $1 $2");
					}
					else return token.replace(POS,"$1 $3 $4");
				}
				else if(simple.test(token)) return token.replace(simple,"$1 $3 $4");
				else if(negation.test(token))  return token.replace(negation,"$1 $2 $3");
				else if(/^s'$/i.test(token)) return {token:token,meta:{POS:true}};
				else if(/^ol'$/i.test(token.toLowerCase())) return {token:token,meta:{contraction:true}};
				else return token;
			})
			.reduce((newArr,item)=>{
				if(typeof item !== "string") newArr.push(item); 
				else if(!~item.indexOf(" ")) newArr.push(item);
				else {
					item.split(" ").forEach((x,i)=>{
						if(i===1) newArr.push({token:x,meta:{contraction:true}});
						else newArr.push(x);
					});
				}
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
	 * English common abbreviations
	 * 
	**/
	{
		level:"token",
		when:"initial",
		transformer:function(arr){
			const abbreviations = require("../abbreviations.js").list;
			const esc = require('escape-string-regexp');
			return arr.reduce((newArr,token,index)=>{
				var regexGreedy = new RegExp(`^((${abbreviations.map((x)=>esc(x)).join("|")})\\.)((\\W+)*)$`,"i");
				var regexNONGreedy = new RegExp(`^((${abbreviations.map((x)=>esc(x)).join("|")}))((\\W+)*)$`,"i");
				if(typeof token !== "string") newArr.push(token); 
				else if(index !== arr.length-1 && regexGreedy.test(token)) token.replace(regexGreedy,"$1 $3").split(" ").forEach((x,i)=>{
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
		transformer:function(arr){
			var singleLetterAcroynms = /^([A-Z])(,*)$/;
			var pureAcronyms = /^(([A-Z]\.)+)((\W+)*)$/;
			var unusualNames = /^((([A-Z0-9])+[&!@#$%+-]+([A-Z0-9]){0,})+)((\W+)*)$/;
			var acronymsAndUnusualNamesGREEDY = /^(([A-Z0-9s].[\w.]*)+)((\W+)*)$/; // includes the "."
			var acronymsAndUnusualNamesNONGREEDY = /^(([A-Z0-9].[\w.]??[A-Z0-9s]?)+)((\W+)*)$/; // doesn't include the last "."
			var capsNames = /^(([A-Z]|\d)+)((\W+)*)$/;
			return arr.reduce((newArr,token,index)=>{
				if (typeof token !== "string") newArr.push(token);
				else if(unusualNames.test(token)) token.replace(unusualNames,"$1 $5").split(" ").forEach((x,i)=>{
					if(x&&i) newArr.push(x);
					else newArr.push({token:x,meta:{properNoun:true}});
				});
				else if(singleLetterAcroynms.test(token)) {
					token.replace(singleLetterAcroynms,"$1 $2").split(" ").forEach((x,i)=>{
						if(x&&i) newArr.push(x);
						else newArr.push({token:x});
					});
				}
				else if(pureAcronyms.test(token)) token.replace(pureAcronyms,"$1 $3").split(" ").forEach((x,i)=>{
					if(x&&i) newArr.push(x);
					else {
						if(x.charAt(x.length-1) === "." && index === arr.length -1) {
							x = x.substr(0,x.length-1);
							newArr.push({
								token:x,
								meta:{acronym:true}
							});
							newArr.push(".");
						}
						else {
							newArr.push({
								token:x,
								meta:{acronym:true}
							});
						}
					}
				});
				else if(index !== arr.length-1 && acronymsAndUnusualNamesGREEDY.test(token)) token.replace(acronymsAndUnusualNamesGREEDY,"$1 $3").split(" ").forEach((x,i)=>{
					if(x&&i) newArr.push(x);
					else {
						if(x.charAt(x.length - 1) !== "." || x === x.toUpperCase()) {
							var obj = {token:x};
							newArr.push(obj);
						}
						else {
							newArr.push(x.substr(0,x.length-1));
							newArr.push(x.charAt(x.length - 1));
						}
					}
				});
				else if(acronymsAndUnusualNamesNONGREEDY.test(token)) token.replace(acronymsAndUnusualNamesNONGREEDY,"$1 $3").split(" ").forEach((x,i)=>{
					if(x&&i) newArr.push(x);
					else {
						var obj = {token:x,meta:{}};
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
				return newArr;
			},[])
			.filter(x=>{
				if(typeof x === "string") return x.length;
				else return x.token.length;
			});
		}
	}
].reverse();