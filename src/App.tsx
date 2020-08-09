import React from "react";
import "./App.scss";

import Form from "./components/Form";

function App() {
	return (
		<div className="App">
			<div className="head-section">
				<p className="text">Product: ABCD</p>
				<p className="text">Date: 08/09/2019 12:03:44</p>
				<p className="text">Amount: 1123.03 USD</p>
			</div>
			<Form />
		</div>
	);
}

export default App;
