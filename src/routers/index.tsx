import React from "react";
import {Routes, Route } from "react-router-dom";
import { ThreeStyle } from "../components/3_style";
import { Main } from "../components/home/Main";
import { Cube } from "../components/cube/LineEx";
import { About } from "../components/about";
export default function Router() {
	return (
			<Routes>
				<Route path="/" element= {<Main/>}/>
        <Route path="/style" element={<ThreeStyle/>} />
				<Route path="/cube" element={<Cube/>}/>
				<Route path="/about" element={<About/>}/>
			</Routes>
	);
}
