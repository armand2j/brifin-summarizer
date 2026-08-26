const buttonContainerSelector = '#avWBGd-37 > div.adn.ads > div.gs > div.gE.iv.gt > table > tbody > tr:nth-child(1) > td.gH.acX.bAm.VN9Psd';

// console.log('hello content script world!');
// console.log('URL: ', location.href);

function waitForElement(selector) {
	return new Promise((res) => {
		if (document.querySelector(selector)) {
			res(document.querySelector(selector));
			return;
		}
		let observer = new MutationObserver((mutations) => {
			if (document.querySelector(selector)) {
				observer.disconnect();
				res(document.querySelector(selector));
				return;
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
}

// let pageAlreadyLoaded = false;
chrome.runtime.onMessage.addListener((request, sender) => {
	// if (pageAlreadyLoaded) {
	// 	return;
	// }
	if (request.action === 'pageLoaded') {
		// pageAlreadyLoaded = true;
		console.log('page loaded.');
		const urlParts = location.hash.split('/');

		if (urlParts.length <= 1) {
			console.log("This isn't an email...");
			return;
		}
		const emailId = urlParts.at(-1).toLowerCase();
		const characterAmount = 32;
		if (emailId.length === characterAmount) {
			console.log("You're viewing an email!");
			const summarizeBtnId = 'summarize-btn';
			const summarizeBtnContainerSelector = `td:has(> h3 span[email="elbrifin@elbrifin.com"])`;
			waitForElement(summarizeBtnContainerSelector).then((container) => {
				if (document.querySelector('#' + summarizeBtnId)) return;
				const summarizeBtn = document.createElement('button');
				summarizeBtn.textContent = 'Summarize';
				summarizeBtn.id = summarizeBtnId;
				summarizeBtn.style = style();
				container.appendChild(summarizeBtn);
			});
		}
	}
});
