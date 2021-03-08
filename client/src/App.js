import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./Components/Misc/Routing/PrivateRoute";
// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
// Notifications
import { ToastContainer } from "react-toastify";
// Pages
import Home from "./Pages/Home/Home";
import Landing from "./Pages/Landing/Landing";
import Logout from "./Pages/Logout/Logout";
import Profile from "./Pages/Profile/Profile";
// CSS
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
// Check token
if (localStorage.token) {
	setAuthToken(localStorage.token);
}

function App() {
	useEffect(() => {
		console.log("GO");
		store.dispatch(loadUser());
	}, []);
	return (
		<Provider store={store}>
			<Router>
				<>
					<ToastContainer
						position="top-right"
						autoClose={5000}
						hideProgressBar={false}
						newestOnTop={true}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
					/>
					<Switch>
						{/* Unprotected Routes */}
						<Route exact path="/" component={Landing} />
						<PrivateRoute exact path="/home" component={Home} />
						<PrivateRoute
							exact
							path="/profile"
							component={Profile}
						/>
						<Route exact path="/logout" component={Logout} />
					</Switch>
				</>
			</Router>
		</Provider>
	);
}

export default App;
