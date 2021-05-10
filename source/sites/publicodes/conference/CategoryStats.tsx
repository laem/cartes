export default ({ categories, maxCategory }) => (
	<ul
		css={`
			> li:nth-child(2n + 1) {
				background: var(--lightestColor);
			}
			list-style-type: none;
			li > span {
				padding-left: 0.6rem;
				width: 30%;
				display: inline-block;
				border-right: 1px solid var(--lightColor);
			}

			ul {
				list-style-type: none;
				display: inline-block;
				position: relative;
				width: 65%;
			}
			ul li {
				position: absolute;
				width: 8px;
				height: 8px;
				display: inline-block;
				background: black;
				border-radius: 1rem;
				opacity: 0.2;
			}
		`}
	>
		{Object.entries(categories).map(([name, values]) => (
			<li key={name}>
				<span>{name}</span>
				<ul>
					{values.map((value) => (
						<li
							key={value}
							css={`
								left: ${(value / maxCategory) * 100}%;
							`}
						></li>
					))}
				</ul>
			</li>
		))}
	</ul>
)
