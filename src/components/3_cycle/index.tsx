import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Card, CardBody, Checkbox, Container, Flex, Input, Select, Text } from "@chakra-ui/react";
import { useHotkeys } from 'react-hotkeys-hook'
import { getData } from "../../utils/fetch";
import { ThreeStyleInfo, ThreeStyleInfoItem } from "../../types/data";
import { string2FormulaArr } from "../../utils/str2Formula";
import { Model } from "./model";

type Eval = "Add" | "Sub" | "Random";
type Category = "base" | "all";
type Author = "shaozi"; // | "other"
type Structures = "edge" | "corners";

export function ThreeStyle() {
	const author = [{ name: "勺子", key: "shaozi" }/*,{name: "", key: ""}*/];
	const libraryCategory = {
		shaozi: {
			structures: {
				edge: ["base", "all"],
				corners: ["base", "all"],
			},
			category: ["corners", "edge"],
		},
	};

	//object.entries
	const edgeCategory = ["AZ", "AZ", "AZ", "AZ", "AZ", "AZ", "AZ", "AZ", "AZ", "AZ", "AZ", "AZ", "AZ", "AZ"];
	const cornerCategory = ["R.F.R","R.D.R"];
	const [customCategory, setCustomCategory] = useState<Array<string>>([]);

	const [data, setData] = useState<ThreeStyleInfo>({
		edge: {
			base: [
				{
					encoder: "GM",
					commutator: "[U,RUR']",
					detailed: "URUR'U'RUR",
					block: "Z",
					step: "RUR'",
					possible: "[]"
				},
			],
			all: {
				"AZ": [
					{
						encoder: "ZG",
						commutator: "[R'DR,U]",
						detailed: "URUR'U'RUR",
						block: "Z",
						step: "RUR'",
						possible: "[]"
					}
				]
			}
		},
		corners: {
			base: [
				{
					encoder: "GM",
					commutator: "[U,RUR']",
					detailed: "URUR'U'RUR",
					block: "Z",
					step: "RUR'",
					possible: "[]"
				},
			],
			all: {
				"R.F.R": [
					{
						encoder: "ZG",
						commutator: "[R'DR,U]",
						detailed: "URUR'U'RUR",
						block: "Z",
						step: "RUR'",
						possible: "[]"
					}
				]
			}
		}
	});

	const [currentAuthor, setCurrentAuthor] = useState<Author>("shaozi");
	const [currentEdgeOrCorner, setCurrentEdgeOrCorner] = useState("corners");
	const [currentCategory, setCurrentCategory] = useState("base");
	const [currentSpecific, setCurrentSpecific] = useState<Array<string>>([]); //棱块角块详细分类

	const [current, setCurrent] = useState<Array<ThreeStyleInfoItem>>([{
		encoder: "AZ",
		commutator: "[U,RUR']",
		detailed: "URUR'U'RUR",
		block: "Z",
		step: "RUR'",
		possible: "[]"
	}]);

	const [currentIdx, setCurrentIdx] = useState<number>(0);
	const [currentIdxData, setCurrentIdxData] = useState<ThreeStyleInfoItem>({
		encoder: "AZ",
		commutator: "[U,RUR']",
		detailed: "URUR'U'RUR",
		block: "Z",
		step: "RUR'",
		possible: "[]"
	});

	const inputRef = useRef<HTMLInputElement>(null);
	const [isRight, setIsRight] = useState(false);
	const [currentValue, setCurrentValue] = useState(""); //input value
	const [currentSplitValue, setCurrentSplitValue] = useState<Array<string>>([]); //input value


	useEffect(() => {
		getData("cubeExercises/data/3cycle.json").then((data) => {
			setData(data);
			const currentData = data?.["corners"][currentCategory];
			setCurrent(currentData);
		});
		//
		const custom = window.localStorage.getItem("custom_group");
		if (custom) {
			const customData:Array<string> = JSON.parse(custom);
			setCustomCategory(customData);
		}

		//keyboard
		const keyEnter = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				setCurrentValue("");
				inputRef.current?.focus();
			}
		};
		document.addEventListener("keydown", keyEnter);

		return () => {
			document.removeEventListener("keydown", keyEnter);
		}
	}, []);

	useEffect(() => {
		setCurrentIdxData({ ...current[currentIdx] });
	}, [current]);

	useEffect(() => {
		const currentData = data[currentEdgeOrCorner as Structures][currentCategory as Category];
		if (Array.isArray(currentData)) {
			setCurrent(currentData);
		} else {
			const List = [];
			for (const key in currentData) {
				if (Object.prototype.hasOwnProperty.call(currentData, key)) {
					const element = currentData[key];
					List.push(...element);
				}
			}
			setCurrent(List);
		}
	}, [currentEdgeOrCorner, currentCategory]);

	useEffect(() => {
		setCurrentIdxData({ ...current[currentIdx] });
	}, [currentIdx]);

	useHotkeys("ctrl+alt+left", () => setCurrentIdx(idx => changeCurrentIdx("Sub", idx)));
	useHotkeys("ctrl+alt+right", () => setCurrentIdx(idx => changeCurrentIdx("Add", idx)));

	useEffect(() => {
		if (currentValue === currentIdxData.detailed) {
			setIsRight(true);
		} else {
			setIsRight(false);
		}
		setCurrentSplitValue([...string2FormulaArr(currentValue)]);
	}, [currentValue]);

	useEffect(() => {
		const List: Array<ThreeStyleInfoItem> = [];
		if (currentSpecific.length === 0) {
			//! TODO overwrite
			const currentData = data[currentEdgeOrCorner as Structures][currentCategory as Category];
			if (Array.isArray(currentData)) {
				setCurrent(currentData);
			} else {
				for (const key in currentData) {
					if (Object.prototype.hasOwnProperty.call(currentData, key)) {
						const element = currentData[key];
						List.push(...element);
					}
				}
				setCurrent(List);
			}
		} else {
			currentSpecific.forEach((item) => {
					const currentData = data[currentEdgeOrCorner as Structures]["all"][item];
					if (currentData) {
						List.push(...currentData);
					} else {
						// custom group
						const local = window.localStorage.getItem(item);
						if (local) {
							const data:Array<ThreeStyleInfoItem> = JSON.parse(local);
							List.push(...data);
						}
					}
			});
			
			setCurrent(List);
		}
	}, [currentSpecific]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCurrentAuthor(e.target.value as Author);
	};

	const handleChangeEdgeOrCorner = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCurrentEdgeOrCorner(e.target.value);
	};

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCurrentCategory(e.target.value);
		setCurrentValue("");
		setCurrentIdx(0);
	};

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentValue(e.target.value);
	};

	const changeCurrentIdx = (ty: Eval, currentIdx: number): number => {
		setCurrentValue("");
		let idx = currentIdx;
		switch (ty) {
			case "Add":
				if (idx >= current.length - 1) {
					return current.length - 1;
				}
				idx += 1;
				break;
			case "Sub":
				if (idx <= 0) {
					return 0;
				}
				idx -= 1;
				break;
			case "Random":
				const len = current.length;
				idx = Math.floor(Math.random() * len);
				break;
		}
		// inputRef.current?.focus();
		return idx;
	};

	const nextHandle = () => {
		setCurrentIdx(idx => changeCurrentIdx("Add", idx));
	};
	const prevHandle = () => {
		setCurrentIdx(idx => changeCurrentIdx("Sub", idx));
	};
	const randomHandle = () => {
		setCurrentIdx(idx => changeCurrentIdx("Random", idx));
	};

	const  handleChangeCheckbox = (specific: string, checked: boolean) => {
		if (checked) {
				setCurrentSpecific([...currentSpecific, specific]);
		} else {
				const idx = currentSpecific.indexOf(specific);
				currentSpecific.splice(idx,1);
				setCurrentSpecific([...currentSpecific]);
		}
	};

	const handleSaveCb = (isSave: boolean) => {
		if (isSave) {
			const custom = window.localStorage.getItem("custom_group");
			if (custom) {
				const customData: Array<string> = JSON.parse(custom);
				setCustomCategory(customData);
			}
		}
	};

	return (
		<Box w="80%" h="80%">
			<Card h="100%">
				<CardBody>
					<Container maxW="100%" centerContent>
						<Flex wrap="wrap">
							<Box display="flex" m="10px">
								<Text w="20">公式库:</Text>
								<Select onChange={(e) => handleChange(e)}>
									{author.map((item, idx) => (<option value={item.key} key={idx} >{item.key + `(${item.name})`}</option>))}
								</Select>
							</Box>
							<Box display="flex" m="10px">
								<Text w="130px">棱块/角块:</Text>
								<Select onChange={(e) => handleChangeEdgeOrCorner(e)}>
									{libraryCategory[currentAuthor as Author]["category"].map((item, idx) => (<option value={item} key={idx} >{item}</option>))}
								</Select>
							</Box>
							<Box display="flex" m="10px">
								<Text w="20">分类:</Text>
								<Select onChange={(e) => handleCategoryChange(e)}>
									{libraryCategory[currentAuthor as Author]["structures"][currentEdgeOrCorner as Structures].map((item, idx) => (<option value={item} key={idx} >{item}</option>))}
								</Select>
							</Box>
						</Flex>
						{/* select */}
						<Box>
							<Text m="2">所有分类:</Text>
							{(currentEdgeOrCorner === "corners") && (
								<Flex wrap="wrap">
									{cornerCategory.map((item, idx) => (<Checkbox key={idx} onChange={(e) => handleChangeCheckbox(item, e.target.checked)} size='md' colorScheme='red' mx="2">{item}</Checkbox>))}
								</Flex>
							)}
							{(currentEdgeOrCorner === "edge") && (
								<Flex wrap="wrap">
									{edgeCategory.map((item, idx) => (<Checkbox key={idx} size='md' colorScheme='red' mx="2">{item}</Checkbox>))}
								</Flex>
							)}
						</Box>
						{/* 自定义 */}
						<Box>
							<Text m="2">自定义: <Model callback={handleSaveCb}/></Text>
							{(customCategory.length > 0) && (
								<Flex wrap="wrap">
									{customCategory.map((item, idx) => (<Checkbox key={idx} onChange={(e) => handleChangeCheckbox(item, e.target.checked)} size='md' colorScheme='red' mx="2">{item}</Checkbox>))}
								</Flex>
							)}
						</Box>

						<Flex wrap="wrap">
							<Box p={4}><Text fontSize={18} fontWeight="bold">交换子: {currentIdxData.commutator}</Text></Box>
							<Box p={4}><Text fontSize={18} fontWeight="bold">交换块: {currentIdxData.block}</Text></Box>
							<Box p={4}><Text fontSize={18} fontWeight="bold">交换步骤: {currentIdxData.step}</Text></Box>
							<Box p={4}><Text fontSize={18} fontWeight="bold">展开公式: {currentIdxData.detailed}</Text></Box>
							<Box p={4}><Text fontSize={18} fontWeight="bold">备选: {currentIdxData.possible}</Text></Box>
						</Flex>
						<Flex w="100%" justifyContent="center" flexDirection="column">
							<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
								<Text fontSize="40px">
									编码:{" " + currentIdxData.encoder}
								</Text>
							</Box>
							<Box>
								<Flex m={4} align="center" justify="center" flexDirection="row" overflow="hidden">
									{currentSplitValue.map((item, idx) =>
									(<Box w="40px" h="40px" m="5px" border={`2px solid ${isRight ? "#86efac" : " #282c34"}`} key={idx}>
										<Text key={item + idx} w="100%" h="100%" align="center" lineHeight="40px">{item}</Text></Box>))
									}
								</Flex>
								<Input tabIndex={-1} h={"80px"} fontSize={30} placeholder="输入公式" value={currentValue} onChange={(e) => handleInput(e)} ref={inputRef} />
							</Box>
							<Box display="flex" justifyContent="center" m={6}>
								<Button mx={2} bg="twitter.400" onClick={() => prevHandle()}>Prev</Button>
								<Button mx={2} bg="twitter.400" onClick={() => randomHandle()}>random</Button>
								<Button mx={2} bg="twitter.400" onClick={() => nextHandle()}>Next</Button>
							</Box>
						</Flex>
					</Container>
				</CardBody>
			</Card>
		</Box>
	);
}