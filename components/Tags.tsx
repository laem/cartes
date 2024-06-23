import Icons from '@/app/icons/Icons'
import {
	tagNameCorrespondance,
	tagValueCorrespondance,
} from '@/app/osmTagLabels'

const beginningsOfSecondaryTags = ['source:', 'fixme:', 'note', 'ref:']

const isSecondary = ([k, v]) =>
	beginningsOfSecondaryTags.some((begining) => k.startsWith(begining))

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
				display: flex;
				flex-direction: column;
			`}
		>
			{tags.map(([raw, [k, v]], i) => (
				<li
					key={k + v}
					css={`
						${isSecondary(Object.entries(raw)[0]) &&
						`font-size: 80%; order: ${1000 + i}`}
					`}
				>
					<Icons tags={raw} />
					<span>
						<span>{tagNameCorrespondance(k)}</span> :{' '}
						<span>{tagValueCorrespondance(v)}</span>
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
