// example: (RU R'U') => ["R","U","R'","U'"]
function string2FormulaArr(str: string): Array<string> {
	const reg = /^[a-zA-Z]+$/;
	const arr: Array<string> = [];
	let temp = "";

	for (let i = 0; i < str.length; i++) {
		if (str[i + 1] === "'" && i >= 1 && reg.test(str[i])) {
			temp = `${temp}${str[i]}'`;
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

export { string2FormulaArr };
