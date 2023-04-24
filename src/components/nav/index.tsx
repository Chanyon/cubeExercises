import "./index.css";
import { routers } from "../../types/router";
import { Link } from "react-router-dom";
import { Box } from "@chakra-ui/react";

export function Nav() {
	return (
		<Box as={"div"} className="menu">
			<ul>
				{routers.map((item) => {
					return (
						<li key={item.key}>
							<Link className="link" to={item.url}>
								{item.text}
							</Link>
						</li>
					);
				})}
			</ul>
		</Box>
	);
}
