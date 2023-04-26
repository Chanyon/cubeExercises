import React, { useEffect, useRef } from "react";
import { Box, Flex, Input, Textarea, Text } from "@chakra-ui/react";
import { Main } from "./rubik/src/main.js";
import "./LineEx.css";

function Cube() {
  const [value, setValue] = React.useState('')

  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cube = new Main();
    return () => {
      //@ts-ignore
      divRef.current?.removeChild(cube.renderer?.domElement);
      cube.resetRotateParams();
    }
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let inputValue = e.target.value
    setValue(inputValue)
  }
  return (
    <Flex w="80%" h="800px" bg="#ffffff">
      <Box w="60%" color="blackAlpha.800" fontWeight="bold" p={3}>
        <Box><Text m="8px">棱块编码：</Text><Input m="8px"/></Box>
        <Box><Text m="8px">角块编码：</Text><Input m="8px"/></Box>
        <Box><Text m="8px">棱块翻色：</Text><Input m="8px"/></Box>
        <Box><Text m="8px">角块翻色：</Text><Input m="8px"/></Box>
        <Box><Text m="8px">还原步骤：</Text><Textarea rows={6} isInvalid onChange={handleInputChange} size="lg" m="8px" placeholder="输入公式"></Textarea></Box>
      </Box>
      <Box w="40%" display="flex" justifyContent="center" alignItems="center">
        <div ref={divRef} id="retina"></div>
      </Box>
    </Flex>
  );
}

export { Cube }