var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
export default function (str:string):string{
	return str.replace(matchOperatorsRe, '\\$&');
};