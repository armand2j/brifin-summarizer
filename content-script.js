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
	if (request.action === 'Text Summarized') {
		console.log('text was summarized');
	}
});
