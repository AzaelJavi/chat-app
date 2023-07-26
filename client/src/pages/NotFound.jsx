import React from "react";
import { Link } from "react-router-dom";

function NotFound(props) {
	return (
		<div className="text-center">
			<h1 className="text-8xl uppercase font-bold">
				Error 404: Page Not Found! Get outta here!
			</h1>
			<Link to={"/login"} className="underline text-blue-800 text-3xl">
				Redirect me to login please!
			</Link>
		</div>
	);
}

export default NotFound;
