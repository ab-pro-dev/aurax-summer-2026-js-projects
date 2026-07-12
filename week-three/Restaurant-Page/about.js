const aboutData = {
  story: {
    title: 'Our Story',
    text: 'Blue Nile Kitchen was founded in 2018 by a family passionate about sharing the rich flavors of Ethiopian cuisine. What started as a small pop-up has grown into a beloved neighborhood restaurant where every meal tells a story of tradition and love.',
  },
  mission: {
    title: 'Our Mission',
    text: 'We believe food brings people together. Our mission is to create a warm, welcoming space where friends and families can enjoy authentic Ethiopian dishes made with fresh, locally sourced ingredients and recipes passed down through generations.',
  },
  chef: {
    title: 'Meet the Chef',
    name: 'Chef Amina Hassan',
    text: 'Chef Amina brings over 15 years of experience cooking traditional Ethiopian dishes. Born and raised in Addis Ababa, she combines time-honored techniques with modern creativity to deliver unforgettable flavors in every plate.',
  },
  cuisine: {
    title: 'Ethiopian Cuisine',
    text: 'Ethiopian food is known for its bold spices, vibrant colors, and communal dining style. Dishes are served on injera, a spongy flatbread that doubles as both plate and utensil. Meals are meant to be shared, making every dining experience a celebration.',
  },
};

function createBlock(data) {
  const div = document.createElement('div');
  div.classList.add('about-block');

  const title = document.createElement('h3');
  title.textContent = data.title;
  div.appendChild(title);

  if (data.name) {
    const name = document.createElement('p');
    name.classList.add('chef-name');
    name.textContent = data.name;
    div.appendChild(name);
  }

  const text = document.createElement('p');
  text.textContent = data.text;
  div.appendChild(text);

  return div;
}

export function loadAbout(container) {
  const section = document.createElement('section');
  section.classList.add('about');

  const heading = document.createElement('h2');
  heading.textContent = 'About Us';
  section.appendChild(heading);

  section.appendChild(createBlock(aboutData.story));
  section.appendChild(createBlock(aboutData.mission));
  section.appendChild(createBlock(aboutData.chef));
  section.appendChild(createBlock(aboutData.cuisine));

  container.appendChild(section);
}
