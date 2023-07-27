import http from "./httpService";
import config from "./config.json";

const apiUrl = `${config.apiEndpoint}/conversations`;

export function getConversation(currentUserId, currentChatId) {
	return http.get(`${apiUrl}/${currentUserId}/${currentChatId}`);
}

export async function saveConversation(conversationId, user, content) {
	try {
		return http.put(`${apiUrl}/${conversationId}`, {
			userId: user._id,
			content,
		});
	} catch (ex) {
		console.error("From Conversation Service", ex);
	}
}

export async function newConversation(currentUserId, currentChatId) {
	try {
		return http.post(`${apiUrl}`, {
			userId1: currentChatId,
			userId2: currentUserId,
		});
	} catch (ex) {
		console.error("From Conversation Service", ex);
	}
	return http.post(apiUrl, { userId1: currentUserId, userId2: currentChatId });
}
