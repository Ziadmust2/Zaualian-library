document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  const welcomeUser = document.getElementById("welcomeUser");
  if (username && welcomeUser) {
    welcomeUser.textContent = `Welcome, ${username}!`;
  }

  displayStories();
});

function logout() {
  localStorage.removeItem("username");
  window.location.href = "login.html";
}

function addStory() {
  const input = document.getElementById("storyName");
  const story = input.value.trim();
  if (!story) return;

  let stories = JSON.parse(localStorage.getItem("stories")) || [];

  // Only store valid string story names
  if (!stories.includes(story) && typeof story === "string") {
    stories.push(story);
    localStorage.setItem("stories", JSON.stringify(stories));
  }

  input.value = "";
  displayStories();
}

function displayStories() {
  const list = document.getElementById("storyList");
  if (!list) return;
  list.innerHTML = "";

  let stories = JSON.parse(localStorage.getItem("stories")) || [];

  // Filter out any invalid entries
  stories = stories.filter(item => typeof item === "string");

  // Save cleaned stories back
  localStorage.setItem("stories", JSON.stringify(stories));

  stories.forEach(name => {
    const div = document.createElement("div");
    div.className = "story-entry";
    div.innerHTML = `
      <h3>${name}</h3>
      <a href="story_homepage.html?story=${encodeURIComponent(name)}">Go to Story</a>
    `;
    list.appendChild(div);
  });
}

// --- Review Logic for story_homepage.html ---
if (window.location.pathname.includes("story_homepage.html")) {
  const params = new URLSearchParams(window.location.search);
  const storyName = params.get("story");
  const reviewKey = `reviews_${storyName}`;
  const storyTitle = document.getElementById("storyTitle");
  const reviewsContainer = document.getElementById("reviews");
  const reviewInput = document.getElementById("reviewText");

  if (storyTitle) {
    storyTitle.textContent = storyName || "Unknown Story";
  }

  function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem(reviewKey)) || [];
    reviewsContainer.innerHTML = reviews.length
      ? reviews.map(r => `<p><strong>${r.user}</strong>: ${r.text}</p>`).join("")
      : "<p>No reviews yet. Be the first!</p>";
  }

  function submitReview() {
    const text = reviewInput.value.trim();
    if (!text) return;

    const user = localStorage.getItem("username") || "Anonymous";
    const newReview = { user, text };

    const reviews = JSON.parse(localStorage.getItem(reviewKey)) || [];
    reviews.push(newReview);
    localStorage.setItem(reviewKey, JSON.stringify(reviews));

    reviewInput.value = "";
    loadReviews();
  }

  window.submitReview = submitReview; // Make it callable from HTML
  loadReviews();
}
