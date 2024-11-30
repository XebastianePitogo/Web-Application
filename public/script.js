let currentItemId = null;

document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveBtn');
    const itemName = document.getElementById('itemName');
    const itemDescription = document.getElementById('itemDescription');
    const modal = document.getElementById('modal');

    function showModal(title, item = {}) {
        document.getElementById('modalTitle').textContent = title;
        itemName.value = item.name || '';
        itemDescription.value = item.description || '';
        modal.classList.remove('hidden');
    }

    function hideModal() {
        modal.classList.add('hidden');
        itemName.value = '';
        itemDescription.value = '';
    }

    document.getElementById('addItemBtn').addEventListener('click', () => {
        currentItemId = null; 
        showModal('Add Item');
    });

    saveBtn.addEventListener('click', (e) => {
        e.preventDefault(); 

        if (itemName.value.trim() === '') {
            var alertModal = document.getElementById("alertModal");
            var span = document.getElementById('closeModal');
            span.addEventListener('click', hideModal);
        
            alertModal.style.display = "block";
        
            span.onclick = function() {
                alertModal.style.display = "none";
            }
        
            window.onclick = function(event) {
                if (event.target == alertModal) {
                    alertModal.style.display = "none";
                }
            }
        
            return;
        }

        const itemData = {
            name: itemName.value,
            description: itemDescription.value
        };

        const method = currentItemId ? 'PUT' : 'POST';
        const url = currentItemId ? `https://web-application-1eq1.onrender.com/items/${currentItemId}` : 'https://web-application-1eq1.onrender.com/items';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(currentItemId ? 'Item updated:' : 'Item added:', data);
            loadItems();
            hideModal();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while saving the item. Please try again.');
        });
    });

    document.getElementById('closeModal').addEventListener('click', hideModal);

    function loadItems() {
        fetch('https://web-application-1eq1.onrender.com/items')
            .then(response => response.json())
            .then(data => {
                const itemList = document.getElementById('itemList');
                itemList.innerHTML = '';
                data.forEach(item => {
                    const li = document.createElement('li');
                    li.classList.add('flex', 'flex-col', 'py-2', 'border-b', 'border-gray-300');

                    const itemHeader = document.createElement('div');
                    itemHeader.classList.add('flex', 'justify-between', 'items-center');

                    const itemId = document.createElement('p');
                    itemId.textContent = `ID: ${item.id}`;
                    itemId.classList.add('text-gray-600', 'mt-2');

                    const itemNameSpan = document.createElement('span');
                    itemNameSpan.textContent = `Student Name: ${item.name}`;
                    itemNameSpan.classList.add('flex-grow', 'mr-2', 'truncate');

                    const buttonContainer = document.createElement('div');
                    buttonContainer.classList.add('flex', 'space-x-2');

                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'Edit';
                    editBtn.classList.add('bg-yellow-500', 'text-white', 'p-1', 'w-20', 'text-center');
                    editBtn.addEventListener('click', function () {
                        currentItemId = item.id;
                        showModal('Edit Item', item); 
                    });

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.classList.add('bg-red-500', 'text-white', 'p-1', 'w-20', 'text-center');
                    deleteBtn.addEventListener('click', function () {
                        fetch(`https://web-application-1eq1.onrender.com/items/${item.id}`, {
                            method: 'DELETE',
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Item deleted:', data);
                            loadItems(); 
                        })
                        .catch(error => console.error('Error:', error));
                    });

                    buttonContainer.appendChild(editBtn);
                    buttonContainer.appendChild(deleteBtn);
                    itemHeader.appendChild(itemNameSpan);
                    itemHeader.appendChild(buttonContainer);

                    const itemDescription = document.createElement('p');
                    itemDescription.textContent = `Course: ${item.description}`;
                    itemDescription.classList.add('text-gray-600', 'mt-2');

                    const itemDate = document.createElement('p');
                    itemDate.textContent = `Date Enrolled: ${new Date(item.date_created).toLocaleString()}`;
                    itemDate.classList.add('text-gray-600', 'mt-2');

                    li.appendChild(itemHeader);
                    li.appendChild(itemDescription);
                    li.appendChild(itemDate);
                    li.appendChild(itemId);
                    itemList.appendChild(li);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    window.onload = loadItems;
});