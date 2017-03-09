export interface TokenObject {
	token:string;
	meta:any;
}

export const tokenExtensions = {
	
	initialExtensions:<Array<Function>>[],
	finalExtensions:<Array<Function>>[],

	add:function(e:Function,when:string):void{
		if(when === "initial") tokenExtensions.initialExtensions.push(e);
		else tokenExtensions.finalExtensions.push(e);
	},

	initial:function(input:Array<string>):Array<string|TokenObject>{
		for (var i = tokenExtensions.initialExtensions.length - 1; i >= 0; i--) {
			input = tokenExtensions.initialExtensions[i](input);
		}
		return input;
	},

	final:function(input:Array<string|TokenObject>):Array<string|TokenObject>{
		for (var i = tokenExtensions.finalExtensions.length - 1; i >= 0; i--) {
			input = tokenExtensions.finalExtensions[i](input);
		}
		return input;
	}
};