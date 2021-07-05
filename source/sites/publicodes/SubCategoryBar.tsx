import { motion } from 'framer-motion'
import emoji from 'react-easy-emoji'

const emojiBackground = '#ffffffa6'

export default ({ nodeValue, total, icons, color, title }) => {
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
}
