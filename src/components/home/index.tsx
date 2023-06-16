import React from "react";
import { Box, Text, Link } from "@chakra-ui/react";

function Home() {
	const homeInfo = {
		learn_url1: "http://www.mf8-china.com/forum.php?mod=viewthread&tid=108472&extra=page%3D1", //盲拧入门
		learn_url2: "http://www.mf8-china.com/forum.php?mod=viewthread&tid=104911&extra=page%3D2", //转换机
		learn_url3: "http://bbs.mf8-china.com/forum.php?mod=viewthread&tid=115764", //多盲
		bli_bli: [{ name: "勺子_cube", url: "https://space.bilibili.com/942628" },
		{ name: "依旧是一九四", url: "https://space.bilibili.com/243671525" },
		{ name: "Cuber-天下雨", url: "https://space.bilibili.com/432235186" },
		{ name: "Lietice", url: "https://space.bilibili.com/384234355" }],
		rubik_math: [{ name: "大毛忽洞", url: "https://space.bilibili.com/1052676786" }],
		cube_website: [{name: "cubealgtrainer", url: "https://eelpi.github.io/cubealgtrainer/"}],
	};
	return (
		<>
			{/* other ,盲拧入门资料*/}
			<Box fontSize="18px">
				<Text>盲拧入门</Text>
				<Box my="10px">
					<Text>文字教程：</Text>
					<Text>彳亍法：<Link target="_blank" href={homeInfo.learn_url1}>{homeInfo.learn_url1}</Link></Text>
					<Text>转换机：<Link target="_blank" href={homeInfo.learn_url2}>{homeInfo.learn_url2}</Link></Text>
					<Text>多盲：<Link target="_blank" href={homeInfo.learn_url3}>{homeInfo.learn_url3}</Link></Text>
				</Box>
				<Box my="10px">
					<Text>视频教程：</Text>
					{
						homeInfo.bli_bli.map((item, idx) => (<Text key={idx}>{item.name}：<Link target="_blank" href={item.url}>{item.url}</Link></Text>
						))
					}
				</Box>
				<Box my="10px">
					<Text>魔方和数学：</Text>
					{
						homeInfo.rubik_math.map((item, idx) => (<Text key={idx}>{item.name}：<Link target="_blank" href={item.url}>{item.url}</Link></Text>
						))
					}
				</Box>
				<Box my="10px">
					<Text>魔方网站：</Text>
					{
						homeInfo.cube_website.map((item, idx) => (<Text key={idx}>{item.name}：<Link target="_blank" href={item.url}>{item.url}</Link></Text>
						))
					}
				</Box>
			</Box>
		</>
	);
}

export { Home }
