const grid = document.querySelector(".grid");
const form = document.querySelector(".form");
const input = document.querySelector(".input");
const spinner = document.querySelector(".spinner-overlay");
const loadMoreBtn = document.querySelector(".load-more");
// tolik----------------------
const favoriteBtn = document.querySelector('.menu__link');
const favorite = document.querySelector('.favorite');
// console.log(favoriteBtn);
// console.log(favorite);
// tolik----------------------

let currentPage = 1;
let currentQuery = "";

const API_KEY = "5837779-ac3ba737206b541ae294f1119";

const toggleSpinner = () => spinner.classList.toggle("visible");

const showLoadMoreBtn = () => {
  if (!loadMoreBtn.classList.contains("visible")) {
    loadMoreBtn.classList.add("visible");
  }
};

const resetCurrentPage = () => {
  currentPage = 1;
};

const incrementCurrentPage = () => {
  currentPage += 1;
};

const scrollToBottom = () => scrollTo(0, document.body.scrollHeight);

const fetchImages = ({ query, count, page }) => {
  const url = `https://pixabay.com/api/?image_type=photo&q=${query}&per_page=${count}&page=${page}&key=${API_KEY}`;

  return fetch(url)
    .then(response => {
      if (response.ok) return response.json();

      throw new Error("error: " + response.statusText);
    })
    .then(data => data.hits)
    .catch(err => console.log(err));
};

const createGridItems = items => {
  return items.reduce(
    (markup, item) =>
      markup +
      `<div class="grid-item">
        <img src=${item.webformatURL} id="${item.id}" alt="photo">
        <button type="submit" class="favoriteBtn">Favorite</button>
      </div>`,
    ""
  );
};

const updatePhotosGrid = markup => {
  grid.insertAdjacentHTML("beforeend", markup);
  // toik----------------------
  const favoriteBtn = document.querySelectorAll(".favoriteBtn");
 
  // console.log(favoriteBtn);
  // tolik----------------------
};

const resetPhotosGrid = () => {
  grid.innerHTML = "";
};

const handleFetch = params => {
  toggleSpinner();

  fetchImages(params).then(photos => {
    const markup = createGridItems(photos);
    updatePhotosGrid(markup);
    toggleSpinner();
    scrollToBottom();
  });
};

const handleFormSumit = e => {
  e.preventDefault();

  resetCurrentPage();
  resetPhotosGrid();

  currentQuery = input.value;

  handleFetch({
    query: currentQuery,
    count: 12,
    page: currentPage
  });

  e.target.reset();
  showLoadMoreBtn();
};

const hanelLoadMoreClick = () => {
  incrementCurrentPage();

  handleFetch({
    query: currentQuery,
    count: 12,
    page: currentPage
  });
};




// tolik-------------------------------------


const storageGet = () => {
  const data = localStorage.getItem('favorite');
  return data ? JSON.parse(data) : [];
};


let favoriteImgs = storageGet();
// let favoriteImgs = [];
console.log(favoriteImgs);


const setStorage = (value) => {
  localStorage.setItem('favorite', JSON.stringify(value));
};
// setStorage([]);

// export const set = value => {
//   localStorage.setItem('image-finder-app', JSON.stringify(value));
// };

// export const get = () => {
//   const data = localStorage.getItem('image-finder-app');

//   return data ? JSON.parse(data) : [];
// };

const addToFavorite = event => {
  if (event.target.tagName === "BUTTON") {
   console.log(event.target.previousElementSibling.id);
    const contain = favoriteImgs.find(elem => elem.src === event.target.previousElementSibling.src);
    if(!contain){
    favoriteImgs.unshift({ src: `${event.target.previousElementSibling.src}` });};
    setStorage(favoriteImgs);
  }
};








const articleTmp = (items) => {
  return `<div class="grid-item">
  <img src=${items}>
  <button type=" submit " class="removeButton">Remove URL</button>
</div>`
 
};

const markup = () => {
    return favoriteImgs.reduce((acc, element) => acc + articleTmp(element.src), "");
};

const openFavorite = () =>{

  favorite.insertAdjacentHTML("beforeend", markup());
};


const removeFavorite = event => {
  if (event.target.tagName === "BUTTON") {
    let searchName = event.target.previousElementSibling.src;
    console.log('searchName', searchName);
    let index = favoriteImgs.findIndex(el => el.src === searchName);
    console.log('index', index);
    console.log('favoriteImgs[ind]', favoriteImgs[index]);
    event.target.parentNode.remove();
    console.log(favoriteImgs[index]);
    favoriteImgs.splice(index, 1);
    // delete favoriteImgs.index;
    console.log('favoriteImgs', favoriteImgs);
    setStorage(favoriteImgs);
  }
};

grid.addEventListener("click", addToFavorite);
favoriteBtn.addEventListener('click', openFavorite);
favorite.addEventListener("click", removeFavorite);

// tolik--------------------------------------

form.addEventListener("submit", handleFormSumit);
loadMoreBtn.addEventListener("click", hanelLoadMoreClick);
