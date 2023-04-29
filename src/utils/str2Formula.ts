// example: (RU R'U') => ["R","U","R'","U'"]
function string2FormulaArr(str: string): Array<string> {
	const reg = /^[a-zA-Z]+$/;
	const arr: Array<string> = [];
	let temp = "";

	for (let i = 0; i < str.length; i++) {
		if (str[i + 1] === "'" && reg.test(str[i])) {
			temp = `${str[i]}'`;
			arr.push(temp);
			temp = "";
			i += 1;
		} else if ((isDigit(str[i+1]) || isW(str[i+1])) && reg.test(str[i])) {
			temp = `${str[i]}${str[i+1]}`;
			arr.push(temp);
			temp = "";
			i += 1;
		} else {
			temp = str[i];
			arr.push(temp);
			temp = "";
		}
	}

	return arr;
}

function isDigit(str:string) {
	return str > '0' && str < '9';
}

function isW(str: string) {
	return str === "w";
}

export { string2FormulaArr };
