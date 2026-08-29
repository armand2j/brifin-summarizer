console.log('Hello World!');
console.log('Hello World!');

async function generateSummary(text) {
	const options = {
		type: 'tldr',
		format: 'markdown',
		length: 'long',
		preference: 'capability',
		expectedInputLanguages: ['es'],
		outputLanguage: 'es',
		expectedContextLanguages: ['en'],
		sharedContext:
			'This is a Dominican daily newsletter. The users expect a concise summary response in Spanish. Each important event should be separated by adding a new empty line in between events.',

		monitor(m) {
			m.addEventListener('downloadprogress', (e) => {
				console.log(`Downloaded ${e.loaded * 100}%`);
			});
		},
	};
	const availability = await Summarizer.availability();
	if (availability === 'unavailable') return;

	// if (!navigator.userActivation.isActive) return 'error';

	const summarizer = await Summarizer.create(options);
	const summary = await summarizer.summarize(text);
	return summary;
}

chrome.runtime.onMessage.addListener((request, sender) => {
	if (request.action === 'generate-summary' && request.text) {
		console.log('message received to generate summary.');
		generateSummary(request.text).then((summary) => {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				try {
					chrome.tabs.sendMessage(tabs[0].id, { action: 'summary-completed', text: summary });
					console.log(tabs[0].id);
				} catch (error) {
					console.error('error happened. tab is undefined');
				}
			});
		});
	}
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			try {
				chrome.tabs.sendMessage(tabs[0].id, { action: 'pageLoaded' });
				console.log(tabs[0].id);
			} catch (error) {
				console.error('error happened. tab is undefined');
			}
		});
	}
});
