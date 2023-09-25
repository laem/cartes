import styled from 'styled-components'

export const CardStyle = styled.div`
	-webkit-tap-highlight-color: transparent;

	font-size: 120%;
	position: relative;

	padding: 0;
	width: 13rem;
	height: 13rem;

	background: var(--lightestColor);
	${(p) => !p.formule && `background: var(--lighterColor)`};
	border: 4px solid var(--darkerColor);
	${(p) =>
		p.isChecked &&
		`border: 6px solid var(--color); 
				background: var(--lighterColor);`}
	outline: none;
	border-radius: 40px;
	transition: 0.13s ease-in-out;
	cursor: pointer;
	&:active {
		box-shadow: none;
		.button__content {
			box-shadow: none;
			.button__text,
			.button__icon {
				transform: translate3d(0px, 0px, 0px);
			}
		}
	}
	.button__content {
		position: relative;

		padding: 1.1rem 0.8rem;
		width: 100%;
		height: 100%;

		border-radius: 40px;
		transition: 0.13s ease-in-out;

		z-index: 1;
	}
	.button__icon {
		position: relative;
		font-size: 150%;

		transform: translate3d(0px, -4px, 0px);
		text-align: left;
		width: 6rem;
		height: 1.6rem;
		transition: 0.13s ease-in-out;
		letter-spacing: 0.6rem;
		svg {
			width: 32px;
			height: 32px;
			fill: #aaaaaa;
		}
	}
	.button__text {
		position: relative;

		transform: translate3d(0px, -4px, 0px);
		margin: 1rem 0 0.4rem;
		align-self: end;

		text-align: center;
		font-size: 100%;
		color: var(--darkestColor);
		transition: 0.13s ease-in-out;
	}
	.button__figure {
		font-weight: bold;
		margin: 0.6rem 0;
		display: ${(p) => (p.isChecked ? 'block' : 'none')};
		background: linear-gradient(var(--color1), var(--color2));
		width: 7rem;
		padding: 0.1rem 0.4rem;
		color: white;
		margin: 0 auto;
		border-radius: 0.4rem;
	}
`
