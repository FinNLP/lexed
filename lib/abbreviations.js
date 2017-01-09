const obj ={
	list:[],
	extend:function(arr){
		if(Array.isArray(arr)) arr.forEach((x)=>obj.list.push(x.toLowerCase()));
		else console.warn("Abbreviations should be passed as an array!");
	}
};

module.exports=obj;