import css from '@/components/css/convertToJs'
import Link from 'next/link'

export default function Contribution({ slug }) {
	return (
		<Link
			href={`https://github.com/laem/cartes/edit/master/articles/${slug}.mdx`}
			style={css`
				display: block;
				margin: 0 0 0 auto;
				width: fit-content;
				margin-top: 2rem;
			`}
		>
			✏️ Signaler une erreur
		</Link>
	)
}
