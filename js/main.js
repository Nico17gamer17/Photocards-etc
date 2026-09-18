const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function initStars() {
  const field = $('.starfield');
  for (let index = 0; index < 34; index += 1) {
    const star = document.createElement('i');
    star.style.left = (Math.random() * 100) + '%';
    star.style.top = (Math.random() * 100) + '%';
    star.style.setProperty('--delay', (Math.random() * 4).toFixed(2) + 's');
    star.style.setProperty('--size', (Math.random() > 0.85 ? 3 : 1.5) + 'px');
    field.append(star);
  }
}

function renderStory() {
  const timeline = $('#timeline');
  const card = $('#story-card');
  const showStoryItem = (index) => {
    const item = ERA_DATA.story[index];
    const image = item.img ? '<img src="' + item.img + '" alt="' + item.title + '">' : '<span>OPTIONAL PHOTO<br>PLACEHOLDER</span>';
    card.innerHTML = '<div class="story-card-image ' + (item.img ? '' : 'empty') + '">' + image + '</div>' +
      '<div class="story-card-copy"><p class="mono">' + item.date + '</p><h3>' + item.title + '</h3><p>' + item.text + '</p></div>';
    $$('.timeline-button').forEach((button, buttonIndex) => button.classList.toggle('active', buttonIndex === index));
  };
  ERA_DATA.story.forEach((item, index) => {
    const button = document.createElement('button');
    button.className = 'timeline-button';
    button.type = 'button';
    button.innerHTML = '<span>0' + (index + 1) + '</span>' + item.label + '<b>-&gt;</b>';
    button.addEventListener('click', () => showStoryItem(index));
    timeline.append(button);
  });
  showStoryItem(0);
}

function openLightbox(item) {
  const box = $('#lightbox');
  const image = $('#lightbox-image');
  image.src = item.img;
  image.alt = 'Memory ' + item.id;
  image.classList.remove('unavailable');
  image.onerror = () => image.classList.add('unavailable');
  $('#lightbox-caption').innerHTML = '<span>MEMORY ' + item.id + '</span> ' + item.date + '<p>&ldquo;' + item.text + '&rdquo;</p>';
  box.classList.add('visible');
  document.body.classList.add('no-scroll');
}

function closeLightbox() {
  $('#lightbox').classList.remove('visible');
  document.body.classList.remove('no-scroll');
}

function renderMemories() {
  const grid = $('#memory-grid');
  ERA_DATA.memories.forEach((item, index) => {
    const figure = document.createElement('figure');
    figure.className = 'memory memory-' + (index + 1);
    figure.tabIndex = 0;
    figure.innerHTML = '<div class="photo-frame"><img src="' + item.img + '" alt="Memory ' + item.id + '"' +
      ' onerror="this.parentElement.classList.add(\'missing\'); this.remove()"><span class="photo-placeholder">YOUR PHOTO<br>GOES HERE</span></div>' +
      '<figcaption><span>MEMORY ' + item.id + '</span><time>' + item.date + '</time><p>&ldquo;' + item.text + '&rdquo;</p></figcaption>';
    const open = () => openLightbox(item);
    figure.addEventListener('click', open);
    figure.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
    });
    grid.append(figure);
  });
}

function renderLoveThings() {
  ERA_DATA.loveThings.forEach((item, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'love-card';
    card.innerHTML = '<span class="love-number">0' + (index + 1) + '</span><span class="love-title">' + item.title + '</span>' +
      '<span class="love-plus">+</span><span class="love-text">' + item.text + '</span>';
    card.addEventListener('click', () => card.classList.toggle('open'));
    $('#love-grid').append(card);
  });
}

function renderPhotocards() {
  const grid = $('#photocard-grid');
  ERA_DATA.photocards.forEach((item) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'photocard-shell tone-' + item.tone;
    card.setAttribute('aria-label', 'Photocard ' + item.number + ': ' + item.title + '. Tap to turn.');
    card.innerHTML = '<span class="photocard-inner"><span class="photocard-face photocard-front">' +
      '<span class="photocard-image"><img src="' + item.image + '" alt="" onerror="this.parentElement.classList.add(\'missing\'); this.remove()"><span> <br> </span></span>' +
      '<span class="photocard-title">' + item.title + '</span><span class="photocard-subtitle">' + item.subtitle + '</span><span class="photocard-number">' + item.number + ' / 06</span>' +
      '</span><span class="photocard-face photocard-back"><strong>ERA 03</strong><span>17 / 09 / 26</span><small>' + item.note + '</small><b>' + item.number + ' / 06</b></span></span>';
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    grid.append(card);
  });
}

function initInteractions() {
  const secretPrompt = document.createElement('div');
  secretPrompt.className = 'secret-prompt';
  secretPrompt.textContent = ERA_DATA.secret.prompt;
  $('.secret-reveal').before(secretPrompt);
  $('#btn-enter').addEventListener('click', () => $('#story').scrollIntoView({ behavior: 'smooth' }));
  $('#open-letter').addEventListener('click', (event) => {
    $('#letter').classList.toggle('opened');
    event.currentTarget.textContent = $('#letter').classList.contains('opened') ? 'CLOSE LETTER' : 'OPEN LETTER ->';
  });
  $('#discover').addEventListener('click', (event) => {
    $('#secret').classList.add('discovered');
    event.currentTarget.disabled = true;
  });
  $('#lightbox-close').addEventListener('click', closeLightbox);
  $('#lightbox').addEventListener('click', (event) => { if (event.target.id === 'lightbox') closeLightbox(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });
}

function init() {
  initStars();
  renderStory();
  renderMemories();
  renderPhotocards();
  renderLoveThings();
  $('#bbokari-text').textContent = ERA_DATA.bbokari.text;
  $('#letter-body').innerHTML = ERA_DATA.letter.paragraphs.map((paragraph) => '<p>' + paragraph + '</p>').join('') +
    '<p class="letter-signoff">- ' + ERA_DATA.letter.signoff + '</p>';
  $('#secret-message').textContent = ERA_DATA.secret.message;
  $('.secret-reveal span').textContent = 'three months / 17 / 09 / 26';
  $('#final-message').textContent = ERA_DATA.final.message;
  $('#physical-note').textContent = ERA_DATA.physicalNote;
  initInteractions();
}

document.addEventListener('DOMContentLoaded', init);
