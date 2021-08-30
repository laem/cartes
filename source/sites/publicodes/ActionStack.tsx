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
		<div
			css={`
				display: flex;
				@media (max-width: 800px) {
					flex-direction: column;
				}
			`}
		>
			<ActionConversation dottedName={actions.slice(-1)[0].dottedName} />
			<DesktopDiv>{stackLeft && <CancelButton />}</DesktopDiv>
			<div
				css={`
					text-align: center;
					display: flex;
					justify-content: center;
					align-content: center;
					height: 50vh;
					min-width: 30vw;
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
			{stackLeft && (
				<DesktopDiv>
					<CheckButton />
				</DesktopDiv>
			)}
			{stackLeft && (
				<MobileDiv>
					<div
						css={`
							display: flex;
							justify-content: center;
							margin-bottom: 2rem;
						`}
					>
						<CancelButton />
						<CheckButton />
					</div>
				</MobileDiv>
			)}
		</div>
	)
}

const DesktopDiv = styled.div`
	@media (max-width: 800px) {
		display: none;
	}
	display: flex;
	align-items: center;
`
const MobileDiv = styled.div`
	@media (min-width: 800px) {
		display: none;
	}
`

const StackButton = styled.button`
	font-size: 260%;
	display: flex;
	align-items: center;
`
