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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') {
		try {
			chrome.tabs.sendMessage(tabId, { action: 'pageLoaded', tabId: tabId });
			console.log(tabId);
		} catch (error) {
			console.error('error happened. tab is was not found.');
		}
	}
});

chrome.runtime.onMessage.addListener((request, sender) => {
	if (request.action === 'generate-summary' && request.text) {
		console.log('message received to generate summary.');
		generateSummary(request.text).then((summary) => {
			try {
				chrome.tabs.sendMessage(request.tabId, { action: 'summary-completed', text: summary });
				console.log(request.tabId);
			} catch (error) {
				console.error('error happened. tab was not found');
			}
		});
	}
});
