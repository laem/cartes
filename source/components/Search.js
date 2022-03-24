import Emoji from 'Components/Emoji'
export default ({ setInput, input }) => (
	<div
		css={`
			display: flex;
			align-items: center;
		`}
	>
		<span
			css={`
				font-size: 250%;
				transform: scale(-1, 1) translateY(15%);
			`}
		>
			<Emoji e="🔍" />
		</span>
		<input
			css={`
				display: inline-block;
				width: 80%;
				border: 1px solid rgba(41, 117, 209, 0.12);
				font-size: 200%;
				border-radius: 1rem;
				padding: 0 0.6rem;
			`}
			type="search"
			value={input}
			onChange={(event) => {
				setInput(event.target.value)
			}}
		/>
	</div>
)
