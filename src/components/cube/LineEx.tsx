import React, { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Box, Flex, Input, Textarea, Text } from "@chakra-ui/react";
import { Main } from "./rubik/src/main.js";
import "./LineEx.css";

function Cube() {
  const deleteSteps = {
    "R": "R'",
    "T": "R",
    "L": "L'",
    "F": "F'",
    "B": "B'",
    "U": "U'",
    "D": "D'",
    "K": "L",
    "G": "F",
    "V": "B",
    "I": "U",
    "C": "D",
    "M": "M'",
    "S": "S'",
    "E": "E'",
    "W": "E",
    "A": "S'",
    "N": "M",
  };
  const alias = {
    "R": "R",
    "L": "L",
    "F": "F",
    "B": "B",
    "U": "U",
    "D": "D",
    "K": "L'",
    "G": "F'",
    "V": "B'",
    "I": "U'",
    "C": "D'",
    "M": "M",
    "S": "S",
    "E": "E",
    "W": "E'",
    "A": "S'",
    "N": "M'",
    "T": "R'",
  };

  const keys = [{ f: "u => U", r: "i => U'" },
  { f: "r => R", r: "t => R'" }, { f: "l => L", r: "k => L'" }, { f: "f => F", r: "g => F'" },
  { f: "b => B", r: "v => B'" }, { f: "d => D", r: "c => D'" }, { f: "m => M", r: "n => M'" },
  { f: "e => E", r: "w => E'" }, { f: "s => S", r: "a => S'" }
  ];
  const [stepValue, setStepValue] = useState("");
  const [prevSteps, setPrevSteps] = useState<Array<string>>([]);
  const [cube, setCube] = useState<any>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cube = new Main();
    setCube(cube);

    return () => {
      //@ts-ignore
      divRef.current?.removeChild(cube.renderer?.domElement);
      cube.resetRotateParams();
    }
  }, []);

  //键盘快捷键
  {
    useHotkeys("u,i,r,t,f,g,l,k,e,w,s,a,d,c,b,v,m,n", (event, handler) => {
      if (event.type === "keyup") { 
        setTimeout(() => {
          switch (handler.keys?.pop()) {
            case "u":
              if (cube) {
                cube.keyboardMove(["U"]);
              }
              break;
            case "i":
              if (cube) {
                cube.keyboardMove(["U'"]);
              }
              break;
            case "r":
              if (cube) {
                cube.keyboardMove(["R"]);
              }
              break;
            case "t":
              if (cube) {
                cube.keyboardMove(["R'"]);
              }
              break;
            case "l":
              if (cube) {
                cube.keyboardMove(["L"]);
              }
              break;
            case "k":
              if (cube) {
                cube.keyboardMove(["L'"]);
              }
              break;
            case "f":
              if (cube) {
                cube.keyboardMove(["F"]);
              }
              break;
            case "g":
              if (cube) {
                cube.keyboardMove(["F'"]);
              }
              break;
            case "d":
              if (cube) {
                cube.keyboardMove(["D"]);
              }
              break;
            case "c":
              if (cube) {
                cube.keyboardMove(["D'"]);
              }
              break;
            case "b":
              if (cube) {
                cube.keyboardMove(["B"]);
              }
              break;
            case "v":
              if (cube) {
                cube.keyboardMove(["B'"]);
              }
              break;
            case "m":
              if (cube) {
                cube.keyboardMove(["M"]);
              }
              break;
            case "n":
              if (cube) {
                cube.keyboardMove(["M'"]);
              }
              break;
            case "e":
              if (cube) {
                cube.keyboardMove(["E"]);
              }
              break;
            case "w":
              if (cube) {
                cube.keyboardMove(["E'"]);
              }
              break;
            case "s":
              if (cube) {
                cube.keyboardMove(["S"]);
              }
              break;
            case "a":
              if (cube) {
                cube.keyboardMove(["S'"]);
              }
              break;
            default:
              break;
          }
        }, 100);
      }
    },{keyup: true});
    //todo x,y,z,x',y',z'
  }

  useEffect(() => {
    const stepArr = stepValue.toUpperCase().split("");
    
    if (stepArr.length >= prevSteps.length) {
      setPrevSteps([...stepArr]);
    } else {
      // delete a step
      if (prevSteps.length > 0) {
        const peek = prevSteps.pop();
        const val = deleteSteps[peek as keyof typeof deleteSteps];
        if (cube && val) {
          cube.keyboardMove([val]);
        }
      }
    }

  }, [stepValue]);

  useEffect(() => {
    if (cube && prevSteps.length > 0) {
      const step = prevSteps[prevSteps.length - 1];
      if (myIncludes(step)) {
        cube.keyboardMove([alias[step as keyof typeof alias]]);
      }
    }
  }, [prevSteps]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setStepValue(inputValue);
  }

  return (
    <Flex w="80%" h="860px" bg="#ffffff">
      <Box w="60%" color="blackAlpha.800" fontWeight="bold" p={3}>
        <Box><Text m="8px">棱块编码：</Text><Input m="8px" /></Box>
        <Box><Text m="8px">角块编码：</Text><Input m="8px" /></Box>
        <Box><Text m="8px">棱块翻色：</Text><Input m="8px" /></Box>
        <Box><Text m="8px">角块翻色：</Text><Input m="8px" /></Box>
        <Box><Text m="8px">还原步骤：</Text><Textarea rows={6} onChange={handleInputChange}  isInvalid size="lg" m="8px" placeholder=""></Textarea></Box>
        <Box>
          <Text>快捷键：</Text>
          {
            keys.map((item,idx)=> (<Text key={idx}>{item.f} / {item.r}</Text>))
          }
        </Box>
      </Box>
      <Box w="40%" display="flex" justifyContent="center" alignItems="center">
        <div ref={divRef} id="retina"></div>
      </Box>
    </Flex>
  );
}

function myIncludes(step: string) {
  const allStep = ["R", "U", "D", "L", "F", "B", "T", "I", "C", "K", "G", "V", "E", "S", "M", "W", "A", "N"];
  return allStep.includes(step);
}

export { Cube }