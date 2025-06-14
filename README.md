# 🦊 Benji's Userscripts Collection

Welcome to my cozy den of browser enhancements! This repo hosts various userscripts crafted to improve your online experience with automation, redirection, and convenience in mind.

---

## 📜 Available Scripts

### 🔁 Redirect to Nitter

Automatically redirects any Twitter/X links to a functional [Nitter](https://nitter.net) instance for a cleaner, tracker-free experience.

**Features:**
- Redirects Twitter and X URLs before page load.
- Automatically selects a working Nitter instance.
- Requires no configuration — just install and go!

🔗 [**Install Script**](https://raw.githubusercontent.com/BenjiThatFoxGuy/userscripts/main/nitter-redirect/nitter-redirect.user.js)  
🧠 [**View Metadata**](https://raw.githubusercontent.com/BenjiThatFoxGuy/userscripts/main/nitter-redirect/nitter-redirect.meta.js)

---

### 🌐 VRCW.net ➜ VRCX Deeplink

Converts `wrld_` world IDs on [vrcw.net](https://vrcw.net) into clickable deep links for VRCX, allowing for seamless world exploration from your browser.

**Features:**
- Replaces text-based world IDs with clickable `vrcx://` links.
- Works with both static and dynamically loaded content.
- Clean and native-looking integration.

🔗 [**Install Script**](https://raw.githubusercontent.com/BenjiThatFoxGuy/userscripts/main/vrcw.net/vrcw.net.user.js)  
🧠 [**View Metadata**](https://raw.githubusercontent.com/BenjiThatFoxGuy/userscripts/main/vrcw.net/vrcw.net.meta.js)

---

### 🧲 Nexus Mods Auto-Click Slow Download

Saves you clicks and time by automatically pressing the **Slow Download** button on [Nexus Mods](https://www.nexusmods.com) download pages.

**Features:**
- Automatically clicks the slow download button after a short delay.
- No interaction needed.
- Useful for free users who want one-click downloads.

🔗 [**Install Script**](https://raw.githubusercontent.com/BenjiThatFoxGuy/userscripts/main/nexusmods.com/nexusmods.com.user.js)  
🧠 [**View Metadata**](https://updates.benjifox.gay/nexusmods.com.meta.js)  
🔄 **Note:** This script uses a custom update server with a fallback to a GitHub Gist URL in case the main server is unavailable.

---

### 🦦 e621 Deleted Post Restorer

Restores deleted e621/e926 posts by checking the same distributed archive network that powers [e621 Deleted Post Recovery Tool (e6DPRT)](https://e6dprt.benjifox.gay/). If a post is deleted but present in the archive, the script will display the image and provide a download button, bypassing e621/e926's restrictions.

**Features:**
- Detects deleted posts on e621 and e926.
- Retrieves post metadata and reconstructs the archive path.
- Embeds the image using a data URL to bypass CSP/CORS.
- Provides a download button for the recovered image.
- Powered by the same network as [e6DPRT](https://e6dprt.benjifox.gay/).

🔗 [**Install Script**](https://updates.benjifox.gay/e621.net.user.js)  
🧠 [**View Metadata**](https://updates.benjifox.gay/e621.net.meta.js)

---

## 🛠️ How to Use

1. Install a userscript manager:
   - 🦊 [Violentmonkey](https://violentmonkey.github.io/)
   - 🐵 [Tampermonkey](https://tampermonkey.net/)
   - 🐗 [Greasemonkey](https://www.greasespot.net/) (may have compatibility issues)

2. Click any **Install Script** link above.

3. Your browser will prompt you to confirm and install. That’s it!

---

## 🌍 Custom Update URLs

All userscripts in this repository use a custom update metadata URL hosted at **[updates.benjifox.gay](https://updates.benjifox.gay)** for reliable updates. If this server is unavailable, a fallback **GitHub Gist** mirror is used where applicable. This helps maintain functionality even during outages.

---

## 📂 Repository Structure

- **`nitter-redirect/`**: Scripts for redirecting Twitter links to Nitter.
- **`vrcw.net/`**: Scripts for converting VRCW world IDs to VRCX deeplinks.
- **`nexusmods.com/`**: Scripts for automating downloads on Nexus Mods.
- **`e621.net/`**: Scripts for restoring deleted e621/e926 posts.

---

## 🤝 Contributing

Contributions are welcome! If you have a script that you think would fit in well here, or improvements to existing scripts, feel free to fork the repo and submit a pull request.

---

## 📝 Changelog

### v1.0.0
- Initial release of userscripts collection.

### v1.1.0
- Added e621 Deleted Post Restorer script.
- Improved installation instructions.

### v1.2.0
- Updated metadata and installation links.
- Fixed minor bugs in scripts.

---

## 📧 Contact
For questions, suggestions, or to get in touch, please visit my [website](https://benjifox.gay) for up-to-date contact information, including my email address.

