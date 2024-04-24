document.addEventListener('DOMContentLoaded', () => {
    let chatMessages = document.getElementById('chat-messages'); // Initialize chatMessages here

    const token = localStorage.getItem('token');
    if (token) {
        const { name } = JSON.parse(atob(token.split('.')[1])); // Decoding JWT token
        addMessage(`${name} has joined the chat`, false);
    } else {
        console.error('Token not found in localStorage');
    }
    
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    // Function to add a message to the chat interface
    function addMessage(message, isUser) {
        const messageContainer = document.createElement('div');
        const messageBox = document.createElement('div');

        messageBox.textContent = message;
        messageBox.classList.add('message-box');

        messageContainer.appendChild(messageBox);

        if (isUser) {
            messageContainer.classList.add('user-message');
        } else {
            messageContainer.classList.add('friend-message');
        }

        chatMessages.appendChild(messageContainer);

        // Scroll to the bottom of the chat messages
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to handle form submission (sending messages)
   async function handleSubmit(event) {
        event.preventDefault();
        const message = messageInput.value.trim();

        if (message !== '') {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post('/chats/sendMessage', { message }, {
                    headers: {
                        'Authorization': `${token}`
                    }
                });

                if (response.status === 200) {
                    addMessage('You: ' + message, true);
                    messageInput.value = '';
                } else {
                    console.error('Failed to send message');
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    }

    // Event listener for form submission
    sendButton.addEventListener('click', handleSubmit);
});
