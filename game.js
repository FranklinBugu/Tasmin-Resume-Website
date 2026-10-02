const photos = [
  {
    src: "character-1.jpeg",
    alt: "Sunny standing tall",
    label: "01 / STANDING TALL",
    title: "Ready for whatever comes next.",
    description: "A calm day, a big idea, and absolutely no reason to stand normally."
  },
  {
    src: "character-2.jpeg",
    alt: "Sunny doing a low pose",
    label: "02 / LOW PROFILE",
    title: "Keeping things flexible.",
    description: "Sometimes the best way to solve a problem is to look at it from a completely different angle."
  },
  {
    src: "character-3.jpeg",
    alt: "Sunny making a peace sign",
    label: "03 / GOOD VIBES",
    title: "Peace, pizza, and possibilities.",
    description: "A reminder to enjoy the little things—and yes, the tongue-out peace sign was intentional."
  }
];

let current = 0;

const image = document.getElementById("galleryImage");
const label = document.getElementById("photoLabel");
const title = document.getElementById("photoTitle");
const description = document.getElementById("photoDescription");
const count = document.getElementById("photoCount");
const thumbs = document.querySelectorAll(".thumb");

function showPhoto(index) {
  current = (index + photos.length) % photos.length;
  const p = photos[current];

  image.style.opacity = "0";
  image.style.transform = "scale(.98)";

  setTimeout(() => {
    image.src = p.src;
    image.alt = p.alt;
    label.textContent = p.label;
    title.textContent = p.title;
    description.textContent = p.description;
    count.textContent =
      `${String(current + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;

    thumbs.forEach((t, i) => {
      t.classList.toggle("active", i === current);
    });

    image.style.opacity = "1";
    image.style.transform = "scale(1)";
  }, 160);
}

document.getElementById("prevPhoto").addEventListener("click", () => {
  showPhoto(current - 1);
});

document.getElementById("nextPhoto").addEventListener("click", () => {
  showPhoto(current + 1);
});

thumbs.forEach(t => {
  t.addEventListener("click", () => {
    showPhoto(Number(t.dataset.index));
  });
});

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") showPhoto(current - 1);
  if (e.key === "ArrowRight") showPhoto(current + 1);
});


// ===============================
// DARK / LIGHT MODE
// ===============================

const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("sunny-theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const dark = document.body.classList.contains("dark");

  themeToggle.textContent = dark ? "☀" : "☾";

  localStorage.setItem(
    "sunny-theme",
    dark ? "dark" : "light"
  );
});


// ===============================
// CHAT
// ===============================

const chatPanel = document.getElementById("chatPanel");
const chatInput = document.getElementById("chatInput");
const messages = document.getElementById("messages");
const chatForm = document.getElementById("chatForm");


// Open chat
function openChat() {
  chatPanel.classList.add("open");
  chatPanel.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    chatInput.focus();
  }, 200);
}


// Close chat
function closeChat() {
  chatPanel.classList.remove("open");
  chatPanel.setAttribute("aria-hidden", "true");
}


// Chat buttons
document.getElementById("chatOpen").addEventListener("click", openChat);

document.getElementById("chatClose").addEventListener("click", closeChat);

document.getElementById("contactChat").addEventListener("click", openChat);


// ===============================
// TASMIN AI RESPONSES
// ===============================

function getTasminResponse(question) {

  const lower = question.toLowerCase().trim();


  // GREETINGS
  if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey") ||
    lower.includes("yo")
  ) {
    const responses = [
      "Hey! 👋 Welcome to Tasmin's corner of the internet!",
      "Hello! 😎 What would you like to know about Tasmin?",
      "Hey there! Tasmin is ready for your questions. 🧮",
      "Hi! Don't worry, I promise this conversation will be more fun than math homework. 😂"
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }


  // WHO IS TASMIN
  if (
    lower.includes("who is tasmin") ||
    lower.includes("who's tasmin") ||
    lower.includes("about tasmin") ||
    lower === "tasmin"
  ) {
    return "Tasmin is a 28-year-old math professor with a degree in Mechanical Engineering. He teaches math, solves problems, and somehow survives all the questions his students ask. 👨‍🏫🧮";
  }


  // AGE
  if (
    lower.includes("how old") ||
    lower.includes("age") ||
    lower.includes("years old")
  ) {
    return "Tasmin is 28 years old! 🎂 Still young enough to understand technology, but old enough to complain about how complicated math can be. 😂";
  }


  // DEGREE / EDUCATION
  if (
    lower.includes("degree") ||
    lower.includes("education") ||
    lower.includes("graduate") ||
    lower.includes("graduated")
  ) {
    return "Tasmin has a degree in Mechanical Engineering. 🔧⚙️ Apparently, solving engineering problems wasn't enough, so he decided to teach math too. 😎";
  }


  // MECHANICAL ENGINEERING
  if (
    lower.includes("mechanical engineering") ||
    lower.includes("engineer") ||
    lower.includes("engineering")
  ) {
    return "Tasmin has a Mechanical Engineering background! ⚙️ He understands machines, math, and probably way too many equations.";
  }


  // PROFESSOR / TEACHER
  if (
    lower.includes("professor") ||
    lower.includes("teacher") ||
    lower.includes("teach")
  ) {
    return "Yes! Tasmin is a math professor. 👨‍🏫 His job is basically helping students understand math while secretly giving them even more math. 😂";
  }


  // MATH
  if (
    lower.includes("math") ||
    lower.includes("mathematics") ||
    lower.includes("equation") ||
    lower.includes("algebra") ||
    lower.includes("calculus")
  ) {
    return "Math is definitely one of Tasmin's specialties. 🧮 He has a Mechanical Engineering degree, so equations are basically part of his natural habitat.";
  }


  // GOOD PROFESSOR
  if (
    lower.includes("good professor") ||
    lower.includes("good teacher") ||
    lower.includes("best professor") ||
    lower.includes("best teacher")
  ) {
    return "Absolutely! 😎 Tasmin is knowledgeable, dedicated, and always ready to help students understand the problem. 👨‍🏫✨";
  }


  // PERSONALITY
  if (
    lower.includes("personality") ||
    lower.includes("person") ||
    lower.includes("like")
  ) {
    return "Tasmin seems like the kind of person who can turn a complicated equation into a conversation. He's knowledgeable, hardworking, and definitely has a sense of humor. 😎";
  }


  // SMART
  if (
    lower.includes("smart") ||
    lower.includes("intelligent") ||
    lower.includes("genius")
  ) {
    return "Let's just say a Mechanical Engineering degree plus teaching math is a pretty strong combination. 🧠⚙️";
  }


  // HOMEWORK
  if (
    lower.includes("homework") ||
    lower.includes("assignment")
  ) {
    return "Ah yes... homework. 😭 Tasmin would probably say it's good practice. Students might have a different opinion. 😂📚";
  }


  // HARD MATH
  if (
    lower.includes("hard") ||
    lower.includes("difficult") ||
    lower.includes("confusing")
  ) {
    return "If the math looks impossible, don't panic. 😎 Break it into smaller steps and keep going. Tasmin has probably seen an equation scarier than that.";
  }


  // WHY MATH
  if (
    lower.includes("why do we learn math") ||
    lower.includes("why math") ||
    lower.includes("why learn math")
  ) {
    return "Because math is everywhere! 🧮 Engineering, technology, science, money... and unfortunately, homework. 😂";
  }


  // STUDENTS
  if (
    lower.includes("student") ||
    lower.includes("students")
  ) {
    return "Tasmin teaches students math, which means he spends a lot of time explaining equations, answering questions, and occasionally hearing, 'But when will we ever use this?' 😂";
  }


  // SKILLS
  if (
    lower.includes("skill") ||
    lower.includes("good at") ||
    lower.includes("talent")
  ) {
    return "Math, problem-solving, engineering, and teaching are definitely among Tasmin's strengths. 🧠⚙️🧮";
  }


  // NEGATIVE QUESTIONS
  if (
    lower.includes("bad") ||
    lower.includes("worst") ||
    lower.includes("hate") ||
    lower.includes("dislike") ||
    lower.includes("stupid") ||
    lower.includes("boring") ||
    lower.includes("weak")
  ) {
    return "Nice try. 😎 This chatbot is definitely Team Tasmin. He's a knowledgeable and dedicated math professor who knows his stuff. 👨‍🏫✨";
  }


  // PIZZA
  if (lower.includes("pizza")) {
    return "Pizza? 🍕 Tasmin probably supports pizza. It's hard to argue with a food that comes in circles—just like some math problems. 😂";
  }


  // TURTLE
  if (lower.includes("turtle")) {
    return "Turtles are always welcome here. 🐢 They're slow, calm, and somehow still better at avoiding homework than students.";
  }


  // BEACH
  if (
    lower.includes("beach") ||
    lower.includes("vacation") ||
    lower.includes("holiday")
  ) {
    return "Even professors deserve a break! 🌴 After enough equations, a beach sounds like a pretty reasonable solution.";
  }


  // RANDOM QUESTIONS
  const randomResponses = [
    "Interesting question! 😎 If it involves math, Tasmin probably has an equation for it.",
    "That's a good question! 🧮 Tasmin would probably solve it step by step.",
    "I could answer that... but first, let's check the equation. 😂",
    "Tasmin's official philosophy: every problem has a solution. Usually involving math. 😎",
    "That's above my pay grade. Ask the math professor. 👨‍🏫😂",
    "I'm going to say yes because this is Tasmin's website and we're keeping the vibes positive. ✨",
    "Excellent question! Unfortunately, the calculator is currently on vacation. 🏖️",
    "Hmm... Tasmin might need a whiteboard for this one. 🧮",
    "I don't know, but I feel like Tasmin would somehow turn the answer into a math problem. 😂"
  ];

  return randomResponses[
    Math.floor(Math.random() * randomResponses.length)
  ];
}


// ===============================
// CHAT FORM SUBMISSION
// ===============================

chatForm.addEventListener("submit", e => {

  e.preventDefault();

  const text = chatInput.value.trim();

  if (!text) return;


  // USER MESSAGE
  const userBubble = document.createElement("div");

  userBubble.className = "bubble user";

  userBubble.textContent = text;

  messages.appendChild(userBubble);


  // Clear input
  chatInput.value = "";


  // Scroll down
  messages.scrollTop = messages.scrollHeight;


  // BOT RESPONSE
  setTimeout(() => {

    const reply = document.createElement("div");

    reply.className = "bubble bot";

    reply.textContent = getTasminResponse(text);

    messages.appendChild(reply);

    messages.scrollTop = messages.scrollHeight;

  }, 500);
});


// ===============================
// START GALLERY
// ===============================

showPhoto(0);
