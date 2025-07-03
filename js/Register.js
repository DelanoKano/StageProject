document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Please fill in all fields.');
    return;
  }

  // Store the user in localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];

  if (users.find(u => u.username === username)) {
    alert('Username already exists. Please choose another one.');
    return;
  }

  users.push({ username, password });
  localStorage.setItem('users', JSON.stringify(users));

  alert('Account created successfully! You can now log in.');
  window.location.href = 'index.html';
});
