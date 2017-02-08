export const abbreviations =  {
	list:<Array<string>>[],
	extend:function(arr:Array<string>){
		if(Array.isArray(arr)) arr.forEach((x)=>abbreviations.list.push(x.toLowerCase()));
		else console.warn("Abbreviations should be passed as an array!");
	}
};