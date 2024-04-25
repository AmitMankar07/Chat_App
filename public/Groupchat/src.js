document.addEventListener('DOMContentLoaded',async () => {
    
    let chatMessages = document.getElementById('chat-messages'); // Initialize chatMessages here
    let latestMessageId = null;

    async function fetchMessages() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found in localStorage');
            return;
        }
        
        let url = '/chats/getMessages';
            if (latestMessageId) {
                url += `?latestMessageId=${latestMessageId}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `${token}`
                }
            });

        if (response.status === 200) {
            const messages = response.data.messages;
            messages.forEach(message => {
                addMessage(`${message.name}: ${message.message}`, message.isCurrentUser);
            });
            if (messages.length > 0) {
                latestMessageId = messages[messages.length - 1].id;
            }
        } else {
            console.error('Failed to fetch messages');
        }
    } catch (error) {
        console.error('Error fetching messages:', error.response ? error.response.data : error.message);
    }
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
    
    await fetchMessages();
    
    setInterval(fetchMessages, 10000);

    const signOutButton = document.getElementById('sign-out-button');

    // Function to handle sign out
    function handleSignOut() {
        // Clear token from localStorage
        localStorage.removeItem('token');
        // Redirect to login page
        window.location.href = '/Login/index.html'; // Adjust the path as per your file structure
    }
    signOutButton.addEventListener('click', handleSignOut);

});
