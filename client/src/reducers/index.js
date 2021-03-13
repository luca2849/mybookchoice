import { combineReducers } from "redux";
import auth from "./auth";
import user from "./user";
import book from "./book";
export default combineReducers({ auth, user, book });
