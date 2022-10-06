const settingKey = 'espcam-viewer';
const serverKey = settingKey + '-server';

let server;

window.addEventListener('load', async () => {
  server = localStorage.getItem(serverKey);

  const serverButton = document.querySelector('#server');
  serverButton.addEventListener('click', updateServer);

  const settingsButton = document.querySelector('#settings');
  settingsButton.addEventListener('click', updateSettings);

  const missingServer = document.querySelector('.missingServer');
  const loading = document.querySelector('.loading');
  const regions = document.querySelector('.regions');

  if (!server) {
    missingServer.style.display = 'flex';
  } else {
    loading.style.display = 'flex';

    loading.style.display = 'none';
    regions.style.display = 'flex';

    await updateSettings();
    setIntervalImmediately(updateImage, 60 * 1000);
  }
});

function updateImage() {
  const img = new Image();
  img.src = `${server}/capture?_cb=${Date.now()}`;

  img.onload = () => {
    const regions = document.querySelector('.regions');
    regions.innerHTML = '';

    regions.appendChild(img);
    regions.appendChild(img.cloneNode());
  };
}

async function updateSettings() {
  const settingsIcon = document.querySelector('#settings svg');
  const spinner = document.querySelector('#settings .lds-ring');

  settingsIcon.style.display = 'none';
  spinner.style.display = 'inline-block';

  const current = await fetch(`${server}/status`);

  // update server settings
  const settings = [
    { var: 'led_intensity', val: 255 },
    { var: 'framesize', val: 13 },
  ];
  for (const s of settings) {
    if (current[s.var] !== s.val) await fetch(`${server}/control?var=${s.var}&val=${s.val}`);
  }

  settingsIcon.style.display = 'inline-block';
  spinner.style.display = 'none';

  updateImage();
}

function updateServer() {
  const value = prompt('Enter Server Addreess');

  if (value && value.length > 0) localStorage.setItem(serverKey, value);
  else localStorage.removeItem(serverKey);

  window.location.reload();
}

function setIntervalImmediately(func, timeout) {
  func();
  return setInterval(func, timeout);
}
