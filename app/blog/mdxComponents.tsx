import css from '@/components/css/convertToJs'
import Image from 'next/image'

export const mdxComponents: MDXComponents = {
	img: ({ src, alt }) => {
		if (src.startsWith('http')) return <img src={src} alt={alt} />
		const computedSrc = src.startsWith('/') ? src : '/blog-images/' + src
		return (
			<span
				className="image-container"
				style={css`
					position: relative;
					width: 100%;
					padding-bottom: 1vh;
				`}
			>
				<Image src={computedSrc} alt={alt} layout="fill" objectFit="contain" />
			</span>
		)
	},
}
