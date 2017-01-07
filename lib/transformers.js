const transformers = [];

module.exports = {
	
	outOfTheBox:{
		englishContractions:{
			level:"token",
			when:"initial",
			transformer:function(arr){
				return arr.reduce((newArr,token)=>{
					if(typeof token !== "string") newArr.push(token);
					else if(/('ll|'m|'re|'ve|'s|'d|'clock)$/i.test(token.toLowerCase())) {
						var er1 = /(\w+)('ll|'m|'re|'ve|'s|'d|'clock)$/i.exec(token);
						newArr.push({
							token:er1[1]
						});
						newArr.push({
							token:er1[2]
						});
					}
					else if(/n't$/i.test(token.toLowerCase())) {
						var er2 = /(\w+)(n't)$/i.exec(token);
						if(er2[1] === "ca") er2[1] = "can";
						if(er2[1] === "sha") er2[1] = "shall";
						if(er2[1] === "wo") er2[1] = "will";
						if(er2[1] === "hav") er2[1] = "have";
						newArr.push({
							token:er2[1]
						});
						newArr.push({
							token:"not"
						});
					}
					else if(/^s'$/i.test(token.toLowerCase())){
						newArr.push({
							token:token
						});
					}
					else if(/^ol'$/i.test(token.toLowerCase())) {
						newArr.push({
							token:"ol'"
						});
					}
					else newArr.push(token);
					return newArr;
				},[]);
			}
		},
		
		numbers:{
			level:"token",
			when:"initial",
			transformer:function(arr){
				return arr.map((token)=>{
					if(/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(token)) {
						return {
							token:token,
							meta:{
								value:token.replace(/,/g,"")*1
							}
						};
					}
					else return token;
				});
			}
		},

		complexWords:{
			level:"token",
			when:"initial",
			transformer:function(arr){
				return arr.map((token)=>{
					if(/^\w+\-\w+$/.test(token)) {
						return {
							token:token,
						};
					}
					else return token;
				});
			}
		},

		abbreviationDot:{
			level:"token",
			when:"initial",
			transformer:function(arr){
				const abbreviations = require("./abbreviations.js");
				return arr.map((token)=>{
					if(new RegExp(`(${abbreviations.list.join("|")})\\.`,"i").test(token)) {
						return {
							token:token,
							meta:{
								abbreviation:true
							}
						};
					}
					else return token;
				});
			}
		}
	},

	apply:function(arr,level,when){
		transformers.filter(x=>(x.level === level)&&(x.when === when)).forEach((tobj)=>{
			if(typeof tobj === "object" && tobj.transformer) arr = tobj.transformer(arr);
		});
		return arr;
	},

	extend:function(fun){
		if(typeof fun === "object") transformers.push(fun);
		else console.warn("An transformer solver should be an object!");
	}
};