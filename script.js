const url = "http://localhost:3000/news?q=";

window.addEventListener("load", () => fetchNews("India"));

async function fetchNews(query) {
  const res = await fetch(`${url}${query}`);
  const data = await res.json();

  bindData(data.articles);
}

function bindData(articles) {
  const cardContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return; // if the article has no image, don't show it

    // here, we need to clone the template so as to make multiple cards
    const cardClone = newsCardTemplate.content.cloneNode(true);
    // this is for cloning every node of the div

    fillDataInCard(cardClone, article);
    cardContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImage = cardClone.querySelector("#news-image");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImage.src = article.urlToImage; // we're changing the image source
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  // the given date is in format, so we need to convert it to a human readable format.
  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name} | ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank"); // "_blank" -> new tab
  });
}

let currSelectedNavItem = null;

function onNavItemClick(searchQuery) {
  fetchNews(searchQuery); // it'll fetch the news with the given searchquery

  // this is for making sure that the nav item we're selecting is active
  const navItem = document.getElementById(searchQuery);
  currSelectedNavItem?.classList.remove("active");
  currSelectedNavItem = navItem;
  currSelectedNavItem.classList.add("active");
}

// handling the nav items (ipl, finance, politics, technology)

const ipl = document.querySelector("#ipl");
const finance = document.querySelector("#finance");
const politics = document.getElementById("politics");
const technology = document.getElementById("technology");

technology.addEventListener("click", () => onNavItemClick("technology"));
politics.addEventListener("click", () => onNavItemClick("politics"));
finance.addEventListener("click", () => onNavItemClick("finance"));
ipl.addEventListener("click", () => onNavItemClick("ipl"));

// now time to handle the search area
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-bar");

searchButton.addEventListener("click", () => {
  const query = searchText.value;

  if (!query) return;

  fetchNews(query);

  currSelectedNavItem?.classList.remove("active");
  // so that the current active navItem is no more active
});

// to reload the page
function reload() {
  window.location.reload();
}
