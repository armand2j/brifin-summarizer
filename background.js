console.log('Hello World!');
console.log('Hello World!');

async function generateSummary(text) {}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(sender.tab ? 'from a content script: ' + sender.tab_url : 'from the extension.');
	if (request.greeting === 'hello') {
		sendResponse({ farewell: 'goodbye' });
	}
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log('completed');
	if (changeInfo === 'complete') {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, { action: 'Text Summarized' }, () => {
				console.log('nice');
			});
		});
	}
});
