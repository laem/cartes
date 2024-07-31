import { processTags } from '../Tags'
import { buildAddress } from './buildAddress'

export default function buildOsmFeatureDescription(osmFeature) {
	if (!osmFeature) return
	const tags = osmFeature.tags
	const descriptionTag = tags?.description

	const address = tags && buildAddress(tags)

	const [, soloTags] = processTags(tags) // processTags should get filteredRest as input, but see OsmFeature.tsx's TODO

	const mainTags = soloTags.map(([raw, tag]) => tag)
	return [mainTags.join(' '), descriptionTag, "à l'adresse " + address]
		.filter(Boolean)
		.join(' - ')
}
