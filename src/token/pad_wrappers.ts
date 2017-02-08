import wrappers from "../wrappers";
import esc from '../escape_regex';

function pad(str:string,w1:string,w2:string){
	if(str.charAt(0) === w1) str = w1 + " " + str.replace(new RegExp(`^${esc(w1)}`),"");
	if(str.charAt(str.length-1)===w2) str = str.replace(new RegExp(`${esc(w2)}$`),"") + " " + w2;
	return str;
}

export default function(array:Array<string>){
	return array.map((item,index,arr)=>{
		var a = item.charAt(0);
		var z = item.charAt(item.length-1);
		var w = wrappers.find((w)=>w.a===a||w.z===z);
		if(!w) return item;
		else if(w && (!w.test)) return pad(item,w.a,w.z);
		else if(w.test && w.test.test(item)) return pad(item,w.a,w.z);
		else if(w.replace && w.to) return item.replace(w.replace,w.to);
		return item;
	})
	.reduce((newArr:Array<string>,item,index)=>{
		if(~item.indexOf(" ")) item.split(" ").forEach((subItem)=>newArr.push(subItem));
		else newArr.push(item);
		return newArr;
	},[])
	.filter(x=>x.length);
};