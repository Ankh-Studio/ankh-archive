
import { Template, CrawlRequest } from '../types/types';
import { extractPageContent } from '../utils/content-extractor';
import { initializePageContent } from '../utils/content-extractor';
import { createObsidianNote } from '../utils/obsidian-note-creator';
import { generalSettings } from '../utils/storage-utils';
import { getMessage } from '../utils/i18n';
import browser from '../utils/browser-polyfill';

export interface CrawlProgress {
	current: number;
	total: number;
	currentUrl: string;
	status: 'processing' | 'completed' | 'failed';
}

export type CrawlProgressCallback = (progress: CrawlProgress) => void;

export class CrawlManager {
	private isRunning = false;
	private currentRequest: CrawlRequest | null = null;

	async crawlUrls(
		urls: string[], 
		template: Template, 
		onProgress?: CrawlProgressCallback
	): Promise<{ success: number; failed: string[] }> {
		if (this.isRunning) {
			throw new Error('Crawl already in progress');
		}

		this.isRunning = true;
		const results = { success: 0, failed: [] as string[] };

		try {
			for (let i = 0; i < urls.length; i++) {
				const url = urls[i].trim();
				if (!url) continue;

				if (onProgress) {
					onProgress({
						current: i + 1,
						total: urls.length,
						currentUrl: url,
						status: 'processing'
					});
				}

				try {
					await this.processUrl(url, template);
					results.success++;
				} catch (error) {
					console.error(`Failed to process URL ${url}:`, error);
					results.failed.push(url);
				}

				// Add a small delay to prevent overwhelming the browser
				await new Promise(resolve => setTimeout(resolve, 1000));
			}

			if (onProgress) {
				onProgress({
					current: urls.length,
					total: urls.length,
					currentUrl: '',
					status: 'completed'
				});
			}

		} finally {
			this.isRunning = false;
		}

		return results;
	}

	private async processUrl(url: string, template: Template): Promise<void> {
		// Create a temporary tab to extract content
		const tab = await browser.tabs.create({ url, active: false });
		
		try {
			// Wait for the page to load
			await new Promise(resolve => setTimeout(resolve, 3000));

			// Extract content from the page
			const contentResponse = await extractPageContent(tab.id!);
			if (!contentResponse) {
				throw new Error('Failed to extract content');
			}

			// Initialize page content with template variables
			const { noteName, currentVariables } = await initializePageContent(
				contentResponse.content,
				contentResponse.selectedHtml,
				contentResponse.extractedContent,
				url,
				contentResponse.schemaOrgData,
				contentResponse.fullHtml,
				contentResponse.highlights,
				contentResponse.title,
				contentResponse.author,
				contentResponse.description,
				contentResponse.favicon,
				contentResponse.image,
				contentResponse.published,
				contentResponse.site,
				contentResponse.wordCount,
				contentResponse.metaTags
			);

			// Create Obsidian note using the template
			await createObsidianNote(template, currentVariables, generalSettings);

		} finally {
			// Clean up: close the tab
			if (tab.id) {
				await browser.tabs.remove(tab.id);
			}
		}
	}

	isCurrentlyRunning(): boolean {
		return this.isRunning;
	}

	stop(): void {
		this.isRunning = false;
	}
}

export const crawlManager = new CrawlManager();
