/* 7) Push Notification */
const section7 = () => {
  const onClick = () => {
    Notification.requestPermission().then(perm => {
      const options = {
        body: `New message arrived! [${new Date().getMilliseconds()}]`,
        data: { title: 'chatApp' },
        icon: 'nasa.svg',
        tag: 'dm',
      };
      const notification = new Notification('Cocoa Talk', options);

      if (perm === 'granted') {
        console.log(perm);
        console.log(notification);
        notification.addEventListener('click', e => console.log(e));
      } else if (perm === 'denied') {
        console.log(perm);
        notification.addEventListener('error', e => console.log(e));
      } else {
        // 'default'
        console.log(perm);
      }
    });
  };
  setTimeout(() => {
    const notiButton = document.querySelector('#noti-button-js');
    notiButton.addEventListener('click', onClick);
  }, 100);
  return `
    <div>
      Hello, Push Notification!
      <button id="noti-button-js">Click</button>
    </div>
    `;
};

export { section7 };
