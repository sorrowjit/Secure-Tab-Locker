chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  
    if (msg.requestTabId) {
      sendResponse({ tabId: sender.tab.id });
    }
  
    if (msg.unlockTab && sender.tab) {
      chrome.storage.local.get('lockedTabs', ({ lockedTabs }) => {
        lockedTabs = lockedTabs.filter(id => id !== sender.tab.id);
        
        chrome.storage.local.set({ lockedTabs }, () => {
          chrome.tabs.sendMessage(sender.tab.id, { action: 'removeOverlay' });
        });
      });
    }
  });
  