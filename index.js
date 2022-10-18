const settingKey = 'espcam-viewer';
const serverKey = settingKey + '-server';

let server;

const statusEl = document.querySelector('.status');
const infoEl = document.querySelector('#info');
const regionsEl = document.querySelector('.regions');

const playButton = document.querySelector('#play');
const pauseButton = document.querySelector('#pause');

window.addEventListener('load', async () => {
  server = localStorage.getItem(serverKey);

  const serverButton = document.querySelector('#server');
  serverButton.addEventListener('click', updateServer);

  playButton.addEventListener('click', play);
  pauseButton.addEventListener('click', pause);

  if (!server) {
    setStatus('Error: Server has not been set up yet.');
  } else {
    await updateSettings();
    setInterval(updateImage, 60 * 1000);
  }
});

async function updateSettings() {
  setStatus('Loading...');

  const settings = [
    { var: 'led_intensity', val: 255 },
    { var: 'framesize', val: 10 },
  ];

  try {
    const current = await fetch(`${server}/status`);

    // update server settings
    for (const s of settings) {
      if (current[s.var] !== s.val) await fetch(`${server}/control?var=${s.var}&val=${s.val}`);
    }

    setStatus();
    play();
  } catch (err) {
    setStatus('Error connecting to server');
  }
}

function play() {
  const regions = regionsEl.querySelectorAll('.region');
  regions.forEach((r) => r.setAttribute('src', `${server}:81/stream`));

  playButton.style.display = 'none';
  pauseButton.style.display = 'flex';
}

function pause() {
  const regions = regionsEl.querySelectorAll('.region');
  regions.forEach((r) => r.setAttribute('src', undefined));

  playButton.style.display = 'flex';
  pauseButton.style.display = 'none';
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

function setStatus(value) {
  if (value) {
    statusEl.style.display = 'flex';
    infoEl.innerText = value;

    regionsEl.style.display = 'none';
  } else {
    statusEl.style.display = 'none';
    infoEl.innerText = '';

    regionsEl.style.display = 'flex';
  }
}
