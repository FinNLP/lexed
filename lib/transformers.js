const transformers = [];

module.exports = {
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