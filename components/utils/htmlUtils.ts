/**
 * @param {String} HTML representing a single element.
 * @param {Boolean} flag representing whether or not to trim input whitespace, defaults to true.
 * @return {Element | HTMLCollection | null}
 */
export function fromHTML(html, trim = true) {
	// Process the HTML string.
	html = trim ? html : html.trim()
	if (!html) return null

	// Then set up a new template element.
	const template = document.createElement('template')
	template.innerHTML = html
	const result = template.content.children

	// Then return either an HTMLElement or HTMLCollection,
	// based on whether the input HTML had one or more roots.
	if (result.length === 1) return result[0]
	return result
}
