/*
 * Copyright 2020 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

import { sanitize, camelize, addProperty } from './utils'

const standard = (rule, result) => {
	const obj = {}
	let retObj = {}
	rule.declarations.forEach((declaration) => {
		const cssProperty = camelize(declaration.property)
		obj[cssProperty] = declaration.value
	})
	rule.selectors.forEach((selector) => {
		let name

		// Check if selector contains a pseudo selector
		const pseudoSelectorIndex = selector.indexOf(':')
		if (pseudoSelectorIndex !== -1) {
			// Find end of pseudo selector
			let endPseudoSelectorIndex = selector.indexOf(' ', pseudoSelectorIndex)
			if (endPseudoSelectorIndex === -1)
				endPseudoSelectorIndex = selector.length

			// Split selector
			const primarySelector = selector.slice(0, pseudoSelectorIndex)
			const pseudoSelector = selector.slice(
				pseudoSelectorIndex,
				endPseudoSelectorIndex
			)
			const secondarySelector = selector.slice(
				endPseudoSelectorIndex,
				selector.length
			)

			const pseudoObj = {}
			pseudoObj[`&${pseudoSelector}${secondarySelector}`] = obj

			name = sanitize(primarySelector.trim())
			retObj = addProperty(result, name, pseudoObj)
		} else {
			name = sanitize(selector.trim())
			retObj = addProperty(result, name, obj)
		}
	})

	return retObj
}

export default standard
