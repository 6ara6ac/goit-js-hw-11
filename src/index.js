import Notiflix from 'notiflix';
import { fetchImages } from './fetchImages';
export { page };
import Lightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';



const button = document.querySelector('button[type=submit]');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let page = 1;


loadMore.addEventListener ('click', onLoad)
button.addEventListener ('click', onBtnpress)
// gallery.addEventListener ('click', onClickImg);

const options = {
root:null,
rootMargin:'200px'
}

let observer = new IntersectionObserver (onLoad, options)

async function onLoad(entries, observer){
  entries.forEach(async entry=>{
    if (entry.isIntersecting){
    onScroll();
    page +=1;
    await fetchImages(page)
    .then(data => {
    imageList(data.hits)
    if (data.totalHits <= page * 40){
    loadMore.hidden = true;
    observer.unobserve(loadMore);
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  }
}) 
  .catch (err => console.log(err))
    }}
  )
}


function onScroll(){
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
  
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}



function onBtnpress(e){
    e.preventDefault();
    onClear();
    loadMore.hidden = true;

    fetchImages()
    .then(data => {
      if (data.totalHits>0){
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
      imageList(data.hits)
      observer.observe(loadMore)
      Lightbox.refresh();
    }

    else {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    };

    }) 
    .catch (err => console.log(err.message))
}



function imageList(img){
    const markup = img
    .map(({webformatURL, largeImageURL, likes, views, comments, downloads, tags}) => {
        return `
        <div class="photo-card" >
        <a class="gallery__item" href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
        <p class="info-item">
        <b>Likes: ${likes}</b>
        </p>
        <p class="info-item">
        <b>Views: ${views}</b>
        </p>
        <p class="info-item">
        <b>Comments: ${comments}</b>
        </p>
        <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>
`})
.join('')
gallery.insertAdjacentHTML('beforeend',markup) ;
loadMore.hidden = false;
}

export const Lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  showCounter: false,
  animationSpeed: 450,
  fadeSpeed: 350,
});

function onClear(){
  gallery.innerHTML = '';
}




// function onLoad(){
//   onScroll();
//   page +=1;
  
//   fetchImages(page)
//   .then(data => {
//     imageList(data.hits)
//     if (data.totalHits <= page * 40){
//     loadMore.hidden = true;
//     Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
//   }
// }) 
//   .catch (err => console.log(err))
// }

