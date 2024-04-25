import Icons from '@/app/voyage/icons/Icons'
import {
	tagNameCorrespondance,
	tagValueCorrespondance,
} from '@/app/voyage/osmTagLabels'

const isSecondary = ([k, v]) => k.startsWith('source:')
export default function Tags({ tags }) {
	return (
		<ul
			css={`
				margin-top: 0.6rem;
				padding-left: 0.6rem;
				list-style-type: none;
				border-left: 4px solid var(--lightColor);
				line-height: 1.4rem;
				img {
					opacity: 0.7;
				}
			`}
		>
			{tags.map(([raw, [k, v]]) => (
				<li
					key={k + v}
					css={`
						${isSecondary(Object.entries(raw)[0]) && `font-size: 80%`}
					`}
				>
					<Icons tags={raw} />
					<span>
						{tagNameCorrespondance(k)} : {tagValueCorrespondance(v)}
					</span>
				</li>
			))}
		</ul>
	)
}

export function SoloTags({ tags, iconsOnly, compact }) {
	return (
		<ul
			css={`
				list-style-type: none;
				display: flex;
				align-items: center;
				> li {
					margin-right: ${compact ? '0' : '0.6rem'};
					display: flex;
					align-items: center;
				}
				overflow: scroll;
				white-space: nowrap;
				margin-bottom: 0.2rem;
				scrollbar-width: none;
				&::-webkit-scrollbar {
					width: 0px;
					background: transparent; /* Disable scrollbar Chrome/Safari/Webkit */
				}
				opacity: 0.7;
				> li > span {
					line-height: 1.4rem;
				}
			`}
		>
			{tags.map(([raw, tag]) => (
				<li key={tag}>
					<Icons tags={raw} />
					{!iconsOnly && <span>{tag}</span>}
				</li>
			))}
		</ul>
	)
}
