import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkToc from 'remark-toc'
import remarkGfm from 'remark-gfm'

const mdxOptions = {
	remarkPlugins: [
		[
			remarkGfm,
			remarkToc,
			{ heading: '(table[ -]of[ -])?contents?|toc|Sommaire' },
		],
	],
	rehypePlugins: [
		rehypeSlug,
		[
			rehypeAutolinkHeadings,
			{
				behaviour: 'append',
				properties: {
					ariaHidden: true,
					tabIndex: -1,
					className: 'hash-link',
				},
			},
		],
	],
}

export default mdxOptions
