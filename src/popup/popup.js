const inputs = document.querySelectorAll('input[data-setting]');
const features = document.getElementById('features');

const render = (settings) => {
  for (const input of inputs) input.checked = settings[input.dataset.setting];
  features.disabled = !settings.enabled;
};

for (const input of inputs) {
  input.addEventListener('change', () => {
    Sod.settings.set({ [input.dataset.setting]: input.checked });
  });
}

Sod.settings.get().then(render);
Sod.settings.onChange(render);
