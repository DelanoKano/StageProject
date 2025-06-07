// XP/Level system
let xp = parseInt(localStorage.getItem("xp")) || 20;
let level = parseInt(localStorage.getItem("level")) || 1;

function askUsername() {
  let username = localStorage.getItem("username");
  if (!username) {
    username = prompt("Please enter your name:");
    if (username) {
      localStorage.setItem("username", username);
    } else {
      username = "Guest";
    }
  }
  return username;
}

const username = askUsername();
document.getElementById("welcomeUser").textContent = username;

function updateUI() {
  document.getElementById("xp").textContent = xp;
  document.getElementById("level").textContent = level;
  document.getElementById("xpBar").style.width = xp + "%";
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

// Pomodoro Timer
let timer;
let timeLeft = 25 * 60;

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
      alert("⏰ Time's up! Great job!");
      completeChallenge(Date.now(), 40);
      timeLeft = 25 * 60;
      updateTimerDisplay();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 25 * 60;
  updateTimerDisplay();
}

updateTimerDisplay();

// Daily Challenges system
let challenges = JSON.parse(localStorage.getItem("challenges")) || [];
let completedChallenges =
  JSON.parse(localStorage.getItem("completedChallenges")) || [];
let lastCompletedDate = localStorage.getItem("lastCompletedDate");
const today = new Date().toISOString().split("T")[0];

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
  updatePomodoroPrediction();
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
  updatePomodoroPrediction();
}

function completeChallenge(id, xpValue = 40) {
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
  updatePomodoroPrediction();
}

function renderChallenges() {
  const ul = document.getElementById("challengeList");
  ul.innerHTML = "";
  challenges.forEach((ch) => {
    const li = document.createElement("li");
    li.className = `bg-gray-800 p-4 rounded flex justify-between items-center ${
      completedChallenges.includes(ch.id) ? "line-through opacity-60" : ""
    }`;
    li.innerHTML = `
          <span>${ch.text}</span>
          <div class="space-x-4">
            <button onclick="completeChallenge(${ch.id})" class="bg-green-600 px-5 py-2 rounded hover:bg-green-700 text-lg">✓</button>
            <button onclick="removeChallenge(${ch.id})" class="bg-red-600 px-5 py-2 rounded hover:bg-red-700 text-lg">🗑</button>
          </div>
        `;
    ul.appendChild(li);
  });
}

renderChallenges();

// Pomodoro prediction with challenges included
function updatePomodoroPrediction() {
  const xpNeeded = 100 - xp; // XP to level up
  const xpPerPomodoro = 40; // XP per Pomodoro
  const pomodorosForXP = Math.ceil(xpNeeded / xpPerPomodoro);

  const pomodorosPerChallenge = 2; // Pomodoro's per challenge
  const openChallenges = challenges.filter(
    (ch) => !completedChallenges.includes(ch.id)
  ).length;
  const pomodorosForChallenges = openChallenges * pomodorosPerChallenge;

  // Take max to cover both goals
  const pomodorosNeeded = Math.max(pomodorosForXP, pomodorosForChallenges);

  const predictionEl = document.getElementById("pomodoroPrediction");
  predictionEl.textContent = `Estimated Pomodoros needed: ${pomodorosNeeded} (for ${openChallenges} open challenges)`;
}

updatePomodoroPrediction();
