let currentItemId = null;
  
document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveBtn');
    const itemData = {
        name: itemName.value,
    };
    const modal = document.getElementById('modal');

    function showModal(title, item = {}) {
        document.getElementById('modalTitle').textContent = title;
        itemName.value = item.name || '';
        modal.classList.remove('hidden');
    }

    function hideModal() {
        modal.classList.add('hidden');
        itemData.value = '';
    }

    document.getElementById('addItemBtn').addEventListener('click', () => {
        currentItemId = null; 
        showModal('Add Item');
    });

    saveBtn.addEventListener('click', (e) => {
        e.preventDefault(); 

        if (itemName.value.trim() === '') {
            var modal = document.getElementById("alertModal");
            var span = document.getElementById('closeModal');
            span.addEventListener('click', hideModal);
        
            modal.style.display = "block";
        
            span.onclick = function() {
                modal.style.display = "none";
            }
        
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        
            return;
        }

        const itemData = {
            name: itemName.value,
        };

        const method = currentItemId ? 'PUT' : 'POST';
        const url = currentItemId ? `http://localhost:3000/items/${currentItemId}` : 'http://localhost:3000/items';

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
        fetch('http://localhost:3000/items')
            .then(response => response.json())
            .then(data => {
                const itemList = document.getElementById('itemList');
                itemList.innerHTML = '';
                data.forEach(item => {
                    const li = document.createElement('li');
                    li.classList.add('flex', 'justify-between', 'items-center', 'py-2', 'border-b', 'border-gray-300');

                    const itemNameSpan = document.createElement('span');
                    itemNameSpan.textContent = item.name;
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
                        fetch(`http://localhost:3000/items/${item.id}`, {
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
                    li.appendChild(itemNameSpan);
                    li.appendChild(buttonContainer);
                    itemList.appendChild(li);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    window.onload = loadItems;
});