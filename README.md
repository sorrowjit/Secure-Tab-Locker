🔒 Secure Tab Locker – A Chrome Extension

A lightweight Chrome extension to instantly **lock any browser tab behind a password** — no tab closing, no browser minimizing, no awkward screen hiding.

🚀 What It Does

- **Lock any tab** with a single click via a toggle UI
- **Tab gets blacked out** and the title + favicon are masked
- **Refresh, back, and forward actions are blocked** while locked
- **Unlock with your set password** to restore full visibility
- Prevents Google password manager from popping up
- Chrome system-level tabs (like `chrome://settings`) are auto-excluded

> 🧠 Perfect for developers, product managers, and multi-tab warriors who want **quick privacy without breaking flow**.


🔧 Features

| One-click tab locking                        | ✅      |
| Password-based unlocking                     | ✅      |
| Overlay with masked content                  | ✅      |
| Prevent refresh, back, and forward actions   | ✅      |
| Tab title + favicon masking                  | ✅      |
| Chrome password manager suppressed           | ✅      |
| System tabs excluded (`chrome://`, etc.)     | ✅      |
| Password change requires old password        | ✅      |
| Clean, modern toggle-based UI                | ✅      |

📸 Demo Preview

    🎥 URL : https://shorturl.at/RXtPQ
    


💡 How to Use

1. Click the 🔒 Secure Tab Locker icon in the toolbar.
2. Set your password in the popup (required before locking).
3. Toggle ON any tab you want to lock.

    The tab will:

    a. Black out completely
    b. Change the title to “Locked”
    c. Remove its favicon
    d. Disable refresh/back/forward actions

4. To unlock the tab, enter the password directly on the tab. The tab will automatically restore when the correct password is entered.

⚠️ Limitations

This extension is a quick privacy curtain, not military-grade security.
Tab content is hidden, but the URL remains visible (due to Chrome's security sandbox).
Locked tabs return to normal if the extension is removed or Chrome is restarted.

🧠 Design Decisions

Used webkitTextSecurity + type="text" to avoid Chrome “Save Password” popups
Wrapped content script logic in DOMContentLoaded and try/catch for SPA safety
System tabs (chrome://, chrome-extension://) are automatically excluded
UI uses modern toggle switches for clean interaction
