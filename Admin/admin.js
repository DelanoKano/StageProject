document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  alert("You have been logged out.");
  window.location.href = "login.html";
});

// XP/Level system
let xp = parseInt(localStorage.getItem("xp")) || 20;
let level = parseInt(localStorage.getItem("level")) || 1;
let pomodoroCount = parseInt(localStorage.getItem("pomodoroCount")) || 0;
let lastPomodoroDate = localStorage.getItem("lastPomodoroDate");
const today = new Date().toISOString().split("T")[0];

if (lastPomodoroDate !== today) {
  pomodoroCount = 0;
  localStorage.setItem("pomodoroCount", pomodoroCount);
  localStorage.setItem("lastPomodoroDate", today);
}

function updateUI() {
  document.getElementById("xp").textContent = xp;
  document.getElementById("level").textContent = level;
  document.getElementById("xpBar").style.width = xp + "%";
  document.getElementById("pomodoroCount").textContent = pomodoroCount;
}

updateUI();

// Quotes
const quotes = [
  "Stay focused and trust the process.",
  "Every day is a new chance to improve.",
  "Success comes from perseverance, not talent alone.",
  "Rest is also productive.",
];
document.getElementById("quoteBox").textContent =
  quotes[Math.floor(Math.random() * quotes.length)];

//USER settings
let lockinterface = document.getElementById("lock-userinterface");
lockinterface.addEventListener("click", () => {
    window.location.href = "userInterface.html";
});

// Pomodoro Timer
let timer;
let timeLeft = 25 * 60;
let isBreak = false;

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timerDisplay").textContent = `${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      if (!isBreak) {
        pomodoroCount++;
        localStorage.setItem("pomodoroCount", pomodoroCount);
        localStorage.setItem("lastPomodoroDate", today);
        xp += 20;
        if (xp >= 100) {
          xp -= 100;
          level++;
          alert("🎉 You leveled up to " + level + "!");
        }
        localStorage.setItem("xp", xp);
        localStorage.setItem("level", level);
        alert("⏰ Pomodoro complete! Time for a break.");
        timeLeft = 5 * 60;
        isBreak = true;
        startTimer();
      } else {
        alert("🔔 Break is over! Ready for another Pomodoro?");
        timeLeft = 25 * 60;
        isBreak = false;
        updateUI();
        updateTimerDisplay();
      }
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 25 * 60;
  isBreak = false;
  updateTimerDisplay();
}

updateTimerDisplay();

// Daily Challenges system
let challenges = JSON.parse(localStorage.getItem("challenges")) || [];
let completedChallenges =
  JSON.parse(localStorage.getItem("completedChallenges")) || [];
let lastCompletedDate = localStorage.getItem("lastCompletedDate");

if (lastCompletedDate !== today) {
  completedChallenges = [];
  localStorage.setItem("completedChallenges", JSON.stringify([]));
  localStorage.setItem("lastCompletedDate", today);
}

function addChallenge() {
  const input = document.getElementById("newChallengeInput");
  const text = input.value.trim();
  if (!text) return;
  if (challenges.length >= 5) {
    alert("You can add up to 5 challenges only.");
    return;
  }
  challenges.push({ id: Date.now(), text });
  localStorage.setItem("challenges", JSON.stringify(challenges));
  input.value = "";
  renderChallenges();
}

function removeChallenge(id) {
  challenges = challenges.filter((ch) => ch.id !== id);
  completedChallenges = completedChallenges.filter((cid) => cid !== id);
  localStorage.setItem("challenges", JSON.stringify(challenges));
  localStorage.setItem(
    "completedChallenges",
    JSON.stringify(completedChallenges)
  );
  renderChallenges();
}

function completeChallenge(id, xpValue = 25) {
  if (completedChallenges.includes(id)) {
    alert("✅ This challenge has already been completed today.");
    return;
  }
  completedChallenges.push(id);
  localStorage.setItem(
    "completedChallenges",
    JSON.stringify(completedChallenges)
  );
  localStorage.setItem("lastCompletedDate", today);
  xp += xpValue;
  if (xp >= 100) {
    xp -= 100;
    level++;
    alert("🎉 You leveled up to " + level + "!");
  }
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
  updateUI();
  renderChallenges();
}

function renderChallenges() {
  const ul = document.getElementById("challengeList");
  ul.innerHTML = "";
  challenges.forEach((ch) => {
    const li = document.createElement("li");
    li.className = `bg-gray-800 p-4 rounded flex justify-between items-center text-xl ${
      completedChallenges.includes(ch.id) ? "line-through opacity-60" : ""
    }`;
    li.innerHTML = `
      <span>${ch.text}</span>
      <div class="space-x-3">
        <button onclick="completeChallenge(${ch.id})" class="bg-green-600 px-4 py-2 rounded hover:bg-green-700">✓</button>
        <button onclick="removeChallenge(${ch.id})" class="bg-red-600 px-4 py-2 rounded hover:bg-red-700">🗑</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

renderChallenges();
