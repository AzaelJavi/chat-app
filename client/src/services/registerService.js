import http from "./httpService";
import config from "./config.json";

const apiUrl = `${config.apiEndpoint}/users`;

export function register(user) {
	return http.post(apiUrl, {
		username: user.username,
		email: user.email,
		password: user.password,
	});
}
