// Set channel indicator to current date and channel number
function setChannelIndicator() {
  const elem = document.getElementById('channelIndicator');
  if (!elem) return;
  const now = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const month = months[now.getMonth()];
  const day = now.getDate();
  const year = now.getFullYear();
  elem.textContent = `${month} ${day} ${year}  Channel 01`;
}

// Apply a subtle glitch flicker on selected text elements
function applyGlitchFlicker() {
  const elements = document.querySelectorAll('.section-title, .glitch, .project-item h3');
  elements.forEach(el => {
    // create small random shifts for colored shadows
    const rx = (Math.random() - 0.5) * 2;
    const ry = (Math.random() - 0.5) * 2;
    const shadow1 = `${1 + rx}px ${0 + ry}px 0 #00ffff`;
    const shadow2 = `${-1 + rx}px ${0 - ry}px 0 #ff0080`;
    el.style.textShadow = `${shadow1}, ${shadow2}`;
  });
}

// Reveal sections on scroll using IntersectionObserver
function initSectionObserver() {
  const sections = document.querySelectorAll('.content-section');
  const options = {
    threshold: 0.1
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);
  sections.forEach(section => observer.observe(section));
}

document.addEventListener('DOMContentLoaded', () => {
  setChannelIndicator();
  initSectionObserver();
  // glitch flicker interval
  setInterval(applyGlitchFlicker, 1200);
});