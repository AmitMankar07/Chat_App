document.addEventListener('DOMContentLoaded', async () => {
    let chatMessages = document.getElementById('chat-messages'); // Initialize chatMessages here
    let latestMessageId = -1; // Set initial value to -1

    // Function to store recent messages in local storage
    function storeMessagesInLocalStorage(messages) {
        const storedMessages = JSON.parse(localStorage.getItem('recentMessages')) || [];
        const updatedMessages = [...storedMessages, ...messages];
        const recentMessages = updatedMessages.slice(-10); // Limit to latest 10 messages
        localStorage.setItem('recentMessages', JSON.stringify(recentMessages));
    }

    // Function to retrieve recent messages from local storage
    function retrieveMessagesFromLocalStorage() {
        const recentMessages = JSON.parse(localStorage.getItem('recentMessages')) || [];
        recentMessages.forEach(message => {
            addMessage(`${message.name}: ${message.message}`, message.isCurrentUser);
        });
    }

    async function fetchMessages() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }
            
            let url = '/chats/getMessages';
            if (latestMessageId !== -1) { // Only add latestMessageId to URL if it's not -1
                url += `?latestMessageId=${latestMessageId}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `${token}`
                }
            });

            if (response.status === 200) {
                const messages = response.data.messages;
                if (messages.length > 0) {
                    const newMessages = messages.filter(message => message.id > latestMessageId); 
                    latestMessageId = messages[messages.length - 1].id;
                    storeMessagesInLocalStorage(messages); // Store new messages in local storage
                    // messages.forEach(message => {
                        newMessages.forEach(message => {
                        addMessage(`${message.name}: ${message.message}`, message.isCurrentUser);
                    });
                }
            } else {
                console.error('Failed to fetch messages');
            }
        } catch (error) {
            console.error('Error fetching messages:', error.response ? error.response.data : error.message);
        }
    }

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
        const messageInput = document.getElementById('message-input'); // Define messageInput here
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
    const sendButton = document.getElementById('send-button'); // Define sendButton here
    sendButton.addEventListener('click', handleSubmit);
    
    // Retrieve recent messages from local storage on page load
    retrieveMessagesFromLocalStorage();
    
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
