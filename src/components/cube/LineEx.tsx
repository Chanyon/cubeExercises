import React, { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Box, Flex, Input, Textarea, Text } from "@chakra-ui/react";
import { Main } from "./rubik/src/main.js";
import "./LineEx.css";
import { string2FormulaArr } from "../../utils/str2Formula.js";

function Cube() {
  const steps = {
    "R": "R'",
    "L": "L'",
    "F": "F'",
    "B": "B'",
    "U": "U'",
    "D": "D'",
    "L'": "L",
    "F'": "F",
    "B'": "B",
    "U'": "U",
    "D'": "D",
    "R2": "R2",
    "L2": "L2",
    "F2": "F2",
    "B2": "B2",
    "U2": "U2",
    "D2": "D2",
    "M": "M'",
    "S": "S'",
    "E": "E'",
  };
  const keys = [{ f: "u => U", r: "i => U'" },
  { f: "r => R", r: "t => R'" }, { f: "l => L", r: "k => L'" }, { f: "f => F", r: "g => F'" },
  { f: "b => B", r: "v => B'" }, { f: "d => D", r: "c => D'" }, { f: "m => M", r: "n => M'" },
  { f: "e => E", r: "w => E'" }, { f: "s => S", r: "a => S'" }
  ];
  const [stepValue, setStepValue] = useState("");
  const [prevSteps, setPrevSteps] = useState<Array<string>>([]);
  const [currentStep, setCurrentStep] = useState(0);
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
    });
    //todo x,y,z,x',y',z'
  }

  // useEffect(() => {
  //   const stepArr = string2FormulaArr(stepValue.toUpperCase());
  //   const keyDelete = (e: KeyboardEvent) => {
  //     if (e.key === "Backspace") {
  //       if (prevSteps.length > 0) {
  //         const peek = prevSteps.pop();
  //         const val = steps[peek as keyof typeof steps];
  //         if (cube && val) {
  //           cube.keyboardMove([val]);
  //         }
  //       }
  //     }
  //   };
  //   if (stepArr.length >= prevSteps.length + 2) {
  //     setPrevSteps([...stepArr]);
  //   } else {
  //     // delete a step
  //     // if (prevSteps.length > 0) {
  //     //   const peek = prevSteps.pop();
  //     //   const val = steps[peek as keyof typeof steps];
  //     //   if (cube && val) {
  //     //     cube.keyboardMove([val]);
  //     //   }
  //     // }
  //     document.addEventListener("keydown", keyDelete);
  //   }

  // }, [stepValue]);

  // useEffect(() => {
  //   if (cube && prevSteps.length > 0) {
  //     const step = prevSteps[prevSteps.length - 1];
  //     const step2 = prevSteps[prevSteps.length - 2];
  //     if (myIncludes(step) && myIncludes(step2)) {
  //       cube.keyboardMove([step2, step]);
  //     }
  //   }
  // }, [prevSteps]);

  // const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const inputValue = e.target.value;
  //   setStepValue(inputValue);
  // }

  return (
    <Flex w="80%" h="860px" bg="#ffffff">
      <Box w="60%" color="blackAlpha.800" fontWeight="bold" p={3}>
        <Box><Text m="8px">棱块编码：</Text><Input m="8px" /></Box>
        <Box><Text m="8px">角块编码：</Text><Input m="8px" /></Box>
        <Box><Text m="8px">棱块翻色：</Text><Input m="8px" /></Box>
        <Box><Text m="8px">角块翻色：</Text><Input m="8px" /></Box>
        <Box><Text m="8px">还原步骤：</Text><Textarea rows={6} isInvalid size="lg" m="8px" placeholder=""></Textarea></Box>
        <Box>
          <Text>快捷键：</Text>
          {
            keys.map(item => (<Text>{item.f} / {item.r}</Text>))
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
  const allStep = ["R", "U", "D", "L", "F", "B", "R2", "U2", "D2", "L2", "F2", "B2", "R'", "U'", "D'", "L'", "F'", "B'", "E", "S", "M", "E'", "S'", "M'", "E2", "S2", "M2"];
  return allStep.includes(step);
}

export { Cube }