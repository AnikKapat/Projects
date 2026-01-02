const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const button = document.getElementById("new-quote");

const fonts = [
  "'Dancing Script', cursive",
  "'Quicksand', sans-serif"
];

const fallbackQuotes = [
  { content: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { content: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { content: "The best preparation for tomorrow is doing your best today.", author: "H. Jackson Brown Jr." },
  { content: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
  { content: "Do what you feel in your heart to be right – for you’ll be criticized anyway.", author: "Eleanor Roosevelt" },
  { content: "Everything you can imagine is real.", author: "Pablo Picasso" },
  { content: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { content: "If you want to fly, give up everything that weighs you down.", author: "Buddha" },
  { content: "Life is short, and it's up to you to make it sweet.", author: "Sarah Louise Delany" },
  { content: "Don’t count the days, make the days count.", author: "Muhammad Ali" },
  { content: "It always seems impossible until it’s done.", author: "Nelson Mandela" },
  { content: "Stay close to anything that makes you glad you are alive.", author: "Hafez" },
  { content: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { content: "A smooth sea never made a skilled sailor.", author: "Franklin D. Roosevelt" },
  { content: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { content: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { content: "Happiness depends upon ourselves.", author: "Aristotle" },
  { content: "Let your soul stand cool and composed before a million universes.", author: "Walt Whitman" },
  { content: "Magic is believing in yourself. If you can do that, you can make anything happen.", author: "Goethe" },
  { content: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { content: "Sometimes you have to let go of the picture of what you thought life would be like and learn to find joy in the story you're living.", author: "Rachel Marie Martin" },
  { content: "Even the darkest night will end and the sun will rise.", author: "Victor Hugo" },
  { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { content: "Stars can’t shine without darkness.", author: "D.H. Sidebottom" },
  { content: "With freedom, books, flowers, and the moon, who could not be happy?", author: "Oscar Wilde" },
  { content: "We delight in the beauty of the butterfly, but rarely admit the changes it has gone through to achieve that beauty.", author: "Maya Angelou" },
  { content: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { content: "Dream big. Start small. Act now.", author: "Robin Sharma" },
  { content: "Breathe darling, this is just a chapter, not your whole story.", author: "S.C. Lourie" },
  { content: "Some beautiful paths can’t be discovered without getting lost.", author: "Erol Ozan" }
];

// 🎨 Background rotation
const backgrounds = [
  "images/bg1.jpeg",
  "images/bg3.jpeg",
  "images/bg4.jpeg",
  "images/bg5.jpeg"
];

let lastBg = "";

function setRandomBackground() {
  let chosen;
  do {
    chosen = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  } while (chosen === lastBg);

  lastBg = chosen;
  document.body.style.backgroundImage = `url('${chosen}')`;
}

// 📝 Display quote + animate author
function showQuote(content, author) {
  const fullQuote = `"${content}"`;
  const authorLine = `— ${author}`;

  document.querySelector(".quote-box").classList.add("expanded");

  quoteText.textContent = "";
  quoteAuthor.textContent = "";
  quoteText.style.opacity = 1;
  quoteAuthor.style.opacity = 0;

  const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
  quoteText.style.fontFamily = randomFont;

  // ✨ Typewriter effect for quote
  let i = 0;
  function typeQuote() {
    if (i < fullQuote.length) {
      quoteText.textContent += fullQuote.charAt(i);
      i++;
      setTimeout(typeQuote, 30);
    } else {
      // ✨ After quote, type author
      let j = 0;
      function typeAuthor() {
        if (j < authorLine.length) {
          quoteAuthor.textContent += authorLine.charAt(j);
          j++;
          setTimeout(typeAuthor, 50);
        } else {
          quoteAuthor.style.opacity = 1;
        }
      }
      setTimeout(typeAuthor, 300);
    }
  }

  typeQuote();
}

// 🔁 On button click
function getRandomQuote() {
  setRandomBackground();
  const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  showQuote(random.content, random.author);
}

button.addEventListener("click", getRandomQuote);
