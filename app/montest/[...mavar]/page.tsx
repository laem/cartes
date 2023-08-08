import Engine from 'publicodes'

export default ({ params: { mavar } }) => {
	const engine = new Engine({ a: 'b + c', b: 3, c: 26 })
	const evaluation = engine.evaluate('a')

	return mavar + evaluation.nodeValue
}
