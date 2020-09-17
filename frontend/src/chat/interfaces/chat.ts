export interface Message { text: string, author: string, createdAt: Date };

export type MessageHandler = (text: string, author: string) => void;

export type EmitHandler = (error: any, response: any) => void;

export interface ChatSettings {
    roomId: string;
    author: string;
    messageHandler: MessageHandler;
}

export interface ChatController {
    sendMessage: (text: string) => void;
}
