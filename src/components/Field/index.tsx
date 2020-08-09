import React from "react";

type FieldTypes = "text" | "email";
type FieldVariants = "default" | "select" | "card-number" | "expiry";
export type SelectOption = { id: "string"; value: "string" };
export type ReactEv =
	| React.ChangeEvent<HTMLInputElement>
	| React.ChangeEvent<HTMLSelectElement>;

interface FieldInterface {
	name: string;
	type?: FieldTypes;
	value: any;
	label?: string;
	variant?: FieldVariants;
	options?: SelectOption[];
	required?: boolean;
	onChange?: (event: ReactEv) => void;
}

export const Field: React.FC<FieldInterface> = (props) => {
	const {
		label,
		type,
		value,
		name,
		variant,
		options,
		onChange,
		required,
	} = props;

	const renderField = () => {
		switch (variant) {
			case "select":
				return (
					<select
						name={name}
						onChange={onChange}
						value={value}
						className="form__select"
					>
						{options?.map((option) => (
							<option key={option.id} value={option.value}>
								{option.value}
							</option>
						))}
					</select>
				);
			case "card-number":
				return (
					<input
						name={name}
						type={type || "text"}
						value={value}
						onChange={onChange}
						required={required}
					/>
				);

			case "expiry":
				return (
					<input
						name={name}
						type={type || "text"}
						value={value}
						className="form__input-expiry"
						onChange={onChange}
						maxLength={5}
						required={required}
					/>
				);

			default:
				return (
					<input
						name={name}
						type={type || "text"}
						value={value}
						onChange={onChange}
						maxLength={50}
						required={required}
					/>
				);
		}
	};

	return (
		<label className="form__label">
			<p>{label}:</p> {renderField()}
		</label>
	);
};

export default Field;
