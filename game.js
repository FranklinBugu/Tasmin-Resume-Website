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
    count.textContent = `${String(current + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
    thumbs.forEach((t, i) => t.classList.toggle("active", i === current));
    image.style.opacity = "1";
    image.style.transform = "scale(1)";
  }, 160);
}

document.getElementById("prevPhoto").addEventListener("click", () => showPhoto(current - 1));
document.getElementById("nextPhoto").addEventListener("click", () => showPhoto(current + 1));
thumbs.forEach(t => t.addEventListener("click", () => showPhoto(Number(t.dataset.index))));

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") showPhoto(current - 1);
  if (e.key === "ArrowRight") showPhoto(current + 1);
});

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
  localStorage.setItem("sunny-theme", dark ? "dark" : "light");
});

const chatPanel = document.getElementById("chatPanel");
const chatInput = document.getElementById("chatInput");
const messages = document.getElementById("messages");

function openChat() {
  chatPanel.classList.add("open");
  chatPanel.setAttribute("aria-hidden", "false");
  setTimeout(() => chatInput.focus(), 200);
}
function closeChat() {
  chatPanel.classList.remove("open");
  chatPanel.setAttribute("aria-hidden", "true");
}
document.getElementById("chatOpen").addEventListener("click", openChat);
document.getElementById("chatClose").addEventListener("click", closeChat);
document.getElementById("contactChat").addEventListener("click", openChat);

document.getElementById("chatForm").addEventListener("submit", e => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  const userBubble = document.createElement("div");
  userBubble.className = "bubble user";
  userBubble.textContent = text;
  messages.appendChild(userBubble);
  chatInput.value = "";
  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => {
    const reply = document.createElement("div");
    reply.className = "bubble bot";
    const lower = text.toLowerCase();
    if (lower.includes("pizza")) {
      reply.textContent = "Pizza is definitely part of the résumé. 🍕 My current specialty is eating it.";
    } else if (lower.includes("mit")) {
      reply.textContent = "I graduated from MIT in 2026, where I studied Computer Science.";
    } else if (lower.includes("turtle")) {
      reply.textContent = "Turtles are friends. This website has an unreasonable number of them. 🐢";
    } else {
      reply.textContent = "That sounds interesting! I'd probably answer after a long beach walk. 🌴";
    }
    messages.appendChild(reply);
    messages.scrollTop = messages.scrollHeight;
  }, 550);
});

showPhoto(0);
