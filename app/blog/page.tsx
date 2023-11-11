import { Metadata } from 'next'
import Link from 'next/link'

import { getSortedPostsData } from './getPosts'

const title = `Le blog - Futureco`
const description =
	"Découvrez l'histoire, les nouveautés et le futur de futureco"

export const metadata: metadata = {
	title,
	description,
}

const Page = () => {
	const allPostsData = getSortedPostsData()
	return (
		<main>
			<h1>Le blog</h1>
			<ul>
				{allPostsData.map(({ id, date, title }) => (
					<li key={id}>
						<div>
							<Link href={`/blog/${id}`}>{title}</Link>
						</div>
						<small>{date}</small>
					</li>
				))}
			</ul>
		</main>
	)
}

export default Page
