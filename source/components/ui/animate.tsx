import { motion } from 'framer-motion'

export const appear = ({ children, delay = 0 }: Props) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.8 }}
		animate={{ opacity: 1, scale: 1 }}
		transition={{ delay }}
		exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
	>
		{children}
	</motion.div>
)

// Todo : better animate with fromRight on desktop
export const fromBottom = ({ children, delay = 0 }: Props) => (
	<motion.div
		initial={{ opacity: 0, y: 200, scale: 0.3 }}
		animate={{ opacity: 1, y: 0, scale: 1 }}
		transition={{ delay }}
		exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
	>
		{children}
	</motion.div>
)
export const fromTop = ({ children, delay = 0 }: Props) => (
	<motion.div
		initial={{ opacity: 0, y: -50, scale: 0.3 }}
		animate={{ opacity: 1, y: 0, scale: 1 }}
		transition={{ delay }}
		exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
	>
		{children}
	</motion.div>
)

export default {
	appear,
	fromBottom,
	fromTop,
}
