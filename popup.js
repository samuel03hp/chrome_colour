const onOffToggle = document.getElementById('on-off-toggle');
const slider = onOffToggle.nextElementSibling;

chrome.storage.local.get({ isEnabled: true }, ({ isEnabled }) => {
  slider.classList.add('no-anim');
  onOffToggle.checked = isEnabled;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => slider.classList.remove('no-anim'));
  });
});

onOffToggle.addEventListener('change', isEnabled => {
  chrome.storage.local.set({ isEnabled: isEnabled.target.checked });
});


const colorPicker = document.getElementById('color');
const alphaValue = document.getElementById('alphaValue');
const alphaText = document.getElementById('alphaText');
const colorString = document.getElementById('colorString');
const warmButton = document.getElementById('warmButton');
const coolButton = document.getElementById('coolButton');
const readButton = document.getElementById('readButton');
const mintButton = document.getElementById('mintButton');


function hexToRGBA(hex, a = 1) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  const rgb = 'rgba(' + r.toString() + ', ' + g.toString() + ', ' + b.toString() + ', ' + a.toString() + ')';
  return rgb;
}


function hexToHSL(hex) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const delta = max - min;
  const L = (max + min) / 2;
  const S = (delta == 0) ? 0 : (delta) / (1 - Math.abs(2 * L - 1));
  var H = 0;
  if (delta != 0) {
    if (max == R) {
      H = 60 * (((G - B) / delta) % 6);
    }
    else if (max == G) {
      H = 60 * ((B - R) / delta + 2);
    }
    else {
      H = 60 * ((R - G) / delta + 4);
    }
    if (H < 0) {
      H += 360;
    }
  }
  H = H % 360;
  return { H: H, S: S, L: L };
}

function clamp(x) {
  return Math.max(0, Math.min(1, x));
}

function findHSL2(H, S, L) {
  const H2 = (H + 30) % 360;
  var S2 = clamp(S * 0.9);
  if (S2 < 0.08) {
    S2 = 0.12;
  }
  const L2 = clamp(L + (L < 0.55 ? +0.15 : -0.15));
  return { H2: H2, S2: S2, L2: L2 };
}

function HSLToCss({ H2, S2, L2 }, a = 1) {
  return "hsl(" + (Math.round(H2)).toString() + " " + (Math.round(S2 * 100)).toString() + "% " + (Math.round(L2 * 100)).toString() + "% / " + a.toString() + ")";
}


chrome.storage.local.get('overlayColor', ({ overlayColor }) => {
  if (overlayColor) {
    colorPicker.value = overlayColor;
    document.documentElement.style.setProperty('--thumb-color', overlayColor);
    const HSL1 = hexToHSL(overlayColor);
    const HSL2 = findHSL2(HSL1.H, HSL1.S, HSL1.L);
    const color2 = HSLToCss(HSL2, 0.1);
    document.documentElement.style.setProperty('--gradient-color1', overlayColor);
    document.documentElement.style.setProperty('--gradient-color2', color2);
    colorString.textContent = overlayColor.toString();
  }
  else {
    chrome.storage.local.set({
      overlayColor: "#26A69A",
    });
    colorPicker.value = "#26A69A";
  }

}
);

chrome.storage.local.get('opacity', ({ opacity }) => {
  if (opacity) {
    const opacityRounded = Math.round(opacity * 100) / 100;
    alphaValue.value = opacityRounded;
    alphaText.textContent = (Math.round(opacity * 100)).toString() + '%';
  }
  else {
    chrome.storage.local.set({
      opacity: 0.1
    });
  }
}
);

alphaValue.addEventListener('input', opacity => {
  const opacityRounded = Math.round(opacity.target.value * 100) / 100;
  chrome.storage.local.set({
    opacity: opacityRounded
  });
  alphaText.textContent = (Math.round(opacity.target.value * 100)).toString() + '%';
}
);


colorPicker.addEventListener('input', color =>
  chrome.storage.local.set({
    overlayColor: color.target.value,
  }));


chrome.storage.onChanged.addListener((color, storageType) => {
  if (storageType === 'local' && color.overlayColor) {
    const rgba = hexToRGBA(color.overlayColor.newValue);
    document.documentElement.style.setProperty('--thumb-color', rgba);
    const HSL1 = hexToHSL(color.overlayColor.newValue);
    const HSL2 = findHSL2(HSL1.H, HSL1.S, HSL1.L);
    const color2 = HSLToCss(HSL2, 0.1);
    document.documentElement.style.setProperty('--gradient-color1', color.overlayColor.newValue);
    document.documentElement.style.setProperty('--gradient-color2', color2);
    colorString.textContent = color.overlayColor.newValue.toString();
  }
}
);

chrome.storage.onChanged.addListener((color, storageType) => {
  if (storageType === 'local' && color.opacity) {
    const opacityRounded = Math.round(color.opacity.newValue * 100) / 100
    alphaText.textContent = (Math.round(color.opacity.newValue * 100)).toString() + '%';
    alphaValue.value = opacityRounded;
  }
}
);


warmButton.addEventListener('click', () => {
  chrome.storage.local.set({
    overlayColor: "#FFC107",
    opacity: 0.1
  });
  colorPicker.value = "#FFC107";
});

coolButton.addEventListener('click', () => {
  chrome.storage.local.set({
    overlayColor: "#42A5F5",
    opacity: 0.1
  });
  colorPicker.value = "#42A5F5";
});

readButton.addEventListener('click', () => {
  chrome.storage.local.set({
    overlayColor: "#A98256",
    opacity: 0.1
  });
  colorPicker.value = "#A98256";
});

mintButton.addEventListener('click', () => {
  chrome.storage.local.set({
    overlayColor: "#66BB6A",
    opacity: 0.1
  });
  colorPicker.value = "#66BB6A";
});

