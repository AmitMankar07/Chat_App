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
        // const groupNameElement = document.querySelector('.selected-group');
        // const groupName = groupNameElement ? groupNameElement.textContent : '';
     
  const selectedGroup = localStorage.getItem('selectedGroup');


        console.log("groupname in handlesubmit :",selectedGroup);

        if (message !== '' && selectedGroup) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post('/chats/sendMessage', { message,groupName:selectedGroup }, {
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


    const createGroupButton = document.getElementById('create-group-button');
    const createGroupModal = document.getElementById('create-group-modal');
    const closeButton = document.getElementsByClassName('close')[0];

    createGroupButton.addEventListener('click', () => {
        createGroupModal.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        createGroupModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == createGroupModal) {
            createGroupModal.style.display = 'none';
        }
    });

    const createGroupForm = document.getElementById('create-group-form');
    createGroupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const groupName = document.getElementById('group-name').value;
        console.log("groupname:",groupName);
        const invitedUsers = document.getElementById('invite-users').value.split(',');
        // Send API request to create group and invite users
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/groups/createGroup', { groupName, members: invitedUsers }, {
                headers: {
                    'Authorization': `${token}`
                }
            });
            if (response.status === 201) {
                console.log('Group created successfully:', response.data);
                // Close modal after creating group
                createGroupModal.style.display = 'none';
                // Fetch user's groups again after creating a new group
                fetchUserGroups();
            } else {
                console.error('Failed to create group');
            }
        } catch (error) {
            console.error('Error creating group:', error);
        }
    });

    const groupList = document.getElementById('group-list');

    // Function to fetch user's groups from the server
    async function fetchUserGroups() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }

            const response = await axios.get('/groups/getUserGroups', {
                headers: {
                    'Authorization': `${token}`
                }
            });

            if (response.status === 200) {
                const groups = response.data.groups;
              console.log(groups)
                // Clear existing group list
                groupList.innerHTML = '';

                // Populate the group list
                groups.forEach(group => {
                    console.log(group);
                    if (group && group.name) { // Check if group and group.name are defined
               
                    const listItem = document.createElement('li');
                    listItem.textContent = group.name;
                    listItem.setAttribute('data-group-id', group.id); // Store group ID as a data attribute
                    groupList.appendChild(listItem);
                    } else {
                        console.error('Invalid group object:', group);
                    }
                });
            } else {
                console.error('Failed to fetch user groups');
            }
        } catch (error) {
            console.error('Error fetching user groups:', error.response ? error.response.data : error.message);
        }
    }

    // Call fetchUserGroups function when the DOM is loaded
    fetchUserGroups();

    // Event listener for clicking on a group in the sidebar
    document.getElementById('group-list').addEventListener('click', async(event) => {
        if (event.target.tagName === 'LI') {
            const groupName = event.target.textContent;
    localStorage.setItem('selectedGroup', groupName);
            const groupId = event.target.getAttribute('data-group-id');
            // Implement switching to the selected group
            console.log('Switching to group with ID:', groupId);
            try {
                // Send API request to fetch messages associated with the clicked group
                const token = localStorage.getItem('token');
                const response = await axios.get(`/chats/groups/${groupId}/messages`, {
                    headers: {
                        'Authorization': `${token}`
                    }
                });
    console.log("response of getgrpmsg",response);
                if (response.status === 200) {
                    const messages = response.data.messages;
                    // Update the chat box with the fetched messages
                    displayMessages(response.data.messages);
                } else {
                    console.error('Failed to fetch messages');
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }
    });
    function displayMessages(messages) {
        const chatMessages = document.getElementById('chat-messages');
        // Clear existing messages
        chatMessages.innerHTML = '';
    
        // Populate the chat box with the fetched messages
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            // messageElement.textContent = message.text; // Assuming each message has a 'text' property
            messageElement.textContent = `${message.name}: ${message.message}`;
    
            chatMessages.appendChild(messageElement);
        });
    }
});
