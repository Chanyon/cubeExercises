import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Input, Textarea, Text } from "@chakra-ui/react";
import { Main } from "./rubik/src/main.js";
import "./LineEx.css";
import { string2FormulaArr } from "../../utils/str2Formula.js";
import { log } from "console";

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

  useEffect(() => {
    const stepArr = string2FormulaArr(stepValue.toUpperCase());
    const keyDelete = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        if (prevSteps.length > 0) {
          const peek = prevSteps.pop();
          const val = steps[peek as keyof typeof steps];
          if (cube && val) {
            cube.keyboardMove([val]);
          }
        }
      }
    };
    if (stepArr.length >= prevSteps.length + 2) {
      setPrevSteps([...stepArr]);
    } else {
      // delete a step
      // if (prevSteps.length > 0) {
      //   const peek = prevSteps.pop();
      //   const val = steps[peek as keyof typeof steps];
      //   if (cube && val) {
      //     cube.keyboardMove([val]);
      //   }
      // }
      document.addEventListener("keydown", keyDelete);
    }
    // return () => {
    //   document.removeEventListener("keydown", keyDelete);
    // }
  }, [stepValue]);

  useEffect(() => {
    if (cube && prevSteps.length > 0) {
      const step = prevSteps[prevSteps.length - 1];
      const step2 = prevSteps[prevSteps.length - 2];
      if (myIncludes(step) && myIncludes(step2)) {
        cube.keyboardMove([step2, step]);
      }
    }
    console.log(prevSteps);
    
  }, [prevSteps]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setStepValue(inputValue);
    setCurrentStep(time => time + 1);
  }

  return (
    <Flex w="80%" h="800px" bg="#ffffff">
      <Box w="60%" color="blackAlpha.800" fontWeight="bold" p={3}>
        <Box><Text m="8px">棱块编码：</Text><Input m="8px" /></Box>
        <Box><Text m="8px">角块编码：</Text><Input m="8px" /></Box>
        <Box><Text m="8px">棱块翻色：</Text><Input m="8px" /></Box>
        <Box><Text m="8px">角块翻色：</Text><Input m="8px" /></Box>
        <Box><Text m="8px">还原步骤：</Text><Textarea rows={6} isInvalid onChange={handleInputChange} size="lg" m="8px" placeholder="输入公式"></Textarea></Box>
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