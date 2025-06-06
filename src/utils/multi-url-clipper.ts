
import browser from './browser-polyfill';
import { Template } from '../types/types';
import { extractPageContent } from './content-extractor';
import { compileTemplate } from './template-compiler';
import { saveToObsidian } from './obsidian-note-creator';
import { generateFrontmatter } from './obsidian-note-creator';
import { incrementStat } from './storage-utils';
import { isValidUrl } from './active-tab-manager';
import { sanitizeFileName } from './string-utils';
import { debugLog } from './debug';

export interface MultiUrlClipOptions {
	urls: string[];
	template: Template;
	selectedVault: string;
	basePath: string;
}

export interface MultiUrlClipResult {
	url: string;
	success: boolean;
	noteName?: string;
	error?: string;
}

export async function clipMultipleUrls(options: MultiUrlClipOptions): Promise<MultiUrlClipResult[]> {
	const { urls, template, selectedVault, basePath } = options;
	const results: MultiUrlClipResult[] = [];

	debugLog('MultiUrlClipper', `Starting multi-URL clip for ${urls.length} URLs`);

	for (const url of urls) {
		try {
			const result = await clipSingleUrl(url, template, selectedVault, basePath);
			results.push(result);
			debugLog('MultiUrlClipper', `Successfully clipped: ${url}`);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			results.push({
				url,
				success: false,
				error: errorMessage
			});
			debugLog('MultiUrlClipper', `Failed to clip ${url}: ${errorMessage}`);
		}
	}

	return results;
}

async function clipSingleUrl(
	url: string, 
	template: Template, 
	selectedVault: string, 
	basePath: string
): Promise<MultiUrlClipResult> {
	let tabId: number | undefined;
	
	try {
		debugLog('MultiUrlClipper', `Starting clip for URL: ${url}`);
		
		// Create a temporary tab to extract content
		const tab = await browser.tabs.create({ url, active: false });
		tabId = tab.id;
		
		if (!tabId) {
			throw new Error('Failed to create tab');
		}

		// Wait for the page to load
		await waitForTabComplete(tabId);
		
		// Ensure content script is loaded
		const { ensureContentScriptLoaded } = await import('./content-script-utils');
		await ensureContentScriptLoaded(tabId);

		// Extract page content
		const extractedData = await extractPageContent(tabId);
		if (!extractedData) {
			throw new Error('Failed to extract page content');
		}

		// Compile template with extracted variables
		const variables = {
			title: extractedData.title || '',
			author: extractedData.author || '',
			description: extractedData.description || '',
			url: url,
			site: extractedData.site || '',
			published: extractedData.published || '',
			content: extractedData.content || '',
			selectedHtml: extractedData.selectedHtml || '',
			extractedContent: extractedData.extractedContent || '',
			wordCount: extractedData.wordCount?.toString() || '0',
			favicon: extractedData.favicon || '',
			image: extractedData.image || '',
			highlights: extractedData.highlights || []
		};

		// Compile note name
		const noteName = await compileTemplate(tabId, template.noteNameFormat, variables, url);
		const sanitizedNoteName = sanitizeFileName(noteName.trim());

		// Compile note content
		const noteContent = await compileTemplate(tabId, template.noteContentFormat, variables, url);

		// Compile properties
		const compiledProperties = await Promise.all(
			template.properties.map(async (prop) => ({
				id: prop.id,
				name: prop.name,
				value: await compileTemplate(tabId!, prop.value, variables, url)
			}))
		);

		// Generate frontmatter
		const frontmatter = await generateFrontmatter(compiledProperties);
		const fileContent = frontmatter + noteContent;

		// Determine path
		const compiledPath = await compileTemplate(tabId, template.path, variables, url);
		const fullPath = basePath ? `${basePath}/${compiledPath}` : compiledPath;

		// Save to Obsidian
		await saveToObsidian(fileContent, sanitizedNoteName, fullPath, selectedVault, template.behavior);
		await incrementStat('addToObsidian', selectedVault, fullPath);

		debugLog('MultiUrlClipper', `Successfully saved note: ${sanitizedNoteName}`);

		return {
			url,
			success: true,
			noteName: sanitizedNoteName
		};

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		debugLog('MultiUrlClipper', `Error clipping ${url}: ${errorMessage}`);
		throw error;
	} finally {
		// Close the temporary tab
		if (tabId) {
			try {
				await browser.tabs.remove(tabId);
			} catch (error) {
				debugLog('MultiUrlClipper', `Error closing tab ${tabId}: ${error}`);
			}
		}
	}
}

function waitForTabComplete(tabId: number): Promise<void> {
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			reject(new Error('Tab load timeout'));
		}, 30000); // 30 second timeout

		const listener = (changedTabId: number, changeInfo: browser.Tabs.OnUpdatedChangeInfoType) => {
			if (changedTabId === tabId && changeInfo.status === 'complete') {
				clearTimeout(timeout);
				browser.tabs.onUpdated.removeListener(listener);
				// Give content script time to initialize
				setTimeout(resolve, 1000);
			}
		};

		browser.tabs.onUpdated.addListener(listener);
	});
}

export function validateUrls(urlsText: string): { valid: string[]; invalid: string[] } {
	const lines = urlsText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
	const valid: string[] = [];
	const invalid: string[] = [];

	for (const line of lines) {
		if (isValidUrl(line)) {
			valid.push(line);
		} else {
			invalid.push(line);
		}
	}

	return { valid, invalid };
}
