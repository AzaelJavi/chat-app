import React, { useState } from "react";
import Joi from "joi-browser";
import UseForm from "../components/UseForm";
import { Link } from "react-router-dom";
import Button from "../components/widgets/Button";
import { register } from "../services/registerService";
import authService from "../services/authService";
function Register(props) {
	const [data, setData] = useState({
		username: "",
		email: "",
		password: "",
	});

	const schemaJoi = {
		username: Joi.string().required().min(3).max(255).label("Username"),
		email: Joi.string().required().email().min(3).max(255).label("Email"),
		password: Joi.string().required().min(8).label("Password"),
	};

	const doSubmit = async () => {
		try {
			const { headers } = await register(data);
			authService.loginWithJwt(headers["x-auth-token"]);
			window.location = "/";
		} catch (ex) {
			if (ex.response && ex.response.status === 400) {
				const errors = { ...error };
				errors.email = ex.response.data;
				setError(errors);
			}
		}
	};

	const { renderInput, handleSubmit, error, setError } = UseForm({
		schemaJoi,
		doSubmit,
		data,
		setData,
	});
	return (
		<div>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-8 bg-indigo-800 rounded-3xl p-20">
				<div className="flex items-center gap-4 justify-center ">
					<h3 className="text-white uppercase">woki toki</h3>
				</div>
				{renderInput("username", "Username")}
				{renderInput("email", "Email")}
				{renderInput("password", "Password", "password")}
				<Button className={"button-form"}>Register</Button>
				<span className="text-white">
					Already have an account?{" "}
					<Link to={"/login"} className="font-semibold text-pink-400">
						Sign in now
					</Link>
				</span>
			</form>
		</div>
	);
}

export default Register;
