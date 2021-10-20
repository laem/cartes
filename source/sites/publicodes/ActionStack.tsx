import { motion } from 'framer-motion'
import React, { useState, Children } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Card } from './ActionCard'
import ActionConversation from './ActionConversation'
import { ActionGameCard } from './ActionVignette'

// basic default styles for container
const Frame = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
`

export default ({ onVote, actions, total }) => {
	const [stack, setStack] = useState(actions)

	const rules = useSelector((state) => state.rules)

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

	const stackTop = stack.slice(-1)[0].dottedName
	const stackLeft = stack.length > 0
	console.log('stacktop', stackTop)

	return (
		<div>
			<ActionConversation key={stackTop} dottedName={stackTop} />
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
					<Frame>
						{stack.map((item, index) => {
							const fromUserIndex = stack.length - 1 - index,
								isTop = fromUserIndex === 0
							return (
								<Card
									css={fromUserIndex > 4 ? 'display: none' : ''}
									drag={isTop} // Only top card is draggable
									key={item.dottedName}
									onVote={(result) => handleVote(item, result)}
								>
									<Item
										className="plop"
										key={item.dottedName}
										keyString={item.dottedName}
										data-value={item.dottedName}
										whileTap={{ scale: 1.15 }}
									>
										<ActionGameCard
											key={item.dottedName}
											rule={rules[item.dottedName]}
											evaluation={item}
											total={total}
										/>
									</Item>
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
const Item = styled(motion.div)`
	width: 16rem;
	height: 21rem;
	@media (max-width: 800px) {
		width: 13rem;
		height: 18rem;
	}

	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
	border-radius: 8px;
	padding: 1rem 0.4rem;
	transform: ${({ keyString }) => {
		let rotation = cachedRandom(keyString) * 10 + -5
		return `rotate(${rotation}deg)`
	}};
`

const randomCache = {}
const cachedRandom = (key) => {
	if (randomCache[key]) return randomCache[key]
	else randomCache[key] = Math.random()
	return randomCache[key]
}
