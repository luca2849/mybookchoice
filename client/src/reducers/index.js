import { combineReducers } from "redux";
import auth from "./auth";
import user from "./user";
import book from "./book";
import messaging from "./messaging";
import data from "./data";
export default combineReducers({ auth, user, book, messaging, data });
