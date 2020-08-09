import React, { useState, useEffect } from "react";

import Field from "../Field";
import { SelectOption, ReactEv } from "../Field";

const INPUT_NAMES = {
	CARD_TYPES: "cardTypes",
	CARD_NUMBER: "cardNumber",
	EXPIRY: "expiry",
	USR_NAME: "userName",
	USR_EMAIL: "userEmail",
};

const CARDS_API = "http://www.mocky.io/v2/5d145fa22f0000ff3ec4f030";
const SUCCESS_API = "http://www.mocky.io/v2/5d8de422310000b19d2b517a";
const ACCEPTED_CARDS = ["Visa", "MasterCard", "Amex"];

export const Form = () => {
	const [cardType, setCardType] = useState<string>("");
	const [cardNumber, setCardNumber] = useState<string>("");
	const [expiry, setExpiry] = useState<string>("");
	const [userName, setUserName] = useState<string>("");
	const [userEmail, setUserEmail] = useState<string>("");
	const [cardsOptions, setCardsOptions] = useState<SelectOption[]>();
	const [responseMsg, setResponseMsg] = useState<{
		invoiceNo: string;
		responseMessage: string;
	}>();

	const handleChange = (e: ReactEv) => {
		const inputName = e.target.name;
		const inputValue = e.target.value;

		switch (inputName) {
			case INPUT_NAMES.CARD_TYPES:
				setCardType(inputValue);
				break;
			case INPUT_NAMES.CARD_NUMBER:
				const maskedValue = cardNumberFormat(inputValue);
				setCardNumber(maskedValue);
				break;
			case INPUT_NAMES.EXPIRY:
				const expiryValue = expiryFormat(inputValue);
				setExpiry(expiryValue);
				break;
			case INPUT_NAMES.USR_NAME:
				const nameFormatted = nameFormat(inputValue);
				setUserName(nameFormatted);
				break;
			case INPUT_NAMES.USR_EMAIL:
				setUserEmail(inputValue);
				break;
		}
	};

	const cardNumberFormat = (value: string) => {
		const amexRegex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,3})\d{0,15}$/g;
		let regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})\d{0,16}$/g;
		if (cardType === "Amex") {
			regex = amexRegex;
		}
		const onlyNumbers = value.replace(/[^\d]/g, "");

		return onlyNumbers.replace(
			regex,
			(regex: any, $1: any, $2: any, $3: any, $4: any) =>
				[$1, $2, $3, $4].filter((group) => !!group).join(" ")
		);
	};

	const expiryFormat = (value: string) => {
		if (value.length >= 2) {
			value = value.substr(0, 2) + "/" + (value.substr(3) || "");
		}
		return value;
	};

	const nameFormat = (value: string) => {
		const onlyLetters = value.replace(/[^a-zA-Z]+/g, "");
		return onlyLetters;
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = new FormData(e.target as HTMLFormElement);

		fetch(SUCCESS_API, {
			method: "POST",
			body: data,
		})
			.then((response) => response.json())
			.then((data) => {
				setResponseMsg({
					invoiceNo: data.invoiceNo,
					responseMessage: data.responseMessage,
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		fetch(CARDS_API)
			.then((response) => response.json())
			.then((data) => {
				const filteredCards = data.cardTypes.filter((card: any) =>
					ACCEPTED_CARDS.includes(card.value)
				);
				setCardsOptions(filteredCards);
				setCardType(filteredCards[0].value);
			});
	}, []);

	const isSubmitEnabled =
		cardType.length > 0 &&
		cardNumber.length > 0 &&
		expiry.length > 0 &&
		userName.length > 0;
	return (
		<div className="content">
			{responseMsg ? (
				<div className="text-blue">
					<p>{responseMsg.invoiceNo}</p>
					<p>{responseMsg.responseMessage}</p>
				</div>
			) : (
				<form className="form" onSubmit={handleSubmit}>
					<Field
						name={INPUT_NAMES.CARD_TYPES}
						label="Card Types"
						variant="select"
						value={cardType}
						options={cardsOptions}
						onChange={handleChange}
					/>
					<Field
						name={INPUT_NAMES.CARD_NUMBER}
						label="Card Number"
						value={cardNumber}
						variant="card-number"
						onChange={handleChange}
					/>
					<Field
						name={INPUT_NAMES.EXPIRY}
						label="Expiry"
						value={expiry}
						variant="expiry"
						onChange={handleChange}
					/>
					<Field
						name={INPUT_NAMES.USR_NAME}
						label="Name"
						value={userName}
						onChange={handleChange}
					/>
					<Field
						name={INPUT_NAMES.USR_EMAIL}
						label="Email"
						type="email"
						value={userEmail}
						onChange={handleChange}
						required={false}
					/>

					<button type="submit" disabled={!isSubmitEnabled}>
						Confirm payment
					</button>
				</form>
			)}
		</div>
	);
};

export default Form;
