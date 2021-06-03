const container = document.querySelector('.container');
const slides = document.querySelectorAll('.slider');

let isDragging = false;
let startPosition = 0;
let currentTranslate = 0;
let previousTranslate = 0;
let animationID = 0;
let currentIndex = 0;

const getPositionX = (event) => {
  const position = event.type.includes('mouse')
    ? event.pageX
    : event.touches[0].clientX;
  return position;
};

const setContainerPosition = () => {
  container.style.transform = `translateX(${currentTranslate}px)`;
};

const animation = () => {
  setContainerPosition();
  if (isDragging) requestAnimationFrame(animation);
};

const setPositionByIndex = () => {
  currentTranslate = currentIndex * -window.innerWidth;
  previousTranslate = currentTranslate;
  setContainerPosition();
};

const startSlide = (event, index) => {
  currentIndex = index;
  startPosition = getPositionX(event);
  isDragging = true;
  animationID = requestAnimationFrame(animation);
  container.classList.add('grabbing');
};

const endSlide = () => {
  isDragging = false;
  cancelAnimationFrame(animationID);

  const movedBy = currentTranslate - previousTranslate;

  if (movedBy < -100 && currentIndex < slides.length - 1) {
    currentIndex += 1;
  }

  if (movedBy > 100 && currentIndex > 0) {
    currentIndex -= 1;
  }

  setPositionByIndex();
  container.classList.remove('grabbing');
};

const moveSlide = (event) => {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = previousTranslate + currentPosition - startPosition;
  }
};

for (const [index, slide] of slides.entries()) {
  const slideImage = slide.querySelector('img');
  slideImage.addEventListener('dragstart', (event) => {
    event.preventDefault();
  });

  slide.addEventListener('touchstart', (event) => {
    startSlide(event, index);
  });
  slide.addEventListener('mousedown', (event) => {
    startSlide(event, index);
  });

  slide.addEventListener('touchend', endSlide);
  slide.addEventListener('mouseup', endSlide);
  slide.addEventListener('mouseleave', endSlide);

  slide.addEventListener('touchmove', moveSlide);
  slide.addEventListener('mousemove', moveSlide);
}

window.oncontextmenu = (event) => {
  event.preventDefault();
  event.stopPropagation();
  return false;
};
