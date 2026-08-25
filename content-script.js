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

chrome.runtime.onMessage.addListener((request, sender) => {
	if (request.action === 'pageLoaded') {
		console.log('page loading complete...');
		const urlParts = location.hash.split('/');

		if (urlParts.length <= 1) {
			console.log("This isn't an email...");
			return;
		}
		if (urlParts[1].toLowerCase().startsWith('fmfc')) {
			console.log("You're viewing an email!");
		}
	}
});
