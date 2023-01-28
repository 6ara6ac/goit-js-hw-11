import axios from 'axios';
export { fetchImages};
import { page } from './index';



async function fetchImages(){
    const API_KEY = "32951992-3201e8549a7160da4f5158a88";
    let userData = document.querySelector('input[type=text]').value;

    const resp = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${userData}
    &image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`)
    return resp.data;

 }




 
 
 