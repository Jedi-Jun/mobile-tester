const appMain = document.querySelector('.app-main');

/* 6) window.visualViewport & innerHeight */
const section6 = () => `
<div class='visual-wrapper'>
  <div class='visual-header'>
    header
  </div>
  <div class='visual-content'>
    <div class='visual-content-innerHeight'>
      innerHeight
      <div></div>
      </div>
      <div class='visual-content-visualViewport'>
      visualViewport
      <div></div>
    </div>
  </div>
  <input />
</div>
`;

// Get visualViewport & innerHeight by resize
window.addEventListener('resize', innerHeight);
window.visualViewport.addEventListener('resize', visualViewport);

function innerHeight() {
  const innerHeightElement = document.querySelector(
    '.visual-content-innerHeight'
  );
  if (!innerHeightElement) return;
  innerHeightElement.children[0].innerHTML = `
    <span>window.innerHeight: ${window.innerHeight}</span>
    <span>window.innerWidth: ${window.innerWidth}</span>
    `;
}

function visualViewport() {
  const visualViewportElement = document.querySelector(
    '.visual-content-visualViewport'
  );
  if (!visualViewportElement) return;
  const _ = value => {
    if (typeof value !== 'number' || Number.isInteger(value)) return value;
    return Number.parseFloat(value).toFixed(2);
  };
  visualViewportElement.children[0].innerHTML = `
      <span>height: ${_(window.visualViewport.height)}</span>
      <span>offsetLeft: ${_(window.visualViewport.offsetLeft)}</span>
      <span>offsetTop: ${_(window.visualViewport.offsetTop)}</span>
      <span>onresize: ${_(window.visualViewport.onresize)}</span>
      <span>onscroll: ${_(window.visualViewport.onscroll)}</span>
      <span>pageLeft: ${_(window.visualViewport.pageLeft)}</span>
      <span>pageTop: ${_(window.visualViewport.pageTop)}</span>
      <span>scale: ${_(window.visualViewport.scale)}</span>
      <span>width: ${_(window.visualViewport.width)}</span>
    `;
}

appMain.addEventListener('click', () => {
  const visualWrapper = document.querySelector('.visual-wrapper');
  if (visualWrapper) {
    innerHeight();
    visualViewport();
  }
});

export { section6 };
