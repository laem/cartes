import { AnimatePresence, motion } from 'framer-motion'
import emoji from 'react-easy-emoji'
import styled from 'styled-components'
import { extractCategories } from 'Components/publicodesUtils'
import SubCategoryBar from './SubCategoryBar'
import { shadowStyle } from './styles'

export default ({ rules, engine, sumToDisplay, color, total }) => {
	const subCategories = extractCategories(
		rules,
		engine,
		null,
		sumToDisplay,
		false
	)

	const rest = subCategories.reduce(
			(memo, { nodeValue, title, icons }) =>
				nodeValue < 0.1 * total ? memo + nodeValue : memo,
			0
		),
		restWidth = (rest / total) * 100

	return (
		<div>
			<InlineBarChart>
				<AnimatePresence>
					{subCategories.map(({ nodeValue, title, icons }) => (
						<SubCategoryBar {...{ nodeValue, title, icons, total, color }} />
					))}
					<li
						css={`
							width: ${restWidth}%;
							background: ${color};
							font-size: 200%;
							color: white;
							line-height: 0.3rem !important;
						`}
					>
						{restWidth > 7 ? '...' : ''}
					</li>
				</AnimatePresence>
			</InlineBarChart>
		</div>
	)
}

const InlineBarChart = styled.ul`
	width: 100%;
	border-radius: 0.4rem;
	padding-left: 0;
	margin: 0;
	display: flex;
	${shadowStyle};
	li {
		display: inline-block;
		text-align: center;
		list-style-type: none;
		height: 1.9rem;
		line-height: 1.4rem;
	}

	li:last-child {
		border-right: none;
	}
`
