import React, { useState } from "react";
import InputForm from "./widgets/InputForm";
import Joi from "joi-browser";

function UseForm({ schemaJoi, doSubmit, data, setData }) {
	const [error, setError] = useState({});

	const validate = () => {
		const option = { abortEarly: false };
		const { error } = Joi.validate(data, schemaJoi, option);

		if (!error) return null;

		const errors = {};
		for (let item of error.details) errors[item.path[0]] = item.message;
		return errors;
	};

	const validateProperty = ({ name, value }) => {
		const obj = { [name]: value };
		const schema = { [name]: schemaJoi[name] };
		const { error } = Joi.validate(obj, schema);
		return error ? error.details[0].message : null;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const validationErrors = validate();
		setError(validationErrors || {});
		if (validationErrors) return;
		doSubmit();
	};

	const handleChange = ({ currentTarget: input }) => {
		const newError = { ...error };
		const errorMessage = validateProperty(input);
		if (errorMessage) newError[input.name] = errorMessage;
		else delete newError[input.name];

		const newData = { ...data };
		newData[input.name] = input.value;
		setData(newData);
		setError(newError);
	};

	const renderInput = (name, placeholder, type = "text") => {
		return (
			<InputForm
				type={type}
				name={name}
				value={data[name]}
				error={error[name]}
				placeholder={placeholder}
				onChange={handleChange}
				className={" text-white"}
			/>
		);
	};

	return {
		renderInput,
		handleSubmit,
		error,
		setError,
	};
}

export default UseForm;
