import React from "react";
import {Routes, Route } from "react-router-dom";
import { ThreeStyle } from "../components/3_cycle";
import { Home } from "../components/home/index";
import { Cube } from "../components/cube/LineEx";
import { About } from "../components/about";
export default function Router() {
	return (
			<Routes>
				<Route path="/" element= {<Home/>}/>
        <Route path="/style" element={<ThreeStyle/>} />
				<Route path="/cube" element={<Cube/>}/>
				<Route path="/about" element={<About/>}/>
			</Routes>
	);
}
