import { motion } from 'framer-motion'
import { useState } from 'react'
import CircledEmojis from '../../components/CircledEmojis'
import { findContrastedTextColor } from '../../components/utils/colors'

export default ({ nodeValue, total, icons, color, title }) => {
	const [clicked, click] = useState(false)
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
				cursor: pointer;
			`}
			title={title}
			onClick={() => click(!clicked)}
		>
			{clicked ? (
				<span
					key={title}
					css={`
						color: ${findContrastedTextColor(color, true)};
					`}
				>
					{title}
				</span>
			) : (
				<CircledEmojis emojis={icons} />
			)}
		</motion.li>
	)
}
