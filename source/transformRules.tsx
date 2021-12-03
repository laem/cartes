const correspondanceToVariations = (obj) => {
	if (!obj?.formule || !obj.formule.correspondance) return obj
	const correspondance = obj.formule.correspondance,
		newFormule = {
			variations: Object.entries(correspondance.tableau).map(
				([test, result]) => ({
					si: `${correspondance.variable} = '${test}'`,
					alors: result,
				})
			),
		}
	return { ...obj, formule: newFormule }
}
export default (rules) =>
	Object.fromEntries(
		Object.entries(rules).map(([key, value]) => [
			key,
			correspondanceToVariations(value),
		])
	)
