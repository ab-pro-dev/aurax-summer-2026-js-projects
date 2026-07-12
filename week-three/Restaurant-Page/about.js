export function loadAbout(container) {
  const section = document.createElement('section');
  section.classList.add('about');
  section.innerHTML = '<h2>About Us</h2>';
  container.appendChild(section);
}
