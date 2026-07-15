const menuData = [
  {
    category: 'Appetizers',
    items: [
      { name: 'Sambusa', description: 'Crispy pastry filled with spiced lentils', price: '20 Birr', image: 'images/sambusa.jpeg', tag: 'Popular' },
      { name: 'Kitfo Tibs', description: 'Sautéed beef with rosemary and garlic', price: '1,250 Birr', image: 'images/Kitfo Tibs.jpg', tag: '' },
      { name: 'Azifa', description: 'Green lentil salad with mustard dressing', price: '850 Birr', image: 'images/Azifa.jpeg', tag: 'Vegetarian' },
    ],
  },
  {
    category: 'Main Courses',
    items: [
      { name: 'Doro Wat', description: 'Spicy chicken stew with hard-boiled eggs', price: '2,200 Birr', image: 'images/Doro Wat.jpg', tag: 'Popular' },
      { name: 'Tibs', description: 'Pan-fried beef with peppers and onions', price: '2,100 Birr', image: 'images/Tibs.jpeg', tag: '' },
      { name: 'Kitfo', description: 'Hand-minced beef with spiced butter', price: '2,350 Birr', image: 'images/Kitfo.jpeg', tag: '' },
      { name: 'Shiro Wat', description: 'Chickpea stew with garlic and ginger', price: '100 Birr', image: 'images/Shiro Wat.jpeg', tag: 'Vegetarian' },
    ],
  },
  {
    category: 'Desserts',
    items: [
      { name: 'Dabo Kolo', description: 'Crunchy roasted chickpea snack', price: '50 Birr', image: 'images/Dabo Kolo.jpeg', tag: '' },
      { name: 'Baklava', description: 'Layered pastry with honey and nuts', price: '90 Birr', image: 'images/Baklava.jpeg', tag: 'Popular' },
      { name: 'Fresh Fruit Plate', description: 'Seasonal tropical fruits', price: '250 Birr', image: 'images/Fresh Fruit Plate.jpeg', tag: 'Vegetarian' },
    ],
  },
  {
    category: 'Drinks',
    items: [
      { name: 'Ethiopian Coffee', description: 'Traditional ceremonial brew', price: '30 Birr', image: 'images/Ethiopian Coffee.jpg', tag: 'Popular' },
      { name: 'Tej', description: 'Honey wine with a sweet finish', price: '30 Birr', image: 'images/Tej.jpeg', tag: '' },
      { name: 'Fresh Juice', description: 'Mango, avocado, or pineapple', price: '150 Birr', image: 'images/Fresh Juice.jpeg', tag: 'Vegetarian' },
    ],
  },
];

function createCard(item) {
  const card = document.createElement('div');
  card.classList.add('menu-card');

  const tagHTML = item.tag
    ? `<span class="card-tag ${item.tag.toLowerCase()}">${item.tag}</span>`
    : '';

  card.innerHTML = `
    <div class="card-image">
      <img src="${item.image}" alt="${item.name}">
      ${tagHTML}
    </div>
    <div class="card-body">
      <h4 class="card-title">${item.name}</h4>
      <p class="card-desc">${item.description}</p>
      <span class="card-price">${item.price}</span>
    </div>
  `;

  return card;
}

function createCategory(category) {
  const div = document.createElement('div');
  div.classList.add('menu-category');

  const title = document.createElement('h3');
  title.textContent = category.category;
  div.appendChild(title);

  const grid = document.createElement('div');
  grid.classList.add('menu-grid');

  category.items.forEach(item => {
    grid.appendChild(createCard(item));
  });

  div.appendChild(grid);
  return div;
}

export function loadMenu(container) {
  const section = document.createElement('section');
  section.classList.add('menu');

  const heading = document.createElement('h2');
  heading.textContent = 'Our Menu';
  section.appendChild(heading);

  menuData.forEach(category => {
    section.appendChild(createCategory(category));
  });

  container.appendChild(section);
}
