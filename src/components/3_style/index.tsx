import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Card, CardBody, Container, Flex, Input, Select, Text } from "@chakra-ui/react";
import { useHotkeys } from 'react-hotkeys-hook'
import { getData } from "../../utils/fetch";
import { ThreeStyleInfo, ThreeStyleInfoItem } from "../../types/data";
import { string2FormulaArr } from "../../utils/str2Formula";

type Eval = "Add" | "Sub" | "Random"

export function ThreeStyle() {
	const author = ["one"];
	const category = {
		shaozi: ["base", "all"],
	};
	const [data, setData] = useState<ThreeStyleInfo>({
		edge: {},
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

	const [currentAuthor, setCurrentAuthor] = useState("shaozi");
	const [currentCategory, setCurrentCategory] = useState("base");

	const [current, setCurrent] = useState<Array<ThreeStyleInfoItem>>([{
		encoder: "AZ",
		commutator: "[U,RUR']",
		detailed: "URUR'U'RUR",
		block: "Z",
		step: "RUR'",
		possible: "[]"
	}]);

	let [currentIdx, setCurrentIdx] = useState<number>(0);
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
		getData("cubeExercises/data/3style.json").then((data) => {
			setData(data);
			const currentData = data?.["corners"][currentCategory];
			setCurrent(currentData);
		});
		//keyboard
		const keyEnter = (e:KeyboardEvent) => {
			if (e.key === "Enter") {
				setCurrentValue("");
				inputRef.current?.focus();
			}
		};
		document.addEventListener("keydown",keyEnter);		
		
		return () => {
			document.removeEventListener("keydown", keyEnter);
		}
	}, []);

	useEffect(() => {
		setCurrentIdxData({ ...current[currentIdx] });
	}, [current]);

	useEffect(() => {
		const currentData = data["corners"][currentCategory as "all" | "base"];
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
	}, [currentCategory]);

	useEffect(() => {
		setCurrentIdxData({ ...current[currentIdx] });
	}, [currentIdx]);

	useHotkeys("ctrl+alt+left", () => setCurrentIdx(idx => changeCurrentIdx("Sub",idx)));
	useHotkeys("ctrl+alt+right", () => setCurrentIdx(idx => changeCurrentIdx("Add",idx)));

	useEffect(() => {
		if (currentValue === currentIdxData.detailed) {
			setIsRight(true);
		} else {
			setIsRight(false);
		}
		setCurrentSplitValue([...string2FormulaArr(currentValue)]);
	}, [currentValue]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCurrentAuthor(e.target.value);
	};
	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCurrentCategory(e.target.value);
		setCurrentValue("");
		setCurrentIdx(0);
		console.log(e.target.value);
	};
	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentValue(e.target.value);
	};

	const changeCurrentIdx = (ty: Eval, currentIdx: number):number => {
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
		setCurrentIdx(idx => changeCurrentIdx("Add",idx));
	};
	const prevHandle = () => {
		setCurrentIdx(idx => changeCurrentIdx("Sub",idx));
	};
	const randomHandle = () => {
		setCurrentIdx(idx => changeCurrentIdx("Random",idx));
	};

	return (
		<Box w="80%" h="80%">
			<Card h="100%">
				<CardBody>
					<Container maxW="100%" centerContent>
						<Flex>
							<Box display="flex" mx={10}>
								<Text w="20">公式库:</Text>
								<Select onChange={(e) => handleChange(e)}>
									{author.map((item, idx) => (<option value={item} key={idx} >{item + "()"}</option>))}
								</Select>
							</Box>
							<Box display="flex" mx={10}>
								<Text w="20">分类:</Text>
								<Select onChange={(e) => handleCategoryChange(e)}>
									{category["shaozi"].map((item, idx) => (<option value={item} key={idx} >{item}</option>))}
								</Select>
							</Box>
						</Flex>
						<Flex>
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
								<Button mx={2} onClick={() => prevHandle()}>Prev</Button>
								<Button mx={2} onClick={() => randomHandle()}>random</Button>
								<Button mx={2} onClick={() => nextHandle()}>Next</Button>
							</Box>
						</Flex>
					</Container>
				</CardBody>
			</Card>
		</Box>
	);
}
