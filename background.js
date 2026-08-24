console.log('Hello World!');
console.log('Hello World!');

async function generateSummary(text) {}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(sender.tab ? 'from a content script: ' + sender.tab_url : 'from the extension.');
	if (request.greeting === 'hello') {
		sendResponse({ farewell: 'goodbye' });
	}
});

chrome.tabs;
