import React from "react";
import { Box,Text } from "@chakra-ui/react";

function About() {
  const aboutInfo = {
    desc: "一个开源的三阶魔方盲拧记忆网站，如果你对该项目感兴趣，欢迎PR。",
    url: "https://github.com/Chanyon/cubeExercises",
    ku_source: "勺子_cuber",
  };
  return (
    <Box fontSize={18}>
      <Text as={"p"}>关于网站：{aboutInfo.desc}</Text>
      <Text>公式来源：({aboutInfo.ku_source})</Text>
      <Text as={"p"}>项目地址：{aboutInfo.url}</Text>
    </Box>
  );
}

export { About }
