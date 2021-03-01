import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// Pages
import Home from "./Pages/Home/Home";

function App() {
	return (
		<Router>
			<Switch>
				{/* Unprotected Routes */}
				<Route exact path="/" component={Home} />
			</Switch>
		</Router>
	);
}

export default App;
