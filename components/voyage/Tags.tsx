import {
	tagNameCorrespondance,
	tagValueCorrespondance,
} from '@/app/voyage/osmTagLabels'
import Emoji from '../Emoji'

export default function Tags({ tags }) {
	return (
		<ul
			css={`
				margin-top: 0.6rem;
				padding-left: 0.6rem;
				list-style-type: none;
				border-left: 4px solid var(--lightColor);
				line-height: 1.4rem;
			`}
		>
			{tags.map(([k, v]) => (
				<li key={k + v}>
					<span>
						{tagNameCorrespondance(k)} : {tagValueCorrespondance(v)}
					</span>
				</li>
			))}
		</ul>
	)
}

export function SoloTags({ tags }) {
	return (
		<ul
			css={`
				list-style-type: none;
				display: flex;
				align-items: center;
				li {
					margin-right: 0.6rem;
				}
				overflow: scroll;
				white-space: nowrap;
				margin-bottom: 0.2rem;
				scrollbar-width: none;
				&::-webkit-scrollbar {
					width: 0px;
					background: transparent; /* Disable scrollbar Chrome/Safari/Webkit */
				}
			`}
		>
			{tags.map((tag) => (
				<li key={tag}>{tag}</li>
			))}
		</ul>
	)
}
