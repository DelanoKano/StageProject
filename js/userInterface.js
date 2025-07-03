
    document.addEventListener('DOMContentLoaded', () => {
      const tableBody = document.getElementById('userTableBody');
      let users = JSON.parse(localStorage.getItem('users')) || [];

      function renderUsers() {
        tableBody.innerHTML = '';

        if (users.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="3" class="text-center py-4 text-gray-400">No users registered yet.</td>
            </tr>`;
          return;
        }

        users.forEach((user, index) => {
          const row = document.createElement('tr');
          row.classList.add('hover:bg-gray-700');
          row.innerHTML = `
            <td class="px-4 py-2 border-b border-gray-700">${index + 1}</td>
            <td class="px-4 py-2 border-b border-gray-700">${user.username}</td>
            <td class="px-4 py-2 border-b border-gray-700">
              <button 
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                onclick="deleteUser(${index})"
              >
                🗑️ Delete
              </button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      }

      window.deleteUser = (index) => {
        if (confirm("Are you sure you want to delete this user?")) {
          users.splice(index, 1);
          localStorage.setItem('users', JSON.stringify(users));
          renderUsers();
        }
      };

      renderUsers();
    });
  