document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    alert('Invalid username or password.');
    return;
  }

  localStorage.setItem('loggedInUser', JSON.stringify(user));
  alert('Login successful!');
  window.location.href = 'dashboard.html';
});
