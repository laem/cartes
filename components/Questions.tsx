'use client'
import Conversation, {
	ConversationProps,
} from 'Components/conversation/Conversation'
export default function Questions({
	customEndMessages,
	customEnd,
	orderByCategories,
	rules,
}: {
	customEndMessages?: ConversationProps['customEndMessages']
	orderByCategories: Array<Object>
}) {
	return (
		<>
			<div
				css={`
					@media (min-width: 800px) {
						margin-top: 0.6rem;
					}
					border-radius: 0.6rem;
				`}
			>
				<Conversation
					rules={rules}
					orderByCategories={orderByCategories}
					customEnd={customEnd}
					customEndMessages={customEndMessages}
				/>
			</div>
		</>
	)
}
