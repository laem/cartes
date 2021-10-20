import emoji from 'react-easy-emoji'

export default ({ emojiBackground = '#ffffffa6', emojis }) => {
	const emojiComponents = emoji(emojis || '')
	return (
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
				key="emoji"
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
						key="background"
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
						key="emoji2"
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
	)
}
