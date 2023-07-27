import React, { useState } from "react";
import Joi from "joi-browser";
import UseForm from "../components/UseForm";
import Button from "../components/widgets/Button";
import { Link } from "react-router-dom";
import authService from "../services/authService";

function Login(props) {
	if (localStorage) {
		authService.logout();
	}
	const [data, setData] = useState({
		email: "",
		password: "",
	});

	const schemaJoi = {
		email: Joi.string().email().min(3).max(255).label("Email"),
		password: Joi.string().label("Password"),
	};

	const doSubmit = async () => {
		try {
			await authService.login(data.email, data.password);
			window.location = "/";
		} catch (ex) {
			if (ex.response && ex.response.status === 400) {
				const errors = { ...error };
				errors.email = ex.response.data;
				errors.password = ex.response.data;
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
				{renderInput("email", "Email")}
				{renderInput("password", "Password", "password")}
				<Button className={"button-form"}>Login</Button>
				<span className="text-white">
					Don't have an account yet?{" "}
					<Link to={"/register"} className="font-semibold text-pink-400">
						Sign up now
					</Link>
				</span>
			</form>
		</div>
	);
}

export default Login;
