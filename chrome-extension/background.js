// TODO: 置換ルールを設定できるようにする
// TODO: permission は optional_permissions にして、置換ルール設定時に都度要求する
const replacementRules = [{
	from: 'example.com',
	to: 'www.example.com',
}, {
	from: 'dummy.example.com',
	to: '127.0.0.1',
}];

chrome.webRequest.onBeforeRequest.addListener(details => {
	const url = new URL(details.url);
	console.debug(`[${details.method}] onBeforeRequest[${details.type}]: ${url.href}`);
	const matchedRule = replacementRules.find(rule => url.hostname === rule.from);
	if (matchedRule) {
		url.hostname = matchedRule.to;
		return {
			redirectUrl: url.href,
		};
	}
}, {
	urls: [
		'*://*/*',
	],
}, [
	'blocking',
]);

chrome.webRequest.onBeforeSendHeaders.addListener(details => {
	const url = new URL(details.url);
	console.debug(`[${details.method}] onBeforeSendHeaders[${details.type}]: ${url.href}`);
	console.table(details.requestHeaders);
	const matchedRule = replacementRules.find(rule => url.hostname === rule.to);
	if (matchedRule) {
		details.requestHeaders.push({
			name: 'Host',
			value: matchedRule.from,
		});
		return {
			requestHeaders: details.requestHeaders,
		};
	}
}, {
	urls: [
		'*://*/*',
	],
}, [
	'blocking',
	'requestHeaders',
]);
