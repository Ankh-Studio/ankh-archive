
import { Template } from '../types/types';
import { validateUrls, clipMultipleUrls, MultiUrlClipResult } from './multi-url-clipper';
import { createElementWithClass } from './dom-utils';
import { initializeIcons } from '../icons/icons';
import { getMessage } from './i18n';
import { debugLog } from './debug';

export function createMultiUrlModal(
	templates: Template[],
	currentTemplate: Template,
	selectedVault: string,
	onComplete: (results: MultiUrlClipResult[]) => void
): HTMLElement {
	const modal = createElementWithClass('div', 'modal-overlay');
	modal.innerHTML = `
		<div class="modal multi-url-modal">
			<div class="modal-header">
				<h2 data-i18n="clipMultipleUrls">Clip Multiple URLs</h2>
				<button class="modal-close" aria-label="Close">
					<i data-lucide="x"></i>
				</button>
			</div>
			<div class="modal-content">
				<div class="form-group">
					<label for="template-select-multi" data-i18n="template">Template</label>
					<select id="template-select-multi" class="form-control">
						${templates.map(template => 
							`<option value="${template.id}" ${template.id === currentTemplate.id ? 'selected' : ''}>
								${template.name}
							</option>`
						).join('')}
					</select>
				</div>
				
				<div class="form-group">
					<label for="urls-input" data-i18n="urlsList">URLs (one per line)</label>
					<textarea id="urls-input" class="form-control" rows="10" 
						placeholder="https://example.com/page1
https://example.com/page2
https://example.com/page3"></textarea>
					<div class="form-help" data-i18n="urlsListHelp">
						Enter one URL per line. Invalid URLs will be highlighted.
					</div>
				</div>

				<div class="url-validation" style="display: none;">
					<div class="validation-summary"></div>
				</div>

				<div class="progress-container" style="display: none;">
					<div class="progress-bar">
						<div class="progress-fill"></div>
					</div>
					<div class="progress-text">0 / 0</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-secondary" id="cancel-multi-clip" data-i18n="cancel">Cancel</button>
				<button class="btn btn-primary" id="start-multi-clip" data-i18n="startClipping">Start Clipping</button>
			</div>
		</div>
	`;

	const closeBtn = modal.querySelector('.modal-close') as HTMLButtonElement;
	const cancelBtn = modal.querySelector('#cancel-multi-clip') as HTMLButtonElement;
	const startBtn = modal.querySelector('#start-multi-clip') as HTMLButtonElement;
	const urlsInput = modal.querySelector('#urls-input') as HTMLTextAreaElement;
	const validationDiv = modal.querySelector('.url-validation') as HTMLElement;
	const progressContainer = modal.querySelector('.progress-container') as HTMLElement;
	const progressFill = modal.querySelector('.progress-fill') as HTMLElement;
	const progressText = modal.querySelector('.progress-text') as HTMLElement;

	// Close modal handlers
	const closeModal = () => {
		modal.remove();
	};

	closeBtn.addEventListener('click', closeModal);
	cancelBtn.addEventListener('click', closeModal);
	modal.addEventListener('click', (e) => {
		if (e.target === modal) closeModal();
	});

	// URL validation on input
	urlsInput.addEventListener('input', () => {
		const urlsText = urlsInput.value.trim();
		if (urlsText) {
			const { valid, invalid } = validateUrls(urlsText);
			updateValidation(validationDiv, valid, invalid);
			startBtn.disabled = valid.length === 0;
		} else {
			validationDiv.style.display = 'none';
			startBtn.disabled = true;
		}
	});

	// Start clipping
	startBtn.addEventListener('click', async () => {
		const urlsText = urlsInput.value.trim();
		const templateSelect = modal.querySelector('#template-select-multi') as HTMLSelectElement;
		const selectedTemplateId = templateSelect.value;
		const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || currentTemplate;

		if (!urlsText) return;

		const { valid: urls } = validateUrls(urlsText);
		if (urls.length === 0) return;

		// Disable form and show progress
		startBtn.disabled = true;
		cancelBtn.disabled = true;
		urlsInput.disabled = true;
		templateSelect.disabled = true;
		progressContainer.style.display = 'block';

		try {
			debugLog('MultiUrlModal', `Starting clip for ${urls.length} URLs`);
			
			const results: MultiUrlClipResult[] = [];
			
			for (let i = 0; i < urls.length; i++) {
				const url = urls[i];
				progressText.textContent = `${i + 1} / ${urls.length}`;
				progressFill.style.width = `${((i + 1) / urls.length) * 100}%`;

				try {
					const result = await clipMultipleUrls({
						urls: [url],
						template: selectedTemplate,
						selectedVault: selectedVault,
						basePath: ''
					});
					results.push(...result);
				} catch (error) {
					results.push({
						url,
						success: false,
						error: error instanceof Error ? error.message : 'Unknown error'
					});
				}
			}

			onComplete(results);
			closeModal();

		} catch (error) {
			console.error('Error in multi-URL clipping:', error);
			// Re-enable form
			startBtn.disabled = false;
			cancelBtn.disabled = false;
			urlsInput.disabled = false;
			templateSelect.disabled = false;
			progressContainer.style.display = 'none';
		}
	});

	initializeIcons(modal);
	return modal;
}

function updateValidation(
	validationDiv: HTMLElement, 
	valid: string[], 
	invalid: string[]
) {
	const summary = validationDiv.querySelector('.validation-summary') as HTMLElement;
	
	if (valid.length === 0 && invalid.length === 0) {
		validationDiv.style.display = 'none';
		return;
	}

	validationDiv.style.display = 'block';
	
	let html = '';
	
	if (valid.length > 0) {
		html += `<div class="validation-valid">
			<i data-lucide="check-circle"></i>
			<span>${valid.length} valid URL${valid.length !== 1 ? 's' : ''}</span>
		</div>`;
	}
	
	if (invalid.length > 0) {
		html += `<div class="validation-invalid">
			<i data-lucide="alert-circle"></i>
			<span>${invalid.length} invalid URL${invalid.length !== 1 ? 's' : ''}</span>
			<details>
				<summary>Show invalid URLs</summary>
				<ul>
					${invalid.map(url => `<li>${url}</li>`).join('')}
				</ul>
			</details>
		</div>`;
	}
	
	summary.innerHTML = html;
	initializeIcons(summary);
}
