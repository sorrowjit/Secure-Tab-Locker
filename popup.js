document.addEventListener('DOMContentLoaded', async () => {
  const tabsList = document.getElementById('tabsList');
  const updatePwdBtn = document.getElementById('updatePwd');
  const oldPwdInput = document.getElementById('oldPwd');
  const newPwdInput = document.getElementById('newPwd');
  const alertBox = document.getElementById('alertBox');

  let storedPwd = null;

  const storedPwdObj = await chrome.storage.local.get('tabLockerPwd');
  storedPwd = storedPwdObj.tabLockerPwd;

  const isPasswordSet = storedPwd && storedPwd.trim() !== "";

  if (!isPasswordSet) {
    alertBox.style.display = 'block';
  }

  updatePwdBtn.onclick = async () => {
    const oldPwd = oldPwdInput.value.trim();
    const newPwd = newPwdInput.value.trim();

    const currentPwd = (await chrome.storage.local.get('tabLockerPwd')).tabLockerPwd;

    if (currentPwd && oldPwd !== currentPwd) {
      alert('Current password incorrect.');
      return;
    }

    if (!currentPwd && oldPwd !== '') {
      alert('For first-time setup, leave "Current Password" empty.');
      return;
    }

    if (newPwd.length < 1) {
      alert('Enter valid new password.');
      return;
    }

    chrome.storage.local.set({ tabLockerPwd: newPwd }, () => {
      alert('Password updated successfully!');
      oldPwdInput.value = '';
      newPwdInput.value = '';
      alertBox.style.display = 'none';
    });
  };

  const { lockedTabs = [] } = await chrome.storage.local.get('lockedTabs');

  chrome.tabs.query({}, tabs => {
    tabsList.innerHTML = '';

    tabs.forEach(tab => {
      const isLocked = lockedTabs.includes(tab.id);
      const isRestricted = tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://");

      const div = document.createElement('div');
      div.className = 'tab-entry';

      const span = document.createElement('span');
      span.className = `tab-title ${isLocked ? 'locked' : ''}`;
      span.textContent = isLocked ? "Website Died!" : tab.title;

      div.appendChild(span);

      if (!isRestricted) {
        const switchWrapper = document.createElement('label');
        switchWrapper.className = 'switch';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isLocked;
        checkbox.disabled = isLocked;

        const slider = document.createElement('span');
        slider.className = 'slider';

        switchWrapper.appendChild(checkbox);
        switchWrapper.appendChild(slider);

        if (!isLocked) {
          checkbox.onchange = async () => {
            const pwdCheck = await chrome.storage.local.get('tabLockerPwd');
            const currentPwd = pwdCheck.tabLockerPwd;

            if (!currentPwd || currentPwd.trim() === '') {
              alertBox.style.display = 'block';
              checkbox.checked = false;
              return;
            }

            lockedTabs.push(tab.id);
            chrome.storage.local.set({ lockedTabs });
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content_script.js']
            });
            checkbox.disabled = true;
            span.textContent = "Nothing to see here!";
            span.classList.add('locked');
          };
        }

        div.appendChild(switchWrapper);
      }

      tabsList.appendChild(div);
    });
  });
});
