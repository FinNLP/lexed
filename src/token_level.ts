import esc from "./escape_regex";
import wrappers from "./wrappers";

const openingWrappers = wrappers.map(x=>esc(x.a));
const closingWrappers = wrappers.map(x=>esc(x.z));
const midPunctuation = [",",":",";","…","-"].map(x=>esc(x));
const endPunctuation = [".","!","?"].map(x=>esc(x));

const regularExpressions:{reg:RegExp;rep:string}[] = [
	// ` (hi` => ` ( hi`
	{
		reg:new RegExp(`(\\s|^)((${openingWrappers.join("|")})+)(.)`,"gim"),
		rep:"$1 $2 $4"
	},
	// `hi) ` => `hi ) `
	{
		reg:new RegExp(`(.)((${closingWrappers.join("|")})+)((${midPunctuation.concat(endPunctuation).join("|")})|\\s|$)`,"gim"),
		rep:"$1 $2 $4"
	},
	// `))` => `) )`
	{
		reg:new RegExp(`(${closingWrappers.join("|")})(?=(${closingWrappers.join("|")}))`,"gim"),
		rep:" $1 "
	},
	// `alex, ` => `alex , `
	{
		reg:new RegExp(`(^|.)((${midPunctuation.join("|")})+)(\\s|$)`,"gim"),
		rep:"$1 $2 $4"
	},
	// `said.` => `said .`
	{
		reg:new RegExp(`(^|.)((${endPunctuation.join("|")}))$`,"gim"),
		rep:"$1 $2"
	},
	// `said. )`
	{
		reg:new RegExp(`(^|.)((${endPunctuation.join("|")}))(\\s)(${closingWrappers.join("|")})`,"gim"),
		rep:"$1 $2 $4 $5"
	},
	// `I'll ` => `I 'll `
	{
		reg:/(.)('s|'ll|'m|'re|'ve|'d|'clock)(\s|$)/gim,
		rep:"$1 $2 $3"
	},
	// `I'll ` => `I 'll `
	{
		reg:/(do|does|did|ca|could|sha|should|are|were|wo|would|have|had|has|is|was|might|ai|need)(n't)(\s|$)/gim,
		rep:"$1 $2 $3"
	},
	// `I'll ` => `I 'll `
	{
		reg:/(do|does|did|ca|could|sha|should|are|were|wo|would|have|had|has|is|was|might|ai|need)(n't)(\s|$)/gim,
		rep:"$1 $2 $3"
	},
	// `I'll ` => `I 'll `
	{
		reg:/([a-z])(')(\d)/gim,
		rep:"$1 $2$3"
	},
	// `I'll ` => `I 'll `
	{
		reg:/(\d)([$%@#&\*+=^])(\s|$)/gim,
		rep:"$1 $2 $3"
	},
	// `I'll ` => `I 'll `
	{
		reg:/(\s|^)([$%@#&\*+=^])(\d)/gim,
		rep:"$1 $2 $3"
	},
	// Concatenate double (or more) spaces.
	{
		reg:/\s+/gim,
		rep:" "
	},
	// Remove starting and ending spaces.
	{
		reg:/^ | $/gim,
		rep:""
	}
];


export default function tokenize (value:string):string[] {
	// apply rules
	for (var index = 0; index < regularExpressions.length; index++) {
		const rule = regularExpressions[index];
		value = value.replace(rule.reg,rule.rep);
	}
	// split and return
	return value.split(" ");
}