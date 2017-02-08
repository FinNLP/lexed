export const sentenceExtensions = {
	
	initialExtensions:<Array<Function>>[],
	finalExtensions:<Array<Function>>[],

	add:function(e:Function,when:string):void{
		if(when === "initial") sentenceExtensions.initialExtensions.push(e);
		else sentenceExtensions.finalExtensions.push(e);
	},

	initial:function(input:string):string{
		for (var i = 0; i < sentenceExtensions.initialExtensions.length; i++) {
			input = sentenceExtensions.initialExtensions[i](input);
		}
		return input;
	},

	final:function(input:Array<string>):Array<string>{
		for (var i = 0; i < sentenceExtensions.finalExtensions.length; i++) {
			input = sentenceExtensions.finalExtensions[i](input);
		}
		return input;
	}
}