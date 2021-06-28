import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useEngine } from '../../components/utils/EngineContext'
import { extractCategories } from './chart'

const emojiBackground = '#ffffffa6'

export default ({ total, category, color }) => {
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()
	const subCategories = extractCategories(
		rules,
		engine,
		null,
		category,
		true,
		false
	)
	console.log(total, subCategories)

	return (
		<InlineBarChart
			css={`
				border: 2px solid var(--lighterColor);
				background: ${color};
			`}
		>
			{subCategories.map(({ nodeValue, title, icons }) => {
				const emojiComponents = emoji(icons || '')
				return (
					<li
						key={title}
						css={`
							width: calc(${(nodeValue / total) * 100}% - 10px);
							border-right: 2px solid var(--lighterColor);
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
					</li>
				)
			})}
		</InlineBarChart>
	)
}

const InlineBarChart = styled.ul`
	display: flex;
	justify-content: space-evenly;
	width: 100%;
	border-radius: 0.4rem;
	padding-left: 0;
	margin: 0;
	li {
		text-align: center;
		list-style-type: none;
		min-width: 2.4rem;
		height: 1.9rem;
		line-height: 1.4rem;
	}

	li:last-child {
		border-right: none;
	}
`
