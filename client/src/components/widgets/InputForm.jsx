import React from "react";

function InputForm({ name, placeholder, error, className, ...rest }) {
	return (
		<>
			<input
				name={name}
				id={name}
				placeholder={placeholder}
				className={`input-form ${className}`}
				{...rest}
			/>
			{error && (
				<div className="p-4 text-sm text-red-800 rounded-lg bg-red-50">
					{error}
				</div>
			)}
		</>
	);
}

export default InputForm;
