// Keyboard labels for Academic Pages' existing navigation and theme controls.
document.addEventListener('DOMContentLoaded', () => {
  const themeControl = document.querySelector('#theme-toggle a');
  themeControl?.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      themeControl.click();
    }
  });
  const menu = document.querySelector('#site-nav > button');
  const overflow = document.querySelector('#overflow-navigation');
  if (menu && overflow) {
    const sync = () => menu.setAttribute('aria-expanded', String(!overflow.classList.contains('hidden')));
    new MutationObserver(sync).observe(overflow, {attributes: true, attributeFilter: ['class']});
    sync();
  }
});
