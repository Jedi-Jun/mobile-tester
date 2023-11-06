/* 3) Navigator */
const section3 = () => `
<ol class='navigator-wrapper'>
  ${createList()}
</ol>
`;

const createList = () => {
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
};

export { section3 };
