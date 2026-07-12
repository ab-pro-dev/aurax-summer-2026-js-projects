export function loadMenu(container) {
  const section = document.createElement('section');
  section.classList.add('menu');
  section.innerHTML = '<h2>Our Menu</h2>';
  container.appendChild(section);
}
