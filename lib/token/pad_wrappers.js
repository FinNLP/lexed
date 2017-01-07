const wrappers = require("../wrappers.js");

function pad(str,w1,w2){
	if(str.charAt(0) === w1) str = w1 + " " + str.replace(new RegExp(`^${w1}`),"");
	if(str.charAt(str.length-1)===w2) str = str.replace(new RegExp(`${w2}$`),"") + " " + w2;
	return str;
}

module.exports = function(array){
	return array.map((item,index,arr)=>{
		var a = item.charAt(0);
		var z = item.charAt(item.length-1);
		var w = wrappers.find((w)=>w[0]===a||w[1]===z);
		if(!w) return item;
		else if(w && !w[2]) return pad(item,w[0],w[1]);
		else if(w[2].test(item)) return pad(item,w[0],w[1]);
		return item.replace(w[3],w[4]);
	})
	.reduce((newArr,item,index)=>{
		if(~item.indexOf(" ")) item.split(" ").forEach((subItem)=>newArr.push(subItem));
		else newArr.push(item);
		return newArr;
	},[])
	.filter(x=>x.length);
};