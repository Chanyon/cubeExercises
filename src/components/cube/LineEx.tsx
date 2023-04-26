import React, { useEffect, useRef } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Main } from "./rubik/src/main.js";
import "./LineEx.css";

function Cube() {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cube = new Main();
    return () => {
      //@ts-ignore
      divRef.current?.removeChild(cube.renderer?.domElement);
      cube.resetRotateParams();
    }
  }, []);

  return (
    <Flex w="80%" h="100%" bg="#ffffff">
      <Box w="60%">1</Box>
      <Box w="40%">
        <div ref={divRef} id="retina"></div>
      </Box>
    </Flex>
  );
}

export{ Cube }