const appMain = document.querySelector('.app-main');
const navButtons = document.querySelectorAll('.nav');

let abortController = null;
const HTMLTemplate = {};

/* 1) Home */
HTMLTemplate.section1 = () => `
<h1><a href="https://ipinfo.io">Dongrim</a></h1>
<table class="geo-wrapper">
  <tr>
    <th>Lat:</th>
    <td class="geo geo-lat" data-id="lat"></td>
  </tr>
  <tr>
    <th>Long:</th>
    <td class="geo get-long" data-id="long"></td>
  </tr>
</table>
`;

/* 2) Pointer */
HTMLTemplate.section2 = () => `
<div class="app-section2">
  <div class="app-header">
    <div class="item wrapper-title"></div>
  </div>
  <div class="app-content">
    <div class="item wrapper-pointer">
      <span> pointer: </span>
    </div>
    <div class="item wrapper-hover">
      <span> hover: </span>
    </div>
    <div class="item wrapper-any-pointer">
      <span> any-pointer: </span>
    </div>
    <div class="item wrapper-any-hover">
      <span> any-hover: </span>
    </div>
  </div>
</div>`;

/* 3) Navigator */
HTMLTemplate.section3 = () => `
<ol class='navigator-wrapper'>
  ${createHTMLForSection2()}
</ol>
`;

/* 4) IP address */
HTMLTemplate.section4 = (data = null) => {
  if (!data) {
    getIpInfo();
    return `<div>Loading...</div>`;
  } else {
    return `<ol class='navigator-wrapper'>${data}</ol>`;
  }
};

/* 5) IP visibilitychange + focus + blur */
HTMLTemplate.section5 = () => `
<ol class='vis-wrapper'>
  <p>=== Start to tab! ===</p>
  <div class='vis-bottom'></div>
</ol>
`;

/* 6) window.visualViewport & innerHeight */
HTMLTemplate.section6 = () => `
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

/* 7) Push Notification */
HTMLTemplate.section7 = () => `
<div>
  Hello, Push Notification!
</div>
`;

/* Main */
window.addEventListener('load', () => {
  // (1) Set 100vh for Mobile Browser's height
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // (2) Initial load `Home` template with Geo values
  appMain.innerHTML = HTMLTemplate.section1();
  getGeoLocation();

  // (3) Browser visibility detection
  handleSection5();

  // (4) Get visualViewport & innerHeight by resize
  handleSection6();
});

navButtons.forEach(btn => {
  btn.addEventListener('click', async () => {
    handleSelectedEffect(btn);
    const section = btn.dataset.id;
    appMain.innerHTML = await HTMLTemplate[section]();
    if (section === 'section1') getGeoLocation();
    if (section !== 'section4') abortController?.abort();
  });
});

function createHTMLForSection2() {
  const targetAttributes = [
    'appCodeName',
    'appName',
    'appVersion',
    'userAgent',
    'language',
    'vendor',
    'vendorSub',
  ];
  let HTMLString = '';
  targetAttributes.forEach(attribute => {
    HTMLString += `<li>${attribute}: ${navigator[attribute]}</li>`;
  });
  return HTMLString;
}

async function getIpInfo() {
  const URL = 'https://test.dongrim.site/api/v1/ip';
  abortController = new AbortController();
  const signal = abortController.signal;

  fetch(URL, { signal })
    .then(res => res.json())
    .then(data => {
      const result = createHTMLForSection3(data);
      appMain.innerHTML = HTMLTemplate.section4(result);
    }); // .catch(err => console.log(err));
}

function createHTMLForSection3(data) {
  if (!data) return null;

  let HTMLString = '';
  for (const key in data) {
    HTMLString += `<li>${key}: ${data[key]}</li>`;
  }
  return HTMLString;
}

function getGeoLocation() {
  const coords = document.querySelectorAll('.geo');
  const onSuccess = pos => {
    const geo = {
      lat: pos.coords.latitude,
      long: pos.coords.longitude,
    };
    coords.forEach(ele => {
      ele.innerText = geo[ele.dataset.id];
    });
  };

  const onError = err => {
    console.error(err);
  };

  navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function handleSection5() {
  const queue = [
    {
      eventName: 'visibilitychange',
      logMessage: `visibilitychange: ${document.visibilityState}`,
    },
    { eventName: 'focus', logMessage: 'Focus: user came in.' },
    { eventName: 'blur', logMessage: 'Blur: user went out.' },
  ];

  queue.forEach(data => {
    window.addEventListener(data.eventName, () => addLog(data.logMessage));
  });

  function addLog(text) {
    const vis_wrapper = document.querySelector('.vis-wrapper');
    const vis_bottom = document.querySelector('.vis-bottom');
    if (!vis_wrapper) return;
    if (document.hidden) {
      const div = document.createElement('div');
      div.classList.add('vis-time-wrapper');
      const hr1 = document.createElement('hr');
      const hr2 = document.createElement('hr');
      const span = document.createElement('span');
      span.classList.add('vis-time');
      const options = {
        timeZone: 'Asia/Seoul',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      const time = new Intl.DateTimeFormat('en-US', options).format();
      span.innerText = time;
      div.append(hr1, span, hr2);
      vis_wrapper.insertBefore(div, vis_bottom);
    }

    const li = document.createElement('li');
    li.innerText = text;
    vis_wrapper.insertBefore(li, vis_bottom);
    vis_bottom.scrollIntoView(false);
  }
}

function handleSection6() {
  window.addEventListener('resize', handleGetHeight1);
  window.visualViewport.addEventListener('resize', handleGetHeight2);

  appMain.addEventListener('click', () => {
    const visualWrapper = document.querySelector('.visual-wrapper');
    if (visualWrapper) {
      handleGetHeight1();
      handleGetHeight2();
    }
  });

  function handleGetHeight1() {
    const innerHeightElement = document.querySelector(
      '.visual-content-innerHeight'
    );
    innerHeightElement.children[0].innerHTML = `
      <span>window.innerHeight: ${window.innerHeight}</span>
      <span>window.innerWidth: ${window.innerWidth}</span>
    `;
  }

  function handleGetHeight2() {
    const visualViewportElement = document.querySelector(
      '.visual-content-visualViewport'
    );
    visualViewportElement.children[0].innerHTML = `
      <span>height: ${window.visualViewport.height}</span>
      <span>offsetLeft: ${window.visualViewport.offsetLeft}</span>
      <span>offsetTop: ${window.visualViewport.offsetTop}</span>
      <span>onresize: ${window.visualViewport.onresize}</span>
      <span>onscroll: ${window.visualViewport.onscroll}</span>
      <span>pageLeft: ${window.visualViewport.pageLeft}</span>
      <span>pageTop: ${window.visualViewport.pageTop}</span>
      <span>scale: ${window.visualViewport.scale}</span>
      <span>width: ${window.visualViewport.width}</span>
    `;
  }
}

function handleSelectedEffect(ele) {
  navButtons.forEach(btn => (btn.style.textShadow = 'none'));
  ele.style.textShadow = '1px 0px 0px black';
}
