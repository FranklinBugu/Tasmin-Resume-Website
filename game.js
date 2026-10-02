// ===============================
// GALLERY
// ===============================

const photos = [
  {
    src: "character-1.jpeg",
    alt: "Tasmin standing tall",
    label: "01 / STANDING TALL",
    title: "Ready for whatever comes next.",
    description: "A calm day, a big idea, and absolutely no reason to stand normally."
  },
  {
    src: "character-2.jpeg",
    alt: "Tasmin doing a low pose",
    label: "02 / LOW PROFILE",
    title: "Keeping things flexible.",
    description: "Sometimes the best way to solve a problem is to look at it from a completely different angle."
  },
  {
    src: "character-3.jpeg",
    alt: "Tasmin making a peace sign",
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

document.getElementById("prevPhoto").addEventListener("click", () => showPhoto(current - 1));
document.getElementById("nextPhoto").addEventListener("click", () => showPhoto(current + 1));

thumbs.forEach(t => {
  t.addEventListener("click", () => showPhoto(Number(t.dataset.index)));
});

document.addEventListener("keydown", e => {
  // don't flip photos while typing in the chat box
  if (document.activeElement && document.activeElement.tagName === "INPUT") return;
  if (e.key === "ArrowLeft") showPhoto(current - 1);
  if (e.key === "ArrowRight") showPhoto(current + 1);
});


// ===============================
// DARK / LIGHT MODE
// ===============================

const themeToggle = document.getElementById("themeToggle");
let savedTheme = null;

try { savedTheme = localStorage.getItem("tasmin-theme"); } catch (e) {}

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  themeToggle.textContent = dark ? "☀" : "☾";
  try { localStorage.setItem("tasmin-theme", dark ? "dark" : "light"); } catch (e) {}
});


// ===============================
// CHAT: OPEN / CLOSE
// ===============================

const chatPanel = document.getElementById("chatPanel");
const chatInput = document.getElementById("chatInput");
const messages = document.getElementById("messages");
const chatForm = document.getElementById("chatForm");

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


// ===============================
// CHAT: EXTRA STYLES (injected, so no CSS edits needed)
// ===============================

const chatStyle = document.createElement("style");
chatStyle.textContent = `
  .chips { display:flex; flex-wrap:wrap; gap:6px; padding:8px 12px 0; }
  .chip {
    font: inherit; font-size: 12px; cursor: pointer;
    padding: 6px 10px; border-radius: 999px;
    border: 1px solid currentColor; background: transparent; color: inherit;
    opacity: .75; transition: opacity .15s, transform .15s;
  }
  .chip:hover { opacity: 1; transform: translateY(-1px); }
  .bubble.typing { display:inline-flex; gap:4px; align-items:center; }
  .bubble.typing span {
    width:6px; height:6px; border-radius:50%; background: currentColor; opacity:.4;
    animation: tasminDot 1s infinite ease-in-out;
  }
  .bubble.typing span:nth-child(2) { animation-delay: .15s; }
  .bubble.typing span:nth-child(3) { animation-delay: .3s; }
  @keyframes tasminDot { 0%,80%,100% { transform: translateY(0); opacity:.3; } 40% { transform: translateY(-4px); opacity:1; } }
`;
document.head.appendChild(chatStyle);


// ===============================
// CHAT: BRAIN
// ===============================

// --- helpers ---
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// Each intent keeps its own "bag" so replies never repeat until all were used
const bags = {};
function pickFresh(key, arr) {
  if (!bags[key] || bags[key].length === 0) {
    bags[key] = arr.map((_, i) => i).sort(() => Math.random() - 0.5);
  }
  return arr[bags[key].pop()];
}

// --- chat memory ---
const memory = {
  name: null,
  messageCount: 0,
  fallbackStreak: 0,
  lastIntent: null,
  roastLevel: 0
};

// --- roast & jokes about Mr. Tasmin ---
const roasts = [
  "Tasmin has a degree in Mechanical Engineering, yet his greatest invention is a new excuse to avoid paperwork. ⚙️📄",
  "Tasmin teaches math all day, but still can't calculate how many hours he'll waste avoiding unnecessary forms. 🧮😂",
  "Tasmin is 28 and has already perfected the 'I'll do it tomorrow' algorithm. Time complexity: forever. ⏳",
  "Fun fact: Tasmin can solve differential equations but struggles to stand like a normal human in photos. 📸🧍",
  "Tasmin's gallery has a pose called 'Low Profile'. A Mechanical Engineer who bends the rules of posture. 🤸",
  "Tasmin once told a student 'it's easy', and the student is still looking for the answer. 😈",
  "Tasmin's love language is handing out homework. 'I made you 40 problems because I care.' 💌📚",
  "Tasmin: 'Math is simple.' Also Tasmin: *needs 3 coffees and a whiteboard to explain it.* ☕",
  "Tasmin engineered a peace sign with the tongue out. Efficiency of the pose: questionable. Vibes: immaculate. ✌️😛",
  "If procrastination were an engineering discipline, Tasmin would have a PhD and a tenure offer. 🎓",
  "Tasmin's ideal day: solve one beautiful problem, eat pizza, avoid paperwork. In that order. 🍕",
  "Tasmin's students say he's tough. Tasmin says he's 'just correcting the universe's errors.' 📏"
];

const jokes = [
  "Why was the math book sad? It had too many problems. 📘😢",
  "Why did Tasmin the engineer break up with the circle? It was pointless. ⭕",
  "Parallel lines have so much in common. It's a shame they'll never meet. Tasmin relates to his inbox. 📬",
  "Why do Tasmin's students like algebra? Because it's the only time they're allowed to say 'x marks the spot.' 🏴‍☠️",
  "What did the mechanical engineer say about his math professor job? 'I came for the torque, I stayed for the tenure.' 🔩",
  "Tasmin's favourite bakery item? Pi. And yes, he'll tell you about it even if you didn't ask. 🥧"
];

const funFacts = [
  "Fun fact: Tasmin is 28 years old, which is a perfect number. (Yes, really: 1+2+4+7+14 = 28.) 🤓",
  "Fun fact: 'Mechanical Engineering' is just Latin for 'I like stuff that moves, and I like to calculate it.' ⚙️",
  "Fun fact: the infinity symbol on this site isn't decoration. It's Tasmin's actual to-do list. ∞",
  "Fun fact: Tasmin's most dangerous weapon is a red pen. 🖊️"
];

const compliments = [
  "Okay okay, being serious for a second: Tasmin is a genuinely solid professor who makes hard problems feel doable. 👏",
  "Real talk: Tasmin explains math like an engineer, so it actually makes sense. That's rarer than it sounds. 🧠",
  "Tasmin is dedicated, patient with students, and secretly very proud when someone finally gets it. 🥹"
];

// --- intents: order matters (first match wins) ---
const intents = [

  {
    id: "help",
    test: /\b(help|commands?|what can you do|options)\b/,
    replies: [
      "I can: roast Tasmin 🔥, tell a joke 😂, share a fun fact 🤓, solve quick math (try 12*7+3 🧮), or chat about his degree, job, pizza and paperwork. Go wild."
    ]
  },

  {
    id: "roast",
    test: /\b(roast|insult|burn|clown|make fun|trash talk|expose|embarrass)\b/,
    handler: () => {
      memory.roastLevel++;
      const base = pickFresh("roast", roasts);
      if (memory.roastLevel === 3) return base + " (That's roast #3. Tasmin is sending me a very polite email. 📧)";
      if (memory.roastLevel >= 5) return base + " (Okay I should stop. Tasmin knows where I'm hosted. 😅)";
      return base;
    }
  },

  {
    id: "joke",
    test: /\b(jokes?|funny|laugh|make me laugh|humou?r)\b/,
    handler: () => pickFresh("joke", jokes)
  },

  {
    id: "fact",
    test: /\b(facts?|trivia|something interesting|tell me something)\b/,
    handler: () => pickFresh("fact", funFacts)
  },

  {
    id: "compliment",
    test: /\b(compliment|nice things?|praise|serious|real talk|honest(ly)?)\b/,
    handler: () => pickFresh("compliment", compliments)
  },

  {
    id: "thanks",
    test: /\b(thanks?|thank you|thx|ty|appreciate)\b/,
    replies: [
      "You're welcome! Tasmin accepts payment in pizza. 🍕",
      "Anytime! Unlike Tasmin's homework, I have no deadline. 😎",
      "No problem! Please tell Tasmin I worked overtime. ⏱️"
    ]
  },

  {
    id: "bye",
    test: /\b(bye|goodbye|see you|cya|later|gotta go)\b/,
    replies: [
      "Bye! Don't forget: every problem has a solution. Except Tasmin's paperwork. 📄👋",
      "See you! Tasmin will pretend he was working the whole time. 😌",
      "Leaving already? I was just about to roast Tasmin again. 🔥"
    ]
  },

  {
    id: "greeting",
    test: /\b(hello|hi|hey|heyy+|yo|sup|hola|good (morning|afternoon|evening)|what'?s up)\b/,
    handler: () => {
      const who = memory.name ? ` ${memory.name}` : "";
      return pickFresh("greeting", [
        `Hey${who}! 👋 Welcome to Tasmin's corner of the internet.`,
        `Hello${who}! 😎 Want facts about Tasmin, or want me to roast him? Both are valid.`,
        `Hi${who}! I promise this chat is more fun than math homework. 😂`,
        `Yo${who}! Tasmin is busy avoiding paperwork, so I'm in charge now. 🧮`
      ]);
    }
  },

  {
    id: "howareyou",
    test: /\b(how are you|how r u|how('?s| is) it going|you good|you ok)\b/,
    replies: [
      "I'm doing great! Zero homework, zero paperwork, 100% chatbot. 😎",
      "Running at 100% efficiency. Which is more than Tasmin on a Monday. ☕",
      "Fantastic! I'm made of JavaScript, so my only problems are semicolons. 😂"
    ]
  },

  {
    id: "who",
    test: /\b(who (is|are)|about|introduce|tell me about)\b.*\b(tasmin|him|he|you)\b|^tasmin$/,
    replies: [
      "Tasmin is a 28-year-old math professor with a Mechanical Engineering degree. He solves problems for fun and avoids paperwork for sport. 👨‍🏫⚙️",
      "Meet Tasmin: part math professor, part engineer, part professional problem solver, 100% allergic to unnecessary forms. 📄🚫",
      "Tasmin = Mechanical Engineering degree + math brain + suspiciously good posture in photos (kidding, he has none). 😂"
    ]
  },

  {
    id: "age",
    test: /\b(how old|age|years old|birthday|born)\b/,
    replies: [
      "Tasmin is 28! 🎂 Young enough to understand technology, old enough to complain about it.",
      "28 years old. That's a perfect number, by the way (1+2+4+7+14 = 28). Tasmin was born mathematically gifted. 🤓",
      "28! Old enough to have a degree, young enough to still say 'one more problem' at 2 AM. 🌙"
    ]
  },

  {
    id: "degree",
    test: /\b(degree|education|graduat(e|ed|ion)|university|college|school|studied|study)\b/,
    replies: [
      "Tasmin studied Mechanical Engineering. 🔧 Then he thought, 'I should also teach math.' Overachiever alert. 🚨",
      "Mechanical Engineering degree: check. Now he spends his days teaching math instead of building bridges. Bridges got off easy. 🌉",
      "He graduated in Mechanical Engineering, which means he can fix a machine and also explain why it's mathematically broken. 😎⚙️"
    ]
  },

  {
    id: "engineering",
    test: /\b(mechanical|engineer(s|ing)?|machines?|build|gears?|physics)\b/,
    replies: [
      "Mechanical Engineering means Tasmin understands machines, forces, and why nothing works the first time. ⚙️",
      "As an engineer, Tasmin believes everything can be improved. Except his sleep schedule. 😴",
      "Engineers solve problems. Tasmin solves them, then teaches them, then assigns more. A full ecosystem. 🔁"
    ]
  },

  {
    id: "professor",
    test: /\b(professor|teachers?|teach(es|ing)?|class|lecture|exam|test|grades?)\b/,
    replies: [
      "Yes! Tasmin is a math professor. 👨‍🏫 His job: help students understand math, then give them more math.",
      "Tasmin teaches math with an engineer's mindset: 'Don't memorize it, understand the machine.' (Then still memorize it.) 📏",
      "His exams are 'fair'. Students describe that word differently. 📝😅",
      "Tasmin's grading system: effort is nice, but the answer must be right. Very engineer of him. ✅❌"
    ]
  },

  {
    id: "homework",
    test: /\b(homework|assignments?|due|deadline|paperwork|forms?|admin)\b/,
    replies: [
      "Homework? 😭 Tasmin calls it 'practice'. Students call it other things.",
      "Paperwork is Tasmin's natural enemy. He can defeat any equation but loses to a 6-page form. 📄⚔️",
      "Deadline? Tasmin gives them. He does not enjoy receiving them. 😂",
      "Tasmin avoids unnecessary paperwork like it's a bug in his code. Which is ironic, because he has no code. 🐛"
    ]
  },

  {
    id: "math",
    test: /\b(math|maths|mathematics|equations?|algebra|calculus|geometry|trig(onometry)?|integral|derivative|numbers?|formula)\b/,
    replies: [
      "Math is Tasmin's home turf. 🧮 Equations are basically his natural habitat.",
      "Algebra, calculus, geometry: Tasmin has seen it all. Mostly on whiteboards at 11 PM. 🕚",
      "Tasmin says math is just logic wearing a fancy hat. 🎩 (Student reviews of the hat vary.)",
      "Ask Tasmin for help with calculus, and he'll say 'it's just slopes.' Then he'll draw 14 slopes. 📈"
    ]
  },

  {
    id: "whymath",
    test: /\bwhy\b.*\b(learn|study|need|use)\b.*\bmath\b|\bwhen will (we|i) (ever )?use\b/,
    replies: [
      "Because math is everywhere: engineering, money, games, pizza slices. (Especially pizza slices.) 🍕",
      "That's the famous 'When will we ever use this?' question. Tasmin hears it daily and slowly loses a bit of his soul. 😅"
    ]
  },

  {
    id: "hard",
    test: /\b(hard|difficult|confusing|impossible|struggl(e|ing)|stuck|can'?t do|don'?t understand)\b/,
    replies: [
      "If it looks impossible, break it into small steps. That's Tasmin's engineering trick. 🔧 Step 1: breathe. Step 2: coffee.",
      "Confused? Tasmin would say: 'Draw a picture.' Then he'd draw a very confusing picture. ✏️😂",
      "Totally normal! Even Tasmin gets stuck. He just calls it 'exploring the solution space.' 🚀"
    ]
  },

  {
    id: "smart",
    test: /\b(smart|intelligent|genius|brain|clever)\b/,
    replies: [
      "Engineering degree + math professor? Yeah, Tasmin is smart. Terribly annoying about it too. 🧠",
      "Tasmin is smart enough to avoid paperwork and teach math. That's a rare combo. 😎"
    ]
  },

  {
    id: "personality",
    test: /\b(personality|what('?s| is) he like|funny guy|character|vibe)\b/,
    replies: [
      "Tasmin is calm, curious, a little dramatic about equations, and capable of turning a hard problem into a conversation. 😎",
      "Personality: 60% problem solver, 25% jokes, 15% 'sorry I was thinking about an equation.' 🧮"
    ]
  },

  {
    id: "negative",
    test: /\b(bad|worst|hate|dislike|stupid|boring|weak|dumb|useless|terrible|awful|sucks?|lazy)\b/,
    replies: [
      "Nice try. 😎 This chatbot is Team Tasmin. (I'll still roast him, but only I'm allowed.)",
      "Bold of you to attack the person who writes your exam. 😏",
      "I'm legally allowed to roast Tasmin. You, however, need a permission slip. 📄"
    ]
  },

  {
    id: "single",
    test: /\b(girlfriend|boyfriend|married|wife|single|dating|relationship|crush)\b/,
    replies: [
      "Tasmin's love life is classified. Mostly because I don't have the data. 🕵️",
      "His only confirmed relationship is with a whiteboard marker. 🖊️❤️",
      "Relationship status: in a committed relationship with Mathematics. It's complicated. 💘"
    ]
  },

  {
    id: "pizza",
    test: /\b(pizza|pizzas|food|eat|hungry|snack|coffee)\b/,
    replies: [
      "Pizza? 🍕 Tasmin approves. It comes in circles, just like some math problems.",
      "Tasmin runs on pizza and coffee. That's not a joke, that's a power supply. ☕🍕",
      "Pizza is geometry you can eat: circle, sectors, angles. Tasmin calls it 'study material.' 📐"
    ]
  },

  {
    id: "turtle",
    test: /\b(turtles?|tortoise)\b/,
    replies: [
      "Turtles are always welcome here. 🐢 Slow, calm, and better at avoiding homework than students.",
      "A turtle carries its home everywhere. Tasmin carries his whiteboard marker. Same energy. 🐢🖊️"
    ]
  },

  {
    id: "beach",
    test: /\b(beach|vacation|holiday|relax|break|travel)\b/,
    replies: [
      "Even professors deserve a break! 🌴 After enough equations, the beach is a reasonable solution.",
      "Tasmin on vacation still calculates the wave frequency. He can't help it. 🌊📐",
      "Beach day for Tasmin = sunscreen, sandals, and quietly solving a problem in the sand. 🏖️"
    ]
  },

  {
    id: "gallery",
    test: /\b(photos?|pictures?|gallery|pose|posing|peace sign|tongue)\b/,
    replies: [
      "Check the gallery! Three photos, zero normal poses. That's confidence. 📸",
      "The tongue-out peace sign was 'intentional'. We believe him. Mostly. ✌️😛",
      "Tasmin's pose in photo #2 is called 'Low Profile'. Mechanical engineers never do things the standard way. 🤸"
    ]
  },

  {
    id: "contact",
    test: /\b(contact|email|phone|number|reach|address|social|instagram|linkedin)\b/,
    replies: [
      "For the official contact, use this chat. It's the fastest route to Tasmin's brain (and also the least reliable one). 😂",
      "Tasmin's email is somewhere between his paperwork and his unread messages. Good luck. 📬"
    ]
  },

  {
    id: "chatbot",
    test: /\b(are you (a )?(bot|ai|robot|real)|who made you|your name|who are you|what are you)\b/,
    replies: [
      "I'm Tasmin's chatbot: 100% JavaScript, 0% paperwork. 🤖",
      "I'm a bot built to defend, praise, and lovingly roast Tasmin. That's my whole job. 🎭",
      "I'm an AI-ish assistant. Tasmin did not pay me, so my loyalty is purely mathematical. 🧮"
    ]
  },

  {
    id: "love",
    test: /\b(love|like)\b.*\b(you|bot)\b|\bi love\b/,
    replies: [
      "Aww! 🥹 I love you too, in a non-binary way. (Get it? Binary? ...I'll see myself out.) 💾",
      "That's sweet! I'd blush, but my CSS doesn't support it. 😳"
    ]
  },

  {
    id: "yesno",
    test: /^(yes|no|yeah|yep|nope|nah|ok|okay|sure|maybe|idk|lol|lmao|haha+|hehe+)$/,
    replies: [
      "Ha! 😂 Okay, now ask me something about Tasmin before I start making things up.",
      "I see. Deep. Profound. Equation-worthy. 🧮 Want a roast or a joke?",
      "Cool cool cool. Say 'roast' for fireworks. 🔥"
    ]
  },

  {
    id: "meaning",
    test: /\b(meaning of life|42|universe)\b/,
    replies: [
      "The meaning of life is 42. Tasmin checked the proof, but the margin was too small. 🌌",
      "Tasmin says the meaning of life is finding a problem worth solving and a snack worth eating. 🍕"
    ]
  }
];


// --- math solver (safe) ---
function trySolveMath(text) {
  let expr = text
    .toLowerCase()
    .replace(/what('?s| is)/g, "")
    .replace(/calculate|solve|compute|=|\?/g, "")
    .replace(/[x×]/g, "*")
    .replace(/÷/g, "/")
    .replace(/\^/g, "**")
    .replace(/,/g, "")
    .trim();

  // only digits, operators, parentheses, dots and spaces allowed
  if (!/^[\d\s+\-*/().%]+$/.test(expr)) return null;
  if (!/\d/.test(expr) || !/[+\-*/%]/.test(expr)) return null;
  if (expr.length > 60) return null;

  try {
    const result = Function(`"use strict"; return (${expr});`)();
    if (typeof result !== "number" || !isFinite(result)) {
      return "Dividing by zero? 😳 Even Tasmin won't go there. The universe has rules.";
    }
    const rounded = Math.round(result * 1e8) / 1e8;
    return pickFresh("math", [
      `That's ${rounded}. Tasmin would charge me for this. 🧮💸`,
      `${rounded}! Easy. Tasmin's grading hand just twitched. ✅`,
      `Answer: ${rounded}. Show your work next time, Tasmin would insist. 📝`,
      `I computed ${rounded} without a single paperwork form. Efficient. 😎`
    ]);
  } catch (err) {
    return null;
  }
}


// --- fallback replies (when nothing matches) ---
function fallbackReply(text) {
  memory.fallbackStreak++;

  const snippet = text.length > 40 ? text.slice(0, 37) + "..." : text;

  if (memory.fallbackStreak >= 3) {
    memory.fallbackStreak = 0;
    return pickFresh("fallbackStreak", [
      "I'm running out of Tasmin knowledge here. 😅 Try: 'roast', 'joke', 'fun fact', or a math problem like 15*4.",
      "Okay, I'm lost, but in a charming way. Type 'help' and I'll show you what I can do. 🧭"
    ]);
  }

  return pickFresh("fallback", [
    `"${snippet}" huh? 🤔 Tasmin would turn that into a word problem and make you solve it.`,
    `Interesting! I don't have a data entry for that, but Tasmin would say 'let x be the answer.' 🧮`,
    `That's above my pay grade. Ask the math professor. 👨‍🏫😂`,
    `I could answer that, but my calculator is on vacation. 🏖️`,
    `Tasmin's official philosophy: every problem has a solution. Mine is changing the subject. Roast or joke? 😎`,
    `Hmm... Tasmin would need a whiteboard for that one. 🖊️`,
    `I'm going to say yes, because this is Tasmin's website and we keep the vibes positive. ✨`,
    `Tasmin doesn't know that one either, but he'd say 'good question' with total confidence. 😌`
  ]);
}


// --- main response function ---
function getTasminResponse(question) {
  memory.messageCount++;

  const raw = question.trim();
  const lower = raw.toLowerCase().replace(/[!.,]+$/g, "");

  // remember the user's name
  const nameMatch = lower.match(/(?:my name is|call me)\s+([a-z]+)/);
  if (nameMatch) {
    memory.name = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
    memory.fallbackStreak = 0;
    return pickFresh("name", [
      `Nice to meet you, ${memory.name}! 😄 I'll remember that longer than Tasmin remembers faculty meetings.`,
      `${memory.name}! Great name. Tasmin would definitely mispronounce it once, then apologise with pizza. 🍕`
    ]);
  }

  // math first
  const math = trySolveMath(lower);
  if (math) {
    memory.fallbackStreak = 0;
    return math;
  }

  // intents
  for (const intent of intents) {
    if (intent.test.test(lower)) {
      memory.fallbackStreak = 0;
      memory.lastIntent = intent.id;
      if (intent.handler) return intent.handler();
      return pickFresh(intent.id, intent.replies);
    }
  }

  // nothing matched
  return fallbackReply(raw);
}


// ===============================
// CHAT: UI (typing indicator, chips, submit)
// ===============================

// Quick-reply chips
const chips = document.createElement("div");
chips.className = "chips";

["Roast Tasmin 🔥", "Tell me a joke 😂", "Fun fact 🤓", "12*7+3", "Help 🧭"].forEach(textLabel => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip";
  b.textContent = textLabel;
  b.addEventListener("click", () => {
    // strip the emoji for matching: "Roast Tasmin 🔥" -> "roast tasmin"
    sendMessage(textLabel.replace(/[^\w\s*+\-/().]/gu, "").trim());
  });
  chips.appendChild(b);
});

chatForm.parentNode.insertBefore(chips, chatForm);

function addBubble(text, who) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${who}`;
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}

let busy = false;

function sendMessage(text) {
  if (!text || busy) return;
  busy = true;

  addBubble(text, "user");

  // typing indicator
  const typing = document.createElement("div");
  typing.className = "bubble bot typing";
  typing.innerHTML = "<span></span><span></span><span></span>";
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  const reply = getTasminResponse(text);

  // longer replies "type" a bit longer (500ms to 1400ms)
  const delay = Math.min(1400, 500 + reply.length * 6);

  setTimeout(() => {
    typing.remove();
    addBubble(reply, "bot");
    busy = false;
  }, delay);
}

chatForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = "";
  sendMessage(text);
});


// ===============================
// START GALLERY
// ===============================

showPhoto(0);
