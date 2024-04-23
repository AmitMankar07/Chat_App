document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    sendButton.addEventListener('click', function() {
        const message = messageInput.value.trim();
        if (message !== '') {
            appendMessage('You', message);
            messageInput.value = '';
            // Simulate receiving a message after a short delay (for demonstration)
            setTimeout(function() {
                receiveMessage('Friend', 'Hello there!');
            }, 1000);
        }
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `
            <strong>${sender}:</strong> ${message}
        `;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }

    function receiveMessage(sender, message) {
        appendMessage(sender, message);
    }
});
