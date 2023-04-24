async function getData(path: string) {
	const res = await fetch(path);
	return res.json();
}

export { getData };
