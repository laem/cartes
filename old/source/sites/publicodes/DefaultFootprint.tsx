import Engine, { formatValue } from 'publicodes'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const meanFormatter = (value) => Math.round(value / 100) / 10 + ' tonnes'

export default ({}) => {
	const rules = useSelector((state) => state.rules)
	const engine = useMemo(() => new Engine(rules), [rules])

	return meanFormatter(engine.evaluate('bilan').nodeValue)
}
