document.addEventListener('DOMContentLoaded', () => {
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
                const groupList = document.getElementById('group-list');

                // Clear existing group list
                groupList.innerHTML = '';

                // Populate the group list
                groups.forEach(group => {
                    const listItem = document.createElement('li');
                    listItem.textContent = group.name;
                    listItem.setAttribute('data-group-id', group.id); // Store group ID as a data attribute
                    groupList.appendChild(listItem);
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
    document.getElementById('group-list').addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const groupId = event.target.getAttribute('data-group-id');
            // Implement switching to the selected group
            console.log('Switching to group with ID:', groupId);
        }
    });
});
