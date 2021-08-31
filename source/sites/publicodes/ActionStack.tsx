import { motion } from 'framer-motion'
import React, { useState, Children } from 'react'
import emoji from 'react-easy-emoji'
import styled from 'styled-components'
import { Card } from './ActionCard'
import ActionConversation from './ActionConversation'

// basic default styles for container
const Frame = styled.div`
	width: 100%;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
`

export default ({ onVote, children, actions, ...props }) => {
	const [stack, setStack] = useState(Children.toArray(children))

	// return new array with last item removed
	const pop = (array) => {
		return array.filter((_, index) => {
			return index < array.length - 1
		})
	}

	const handleVote = (item, vote) => {
		// update the stack
		let newStack = pop(stack)
		setStack(newStack)

		// run function from onVote prop, passing the current item and value of vote
		onVote(item, vote)
	}

	const stackLeft = stack.length > 0
	const CancelButton = () => (
			<StackButton onClick={() => handleVote(stack[stack.length - 1], false)}>
				{emoji('❌')}
			</StackButton>
		),
		CheckButton = () => (
			<StackButton onClick={() => handleVote(stack[stack.length - 1], false)}>
				{emoji('✅')}
			</StackButton>
		)

	return (
		<div>
			<ActionConversation dottedName={actions.slice(-1)[0].dottedName} />
			<div
				css={`
					display: flex;
				`}
			>
				{stackLeft && <CancelButton />}
				<div
					css={`
						text-align: center;
						display: flex;
						justify-content: center;
						align-content: center;
						height: 50vh;
						min-width: 80%;
					`}
				>
					<Frame {...props}>
						{stack.map((item, index) => {
							const fromUserIndex = stack.length - 1 - index,
								isTop = fromUserIndex === 0
							return (
								<Card
									css={fromUserIndex > 4 ? 'display: none' : ''}
									drag={isTop} // Only top card is draggable
									key={item.key || index}
									onVote={(result) => handleVote(item, result)}
								>
									{item}
								</Card>
							)
						})}
					</Frame>
				</div>
				{stackLeft && <CheckButton />}
			</div>
		</div>
	)
}

const AnimatedButton = (props) => (
	<motion.button
		whileHover={{ scale: 1.1 }}
		whileTap={{ scale: 0.8 }}
		{...props}
	/>
)

const StackButton = styled(AnimatedButton)`
	font-size: 260%;
	display: flex;
	align-items: center;
	padding: 0;
	@media (max-width: 800px) {
		font-size: 180%;
	}
`
