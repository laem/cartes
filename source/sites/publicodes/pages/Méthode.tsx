import { Markdown } from 'Components/utils/markdown'
import content from 'raw-loader!./méthode.md'

// we're using markdown here so that non coder can change text
// if useful, extend this to other documentation pages
export default function Méthode() {
	return (
		<div css="img:not(.emoji){max-width: 10rem; margin: 1.6rem auto; display: block; }">
			<Markdown source={content} />
		</div>
	)
}
