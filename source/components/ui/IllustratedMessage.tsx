import emoji from 'react-easy-emoji'
export default ({ emoji: e, message }) => (
	<div
		css={`
			max-width: 20rem;
			margin: 0 auto;
			display: flex;
			flex-direction: column;
			align-items: center;
			img {
				font-size: 300%;
			}
		`}
	>
		{emoji(e)}
		{message}
	</div>
)
