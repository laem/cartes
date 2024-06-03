export const safeRemove = (map) => (layers, sources) => {
	if (!map) return

	layers.map((layer) => {
		const test = map.getLayer(layer)
		if (test) {
			//console.log('safeRemove will remove layer', layer)
			map.removeLayer(layer)
		}
	})
	sources.map((source) => {
		const test = map.getSource(source)
		if (test) {
			//console.log('safeRemove will remove source', source)
			map.removeSource(source)
		}
	})
}
