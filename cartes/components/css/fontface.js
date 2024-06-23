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

import { camelize, capitalize, sanitize } from './utils'

const fontface = (rule, result) => {
	let name = ''
	let obj = {}
	const fontObj = {}

	rule.declarations.forEach((declaration) => {
		const cssProperty = camelize(declaration.property)
		fontObj[cssProperty] = declaration.value

		name = capitalize(camelize(fontObj.fontFamily).replace(/"/g, ''))
		obj = { '@font-face': fontObj }
	})

	let dupeFlag = false

	Object.keys(result).forEach((key) => {
		if (key.split('_')[0] === name) {
			if (JSON.stringify(result[key]) === JSON.stringify(obj)) {
				dupeFlag = true
			}
		}
	})

	if (!dupeFlag) {
		const numVar = Object.entries(result).filter(
			(resObj) => resObj[0].split('_')[0] === name
		).length

		if (numVar > 0) {
			name = `${name}_${numVar + 1}`
		}

		name = sanitize(name)

		return [name, obj]
	}

	return false
}

export default fontface
