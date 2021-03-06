<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import Message from './Message.svelte';

    import type { MessageHandler, EmitHandler, Message as MessageInterface, ChatController, ChatSettings } from '../../interfaces/chat';

    export let chatFactory: (settings: ChatSettings) => ChatController;
    export let roomId: string;
    export let author: string;
    export let messageList: Array<MessageInterface>;

    let newMessageText: string = '';

    let chatController: ChatController = null;
    let messages: Array<MessageInterface> = [...messageList.map(message => ({...message, createdAt: new Date(message.createdAt)}))];
    const handleNewMessage: MessageHandler = (text, author) => {
        messages = [...messages, { text, author, createdAt: new Date() }];
    }

    const handleMessageSend = () => {
        if (!newMessageText) return;

        chatController.sendMessage(newMessageText);

        newMessageText = '';
        scrollToBottom();

        return false;
    }

    const scrollToBottom = () => {
      const scrollElement = document.querySelector('.sidebar__body');
      if(scrollElement){
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }

    onMount(() => {
        chatController = chatFactory({ roomId, author, messageHandler: handleNewMessage });
    });
    afterUpdate(() => {
       scrollToBottom();
    });
</script>

<style>
    .sidebar__container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

    .sidebar__header {
        padding: 24px;
        height: 64px;
    }

    .sidebar__body {
        height: calc(100% - 120px);
        padding: 0 24px;
        overflow: auto;
    }

    .sidebar__body__content{
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      min-height: 100%;
    }

    .sidebar__footer {
        padding: 0 8px;
    }

    .sidebar__footer input {
        width: 100%;
    }
</style>

<div class="sidebar__container">
    <div class="sidebar__header">
        <span class="miro-h2">Breakout Chat</span>
    </div>
    <div class="sidebar__body">
      <div class="sidebar__body__content">
        {#each messages as message}
          <Message message={message} />
        {/each}
      </div>
    </div>
    <div class="sidebar__footer">
        <form on:submit|preventDefault={handleMessageSend}>
            <input
                disabled={chatController === null}
                type="text"
                class="miro-input miro-input--primary"
                bind:value={newMessageText}
                placeholder="Type your message here"
            >
        </form>
    </div>
</div>
