import http from "./httpService";
import config from "./config.json";

const apiUrl = `${config.apiEndpoint}/contacts`;

function withIdUrl(id) {
	return `${apiUrl}/${id}`;
}

export function getContacts(userId) {
	return http.get(withIdUrl(userId));
}
