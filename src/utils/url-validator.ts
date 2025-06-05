
export function validateUrl(url: string): boolean {
	try {
		const urlObj = new URL(url.trim());
		return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
	} catch {
		return false;
	}
}

export function cleanAndValidateUrls(urlText: string): { valid: string[]; invalid: string[] } {
	const lines = urlText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
	const valid: string[] = [];
	const invalid: string[] = [];
	
	for (const line of lines) {
		if (validateUrl(line)) {
			valid.push(line);
		} else {
			invalid.push(line);
		}
	}
	
	return { valid, invalid };
}

export function removeDuplicateUrls(urls: string[]): string[] {
	return [...new Set(urls)];
}
