
import { crawlManager, CrawlProgress } from './crawl-manager';
import { Template } from '../types/types';
import { getMessage } from '../utils/i18n';
import { cleanAndValidateUrls, removeDuplicateUrls } from '../utils/url-validator';
import { generalSettings } from '../utils/storage-utils';

export class CrawlUIManager {
	private modal: HTMLElement | null = null;
	private isOpen = false;

	constructor() {
		this.createModal();
		this.setupEventListeners();
	}

	private createModal(): void {
		this.modal = document.createElement('div');
		this.modal.className = 'crawl-modal';
		this.modal.innerHTML = `
			<div class="crawl-modal-overlay">
				<div class="crawl-modal-content">
					<div class="crawl-modal-header">
						<h3 data-i18n="crawlUrls">Crawl URLs</h3>
						<button class="crawl-modal-close" type="button">
							<i data-lucide="x"></i>
						</button>
					</div>
					<div class="crawl-modal-body">
						<div class="crawl-input-section">
							<label for="crawl-urls-input" data-i18n="crawlUrlsDescription">Enter URLs to crawl (one per line)</label>
							<textarea id="crawl-urls-input" placeholder="https://example.com/page1&#10;https://example.com/page2" rows="6"></textarea>
							<div class="crawl-url-info">
								<span id="crawl-url-count">0 URLs</span>
								<span id="crawl-url-invalid" class="crawl-error" style="display: none;"></span>
							</div>
						</div>
						<div class="crawl-progress-section" style="display: none;">
							<div class="crawl-progress-bar">
								<div class="crawl-progress-fill"></div>
							</div>
							<div class="crawl-progress-text">
								<span id="crawl-current-url"></span>
								<span id="crawl-progress-count">0 / 0</span>
							</div>
						</div>
						<div class="crawl-results-section" style="display: none;">
							<div class="crawl-results-summary">
								<span id="crawl-success-count">0 successful</span>
								<span id="crawl-failed-count" style="display: none;">0 failed</span>
							</div>
						</div>
					</div>
					<div class="crawl-modal-footer">
						<button id="crawl-start-btn" type="button" class="button primary" data-i18n="startCrawl">Start Crawl</button>
						<button id="crawl-cancel-btn" type="button" class="button" data-i18n="cancel">Cancel</button>
						<button id="crawl-close-btn" type="button" class="button primary" style="display: none;" data-i18n="close">Close</button>
					</div>
				</div>
			</div>
		`;
		document.body.appendChild(this.modal);
	}

	private setupEventListeners(): void {
		if (!this.modal) return;

		const overlay = this.modal.querySelector('.crawl-modal-overlay');
		const closeBtn = this.modal.querySelector('.crawl-modal-close');
		const cancelBtn = this.modal.querySelector('#crawl-cancel-btn');
		const closeSuccessBtn = this.modal.querySelector('#crawl-close-btn');
		const startBtn = this.modal.querySelector('#crawl-start-btn');
		const urlInput = this.modal.querySelector('#crawl-urls-input') as HTMLTextAreaElement;

		// Close modal events
		[overlay, closeBtn, cancelBtn, closeSuccessBtn].forEach(element => {
			element?.addEventListener('click', (e) => {
				if (e.target === element) {
					this.closeModal();
				}
			});
		});

		// URL input validation
		urlInput?.addEventListener('input', () => {
			this.validateUrls();
		});

		// Start crawl
		startBtn?.addEventListener('click', () => {
			this.startCrawl();
		});

		// Escape key to close
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && this.isOpen) {
				this.closeModal();
			}
		});
	}

	private validateUrls(): void {
		const urlInput = this.modal?.querySelector('#crawl-urls-input') as HTMLTextAreaElement;
		const countSpan = this.modal?.querySelector('#crawl-url-count');
		const invalidSpan = this.modal?.querySelector('#crawl-url-invalid');
		const startBtn = this.modal?.querySelector('#crawl-start-btn') as HTMLButtonElement;

		if (!urlInput || !countSpan || !invalidSpan || !startBtn) return;

		const { valid, invalid } = cleanAndValidateUrls(urlInput.value);
		const uniqueValid = removeDuplicateUrls(valid);

		// Update count
		countSpan.textContent = `${uniqueValid.length} URL${uniqueValid.length !== 1 ? 's' : ''}`;

		// Show invalid URLs if any
		if (invalid.length > 0) {
			invalidSpan.textContent = `${invalid.length} invalid URL${invalid.length !== 1 ? 's' : ''}`;
			invalidSpan.style.display = 'inline';
		} else {
			invalidSpan.style.display = 'none';
		}

		// Enable/disable start button
		startBtn.disabled = uniqueValid.length === 0 || uniqueValid.length > 100;
		
		if (uniqueValid.length > 100) {
			invalidSpan.textContent = 'Maximum 100 URLs allowed';
			invalidSpan.style.display = 'inline';
		}
	}

	private async startCrawl(): Promise<void> {
		const urlInput = this.modal?.querySelector('#crawl-urls-input') as HTMLTextAreaElement;
		const progressSection = this.modal?.querySelector('.crawl-progress-section') as HTMLElement;
		const resultsSection = this.modal?.querySelector('.crawl-results-section') as HTMLElement;
		const startBtn = this.modal?.querySelector('#crawl-start-btn') as HTMLButtonElement;
		const cancelBtn = this.modal?.querySelector('#crawl-cancel-btn') as HTMLButtonElement;
		const closeBtn = this.modal?.querySelector('#crawl-close-btn') as HTMLButtonElement;

		if (!urlInput || !progressSection || !resultsSection) return;

		const { valid } = cleanAndValidateUrls(urlInput.value);
		const uniqueUrls = removeDuplicateUrls(valid);

		if (uniqueUrls.length === 0) return;

		// Get current template (from popup context)
		const templateSelect = document.getElementById('template-select') as HTMLSelectElement;
		const currentTemplateId = templateSelect?.value;
		
		// This would need to be passed from the popup context
		// For now, we'll get it from the global templates array
		const templates = (window as any).templates || [];
		const currentTemplate = templates.find((t: Template) => t.id === currentTemplateId) || templates[0];

		if (!currentTemplate) {
			alert('No template selected');
			return;
		}

		// Hide input, show progress
		this.modal?.querySelector('.crawl-input-section')?.setAttribute('style', 'display: none;');
		progressSection.style.display = 'block';
		startBtn.style.display = 'none';
		cancelBtn.textContent = 'Cancel';

		try {
			const results = await crawlManager.crawlUrls(uniqueUrls, currentTemplate, (progress: CrawlProgress) => {
				this.updateProgress(progress);
			});

			// Show results
			progressSection.style.display = 'none';
			resultsSection.style.display = 'block';
			cancelBtn.style.display = 'none';
			closeBtn.style.display = 'inline-block';

			const successSpan = this.modal?.querySelector('#crawl-success-count');
			const failedSpan = this.modal?.querySelector('#crawl-failed-count');

			if (successSpan) {
				successSpan.textContent = `${results.success} successful`;
			}

			if (failedSpan && results.failed.length > 0) {
				failedSpan.textContent = `${results.failed.length} failed`;
				failedSpan.style.display = 'inline';
			}

		} catch (error) {
			console.error('Crawl failed:', error);
			alert('Crawl failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
			this.resetModal();
		}
	}

	private updateProgress(progress: CrawlProgress): void {
		const progressBar = this.modal?.querySelector('.crawl-progress-fill') as HTMLElement;
		const currentUrlSpan = this.modal?.querySelector('#crawl-current-url');
		const progressCountSpan = this.modal?.querySelector('#crawl-progress-count');

		if (progressBar) {
			const percentage = (progress.current / progress.total) * 100;
			progressBar.style.width = `${percentage}%`;
		}

		if (currentUrlSpan) {
			currentUrlSpan.textContent = progress.currentUrl || 'Completing...';
		}

		if (progressCountSpan) {
			progressCountSpan.textContent = `${progress.current} / ${progress.total}`;
		}
	}

	private resetModal(): void {
		// Reset all sections to initial state
		this.modal?.querySelector('.crawl-input-section')?.removeAttribute('style');
		this.modal?.querySelector('.crawl-progress-section')?.setAttribute('style', 'display: none;');
		this.modal?.querySelector('.crawl-results-section')?.setAttribute('style', 'display: none;');
		
		const startBtn = this.modal?.querySelector('#crawl-start-btn') as HTMLButtonElement;
		const cancelBtn = this.modal?.querySelector('#crawl-cancel-btn') as HTMLButtonElement;
		const closeBtn = this.modal?.querySelector('#crawl-close-btn') as HTMLButtonElement;

		if (startBtn) startBtn.style.display = 'inline-block';
		if (cancelBtn) {
			cancelBtn.style.display = 'inline-block';
			cancelBtn.textContent = 'Cancel';
		}
		if (closeBtn) closeBtn.style.display = 'none';

		// Clear input
		const urlInput = this.modal?.querySelector('#crawl-urls-input') as HTMLTextAreaElement;
		if (urlInput) {
			urlInput.value = '';
			this.validateUrls();
		}
	}

	public openModal(): void {
		if (!this.modal) return;
		
		this.modal.style.display = 'block';
		this.isOpen = true;
		this.resetModal();
		
		// Focus URL input
		const urlInput = this.modal.querySelector('#crawl-urls-input') as HTMLTextAreaElement;
		if (urlInput) {
			setTimeout(() => urlInput.focus(), 100);
		}
	}

	public closeModal(): void {
		if (!this.modal) return;
		
		this.modal.style.display = 'none';
		this.isOpen = false;

		// Stop any running crawl
		if (crawlManager.isCurrentlyRunning()) {
			crawlManager.stop();
		}
	}

	public isModalOpen(): boolean {
		return this.isOpen;
	}
}

export const crawlUIManager = new CrawlUIManager();
