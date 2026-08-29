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
	if (request.action === 'summary-completed' && request.text) {
		waitForElement('#loading-text').then((loadingText) => {
			loadingText.remove();
		});
		waitForElement('#summary-container').then((container) => {
			const summaryParagraph = document.createElement('p');
			summaryParagraph.textContent = request.text;
			container.appendChild(summaryParagraph);
			addCredits(container);
		});
	}

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
				const styleElm = document.createElement('style');
				styleElm.textContent = `
					:root {
						--text-color: rgba(27, 27, 37, 0.8);
						--text-color-disabled: rgba(27, 27, 37, 0.4);
						--bg-color: rgb(211 227 253);
						--bg-color-hover: rgb(194 211 237);
						--bg-color-active: rgb(175 193 219);
						--bg-color-disabled: rgb(229 229 229);
					}

					#summarize-btn {
						font-family: inherit;
						font-size: 0.9rem;
						border: none;
						color: var(--text-color);
						font-weight: 500;
						padding: 10px 20px;
						background-color: var(--bg-color);
						border-radius: 20px;
						cursor: pointer;
						z-index: 5;
						margin-left: 10px;
					}

					#summarize-btn:hover {
						background-color: var(--bg-color-hover)
					}

					#summarize-btn:active {
						background-color: var(--bg-color-active)
					}

					#summarize-btn:disabled {
						background-color: var(--bg-color-disabled);
						color: var(--text-color-disabled);
						cursor: not-allowed;
					}
					
					${summarizeBtnContainerSelector} {
						display: flex;
						flexd-direction: row;
						align-items: center;
					}
				`;

				summarizeBtn.addEventListener('click', (ev) => {
					textToSummarize = document.querySelector('.a3s').innerText;
					chrome.runtime.sendMessage({ action: 'generate-summary', text: textToSummarize });
					summarizeBtn.setAttribute('disabled', '');
					addSummaryContainer();
				});

				container.appendChild(styleElm);
				container.appendChild(summarizeBtn);
			});
		}
	}
});

function addSummaryContainer() {
	waitForElement('tbody:has(p)').then((tbody) => {
		console.log(tbody);
		const row = document.createElement('tr');
		row.classList.add('summary-row');
		const summaryContainer = document.createElement('div');
		summaryContainer.id = 'summary-container';
		const styleElm = document.createElement('style');
		styleElm.textContent = `
			:root {
				font-family: inherit;
			}

			#summary-container {
				--bg-color: rgb(211 227 253);
				font-size: 0.9rem;
				min-height: 100px;
				text-align: justify;
				margin-right: auto;
				margin-left: auto;
				width: clamp(60%, 640px, 60%);
				padding: 20px 30px;
				background-color: var(--bg-color);
				border-radius: 16px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}

			.summary-row {
				width: 100%;
				height: 100%;
			}
			
			#loading-text {
				font-style: italic;
				font-weight: bold;
			}
		`;

		const loadingText = document.createElement('span');
		loadingText.textContent = 'Summarizing...';
		loadingText.id = 'loading-text';

		summaryContainer.appendChild(loadingText);
		summaryContainer.appendChild(styleElm);
		row.appendChild(summaryContainer);
		tbody.insertBefore(row, tbody.firstChild);
		console.log(row);
	});
}

function addCredits(container) {
	const text = document.createElement('p');
	text.innerHTML = '<span class="extension-name">Brifin Summarizer</span> by Armando';
	const styleElm = document.createElement('style');
	styleElm.textContent = `
		.extension-name {
			font-weight: bold;
			font-style: italic;
		}
	`;
	text.appendChild(styleElm);
	container.appendChild(text);
}
