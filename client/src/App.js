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
// CSS
import "rsuite/dist/styles/rsuite-default.css";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
// Pages
import Home from "./Pages/Home/Home";
import Landing from "./Pages/Landing/Landing";
import Logout from "./Pages/Logout/Logout";
import Profile from "./Pages/Profile/Profile";
import Preferences from "./Pages/Preferences/Preferences";
import Recommendations from "./Pages/Recommendations/Recommendations";
import ChangePassword from "./Pages/ChangePassword/ChangePassword";
import UserProfile from "./Pages/UserProfile/UserProfile";
import PastRatings from "./Pages/PastRatings/PastRatings";
import Recommend from "./Pages/Recommend/Recommend";
import Notifications from "./Pages/Notifications/Notifications";
import Friends from "./Pages/Friends/Friends";
import Messages from "./Pages/Messages/Messages";
import Search from "./Pages/Search/Search";
import ReadingList from "./Pages/ReadingList/ReadingList";

function App() {
	useEffect(() => {
		if (localStorage.token) {
			setAuthToken(localStorage.token);
		}
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
						<Route
							exact
							path="/passwordReset"
							component={ChangePassword}
						/>
						<Route exact path="/logout" component={Logout} />
						{/* Protected Routes */}
						<PrivateRoute exact path="/home" component={Home} />
						<PrivateRoute
							exact
							path="/preferences"
							component={Preferences}
						/>
						<PrivateRoute
							exact
							path="/profile"
							component={Profile}
						/>
						<PrivateRoute
							exact
							path="/recommendations"
							component={Recommendations}
						/>
						<PrivateRoute
							exact
							path="/user/:user"
							component={UserProfile}
						/>
						<PrivateRoute
							exact
							path="/ratings"
							component={PastRatings}
						/>
						<PrivateRoute
							exact
							path="/recommend"
							component={Recommend}
						/>
						<PrivateRoute
							exact
							path="/notifications"
							component={Notifications}
						/>
						<PrivateRoute
							exact
							path="/friends"
							component={Friends}
						/>
						<PrivateRoute
							exact
							path="/messages"
							component={Messages}
						/>
						<PrivateRoute
							exact
							path="/list"
							component={ReadingList}
						/>
						<PrivateRoute exact path="/search" component={Search} />
					</Switch>
				</>
			</Router>
		</Provider>
	);
}

export default App;
