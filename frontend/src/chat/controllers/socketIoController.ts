import io from 'socket.io-client';

import { CHAT_HOST, CHAT_OPTIONS } from '../../config';

import type { ChatSettings, ChatController } from '../interfaces/chat';

const initChat = ({ roomId, author, messageHandler }: ChatSettings) => {
    const socket = io(CHAT_HOST, CHAT_OPTIONS);

    socket.emit('join', roomId, author, () => {});

    socket.on('chat message', messageHandler);

    return {
        sendMessage: (text: string) => {
            socket.emit('chat message', text, () => {});
        }
    } as ChatController
}

export default initChat;
