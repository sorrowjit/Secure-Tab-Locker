(async () => {
  const overlayId = 'secure-tab-locker-overlay';
  let originalTitle = document.title;
  let originalFaviconHref = null;

  function createOverlay() {
    if (document.getElementById(overlayId)) return;

    // Store original favicon
    const faviconEl = document.querySelector("link[rel~='icon']");
    if (faviconEl) {
      originalFaviconHref = faviconEl.href;
    }

    // Remove and replace with blank favicon
    const removeFavicon = () => {
      const links = document.querySelectorAll("link[rel~='icon']");
      links.forEach(link => link.parentNode.removeChild(link));
      const blankFavicon = document.createElement('link');
      blankFavicon.rel = 'icon';
      blankFavicon.href = 'data:,';
      document.head.appendChild(blankFavicon);
    };
    removeFavicon();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = overlayId;
    Object.assign(overlay.style, {
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: '#000', zIndex: 2147483647, display: 'flex', alignItems: 'center', justifyContent: 'center'
    });

    const input = document.createElement('input');

    input.type = 'text';
    input.setAttribute('inputmode', 'none');
    input.setAttribute('data-password-field', 'true');
    input.style.webkitTextSecurity = 'disc';

    input.placeholder = 'Enter Password to Unlock';
    Object.assign(input.style, {
      padding: '12px',
      fontSize: '14px',
      borderRadius: '4px'
    });

    // Suppress autocomplete, spelling, autofill
    try {
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('autocapitalize', 'off');
      input.setAttribute('spellcheck', 'false');
    } catch (e) {
      console.warn('Input attributes could not be set. Context may have been invalidated.');
    }


    input.onkeydown = async e => {
      if (e.key === 'Enter') {
        const userPwd = input.value;
        const { tabLockerPwd } = await chrome.storage.local.get('tabLockerPwd');
        if (userPwd === tabLockerPwd) {
          chrome.runtime.sendMessage({ unlockTab: true });
        } else {
          alert('Incorrect Password!');
          input.value = '';
        }
      }
    };

    overlay.appendChild(input);
    document.documentElement.appendChild(overlay);
    document.title = 'Locked';

    // Prevent refresh and navigation
    window.onbeforeunload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href);
    };
  }

  function restoreFaviconAndOverlay() {
    const overlay = document.getElementById(overlayId);
    if (overlay) overlay.remove();

    document.title = originalTitle;
    window.onbeforeunload = null;
    window.onpopstate = null;

    if (originalFaviconHref) {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = originalFaviconHref;

      // Remove blank one if exists
      const icons = document.querySelectorAll("link[rel~='icon']");
      icons.forEach(link => link.parentNode.removeChild(link));

      document.head.appendChild(newFavicon);
    }
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'removeOverlay') {
      restoreFaviconAndOverlay();
    }
  });

  chrome.runtime.sendMessage({ requestTabId: true }, async response => {
    const tabId = response.tabId;
    const { lockedTabs = [] } = await chrome.storage.local.get('lockedTabs');
    if (lockedTabs.includes(tabId)) createOverlay();
  });
})();
