// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Article = defineDocumentType(() => ({
	name: 'Article',
	filePathPattern: `**/*.mdx`,
	contentType: 'mdx',

	fields: {
		titre: { type: 'string', required: true },
		date: { type: 'date', required: true },
		description: { type: 'string', required: true },
	},
	computedFields: {
		url: {
			type: 'string',
			resolve: (post) => `/blog/${post._raw.flattenedPath}`,
		},
	},
}))

export default makeSource({
	contentDirPath: 'articles',
	documentTypes: [Article],
})
