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

import { addProperty } from './utils'
import fontface from './fontface'
import keyframes from './keyframes'
import standard from './standard'

const css = require('css')

const convertRules = (rules, res = {}) => {
	let result = res
	rules.forEach((rule) => {
		if (rule.type === 'media') {
			// Convert @media rules
			const name = `@media ${rule.media}`

			result[name] = result[name] || {}
			const media = result[name]

			convertRules(rule.rules, media)
		} else if (rule.type === 'font-face') {
			// Convert @font-face rules
			const fontProp = fontface(rule, result)
			if (fontProp) result = addProperty(result, fontProp[0], fontProp[1])
		} else if (rule.type === 'keyframes') {
			// Convert @keyframes rules
			const keyProp = keyframes(rule, result)
			result = addProperty(result, keyProp[0], keyProp[1])
		} else if (rule.type === 'rule') {
			// Convert standard CSS rules
			const standardProp = standard(rule, result)
			Object.entries(standardProp).forEach(([key, value]) => {
				result = addProperty(result, key, value)
			})
		}
	})

	return result
}

const convertToJS = (input) => {
	// Parse CSS string into rules array

	try {
		const parsedCss = css.parse(input)
		const { rules } = parsedCss.stylesheet
		return convertRules(rules)
	} catch (err) {
		throw new Error(`Invalid CSS input: ${err}`)
	}
}

export default convertToJS
