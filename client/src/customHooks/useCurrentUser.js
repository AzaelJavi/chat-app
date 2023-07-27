import { useEffect, useState } from "react";
import auth from "../services/authService";

export default function useCurrentUser() {
	const [user, setUser] = useState("");

	useEffect(() => {
		const user = auth.getCurrentUser();
		setUser(user);
	}, []);

	return user;
}
