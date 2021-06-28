import { AnimatePresence, motion } from 'framer-motion'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useEngine } from '../../components/utils/EngineContext'
import { extractCategories } from './chart'

const emojiBackground = '#ffffffa6'

export default ({ category, color }) => {
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()
	const total = engine.evaluate(category).nodeValue
	const subCategories = extractCategories(
		rules,
		engine,
		null,
		category,
		true,
		false
	)

	const rest = subCategories.reduce(
			(memo, { nodeValue, title, icons }) =>
				nodeValue < 0.1 * total ? memo + nodeValue : memo,
			0
		),
		restWidth = (rest / total) * 100

	return (
		<InlineBarChart
			css={`
				border: 2px solid var(--lighterColor);
			`}
		>
			<AnimatePresence>
				{subCategories.map(({ nodeValue, title, icons }) => {
					const emojiComponents = emoji(icons || '')
					const percent = (nodeValue / total) * 100
					if (percent < 10) return null // will be unreadable
					return (
						<motion.li
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, width: `calc(${percent}% - 2px)` }}
							exit={{ width: 0, opacity: 0 }}
							transition={{ duration: 0.5 }}
							key={title}
							css={`
								border-right: 2px solid var(--lighterColor);
								background: ${color};
							`}
							title={title}
						>
							<span
								css={`
									position: relative;
									font-size: 110%;
									background: ${emojiBackground};
									border-radius: 2rem;
									height: 1.5rem;
									display: inline-block;
									width: 1.5rem;
									z-index: 6;
								`}
							>
								<span
									css={`
										img {
											vertical-align: -0.2em !important;
										}
									`}
								>
									{emojiComponents[0]}
								</span>
								{emojiComponents.length > 1 && (
									<>
										<span
											css={`
												z-index: -1;
												font-size: 70%;
												position: absolute;
												bottom: 0px;
												right: 0px;
												transform: translate(60%, 10%);
												background: ${emojiBackground};
												border-radius: 2rem;
												padding: 0.15rem;
												height: 1rem;
												width: 1rem;
											`}
										></span>
										<span
											css={`
												z-index: 7;
												font-size: 70%;
												position: absolute;
												bottom: 0px;
												right: 0px;
												transform: translate(60%, 10%);
												border-radius: 2rem;
												height: 1rem;
												width: 1rem;
												img {
													vertical-align: 0.1rem !important;
												}
											`}
										>
											{emojiComponents[1]}
										</span>
									</>
								)}
							</span>
						</motion.li>
					)
				})}
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
	)
}

const InlineBarChart = styled.ul`
	width: 100%;
	border-radius: 0.4rem;
	padding-left: 0;
	margin: 0;
	display: flex;
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
