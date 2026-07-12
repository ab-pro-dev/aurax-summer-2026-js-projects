export function loadHome(container) {
  const section = document.createElement('section');
  section.classList.add('home');
  section.innerHTML = '<h2>Welcome to Blue Nile Kitchen</h2>';
  container.appendChild(section);
}
