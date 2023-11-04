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

/* 5) IP address */
HTMLTemplate.section5 = () => `
<ol class='vis-wrapper'>
 <div class='vis-bottom'></div>
</ol>
`;

window.addEventListener('load', () => {
  // (1) Set 100vh for Mobile Browser's height
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // (2) Initial load `Home` template with Geo values
  appMain.innerHTML = HTMLTemplate.section1();
  getGeoLocation();

  // (3) Tab detection
  const addLog = text => {
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
      // div.append(span);
      // div.append(hr);
      vis_wrapper.insertBefore(div, vis_bottom);
    }

    const li = document.createElement('li');
    li.innerText = text;
    vis_wrapper.insertBefore(li, vis_bottom);
    vis_bottom.scrollIntoView(false);
  };
  window.addEventListener('visibilitychange', () =>
    addLog(`visibilitychange: ${document.visibilityState}`)
  );
  window.addEventListener('focus', () => addLog('Focus: user came in.'));
  window.addEventListener('blur', () => addLog('Blur: user went out.'));
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

function handleSelectedEffect(ele) {
  navButtons.forEach(btn => (btn.style.textShadow = 'none'));
  ele.style.textShadow = '1px 0px 0px black';
}
