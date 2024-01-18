'use client'

const width = '2.2rem'
export const quickSearchButtonStyle = (clicked, background, filter) => `
	& {
		border-radius: ${width};

		margin-right: 0.2rem;
		img {
			padding: 0.2rem 0.2rem 0.1rem 0.2rem;
		}
		border: 2px solid var(--lighterColor);
				text-align: center;
	}
	& > * {
		width: ${width};
		height: ${width};
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	& > * > img {
		padding: 0;
		margin: 0;
		width: 1.2rem;
		height: 1.2rem;
					vertical-align: middle;
					filter: ${
						filter ||
						`invert(16%) sepia(24%) saturate(3004%)
						hue-rotate(180deg) brightness(89%) contrast(98%)`
					};
	}
		background: ${!clicked ? background || 'white' : 'var(--lighterColor)'};

		${
			clicked &&
			`border-color: var(--darkColor) !important;

	img {
	${
		filter ||
		`
		filter: invert(23%) sepia(100%) saturate(1940%) hue-rotate(206deg)
			brightness(89%) contrast(84%)`
	};
	}`
		}

`
