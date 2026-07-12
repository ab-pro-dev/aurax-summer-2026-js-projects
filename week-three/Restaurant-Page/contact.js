export function loadContact(container) {
  const section = document.createElement('section');
  section.classList.add('contact');
  section.innerHTML = '<h2>Contact Us</h2>';
  container.appendChild(section);
}
