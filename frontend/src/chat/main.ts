import socketioControllerFactory from './controllers/socketIoController';
import messageService from './services/messageService';
import Chat from './components/Chat/Chat.svelte';
import Error from './components/Error.svelte';

import { CLIENT_ID } from '../config';

const initApp = (
	roomId: string,
	author: string,
	messageList: string,
) => {
	const app = new Chat({
		target: document.body,
		props: {
			roomId,
			author,
			chatFactory: socketioControllerFactory,
      messageList,
		}
	});
}

const getCurrentUserName = async () => {
	const id = await miro.currentUser.getId();
	// @ts-ignore
	const onlineUsers = await miro.board.getOnlineUsers();

	return onlineUsers.find(user => user.id === id)?.name;
}

miro.onReady(async () => {
	const savedState = await miro.__getRuntimeState();
	const name = await getCurrentUserName();
	const messageList = await messageService.fetch({roomId: savedState[CLIENT_ID]?.breakoutChatRoomId});
	if (savedState[CLIENT_ID]?.breakoutChatRoomId && name) {
		initApp(
			savedState[CLIENT_ID]?.breakoutChatRoomId,
			name,
      messageList,
		);
	} else {
		const app = new Error({
			target: document.body,
		})
	}
});
