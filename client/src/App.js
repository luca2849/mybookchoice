import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
// Pages
import Home from "./Pages/Home/Home";

function App() {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);
	return (
		<Provider store={store}>
			<Router>
				<Switch>
					{/* Unprotected Routes */}
					<Route exact path="/" component={Home} />
				</Switch>
			</Router>
		</Provider>
	);
}

export default App;
