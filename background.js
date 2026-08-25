console.log('Hello World!');
console.log('Hello World!');

async function generateSummary(text) {}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(sender.tab ? 'from a content script: ' + sender.tab_url : 'from the extension.');
	if (request.greeting === 'hello') {
		sendResponse({ farewell: 'goodbye' });
	}
});

let canComplete = false;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log(canComplete);
	if (changeInfo.status == 'complete' && canComplete) {
		canComplete = false;
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, { action: 'pageLoaded' });
			console.log(tabs[0].id);
			return;
		});
	}
	if (changeInfo.status == 'loading') {
		canComplete = true;
	}
});
