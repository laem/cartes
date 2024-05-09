import { objectMapKeys } from '@/components/utils/utils'
import data from './rules.yaml'

const prefix = 'carburants'
const rules = {
	[prefix]: null,
	...data,
}

const setPrefix = (dottedName) => `${prefix} . ${dottedName}`

const prefixExemplesSituation = (v) => {
	if (!v || !v.exemples) return v
	return {
		...v,
		exemples: v.exemples.map((exemple) => ({
			...exemple,
			situation: objectMapKeys(exemple.situation, (k) => setPrefix(k)),
		})),
	}
}
const prefixedRules = Object.fromEntries(
	Object.entries(rules).map(([k, v]) => [
		k === prefix ? k : setPrefix(k),
		prefixExemplesSituation(v),
	])
)

export default prefixedRules
