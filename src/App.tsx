import "./App.css";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { Nav } from "./components/nav";
import { getYear } from "./utils/getYear";

import Router from "./routers/index"
function App() {
	return (
		<Box className="App" bg="#282C34" color="white">
			<nav className="nav">
				<Flex p="10px" bg="#50555e" color="white">
						<Heading>CubeExercises</Heading>
						<Nav/>
				</Flex>
			</nav>
			<Box height={"100vh"} display="flex" justifyContent="center" mt={10}>
				<Router />
			</Box>
			<footer className="footer">
				Copyright ©2023-{getYear()} All Rights Reserved.
			</footer>
		</Box>
	);
}

export default App;
