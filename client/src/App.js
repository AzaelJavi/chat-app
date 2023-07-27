import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomeChat from "./pages/HomeChat";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./utils/ProtectedRoute";

function App(props) {
	return (
		<div className="main-container">
			<Routes>
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route element={<ProtectedRoute />}>
					<Route path="/home" element={<HomeChat />} />
					<Route path="/" element={<HomeChat />} />
				</Route>
				<Route path="/not-found" element={<NotFound />} />
				<Route path="*" element={<Navigate to="/not-found" />} />
			</Routes>
		</div>
	);
}

export default App;
