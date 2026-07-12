import { loadHome } from './home.js';
import { loadMenu } from './menu.js';
import { loadAbout } from './about.js';
import { loadContact } from './contact.js';

const content = document.getElementById('content');
const links = document.querySelectorAll('nav a');

function clearContent() {
  content.innerHTML = '';
}

function setActiveLink(selectedLink) {
  links.forEach(link => link.classList.remove('active'));
  selectedLink.classList.add('active');
}

function navigate(e) {
  e.preventDefault();
  const target = e.target.dataset.page;

  clearContent();

  switch (target) {
    case 'home':
      loadHome(content);
      setActiveLink(e.target);
      break;
    case 'menu':
      loadMenu(content);
      setActiveLink(e.target);
      break;
    case 'about':
      loadAbout(content);
      setActiveLink(e.target);
      break;
    case 'contact':
      loadContact(content);
      setActiveLink(e.target);
      break;
    default:
      loadHome(content);
      setActiveLink(links[0]);
  }
}

links.forEach(link => link.addEventListener('click', navigate));

loadHome(content);
setActiveLink(links[0]);
