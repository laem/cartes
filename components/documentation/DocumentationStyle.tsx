'use client'
import styled from 'styled-components'

export default styled.div`
	padding: 0 0.6rem;
	margin-bottom: 1rem;
	#documentation-rule-root > p:first-of-type {
		display: inline-block;
		background: var(--lighterColor);
		padding: 0.4rem 0.6rem 0.2rem;
	}
	section {
		margin-top: 1rem;
	}
	> header:first-child {
		color: var(--textColor);
		small {
			color: inherit;
		}
		a {
			color: var(--textColor);
		}
		a:hover {
			background: var(--darkerColor) !important;
			color: white !important;
		}
		h1 {
			color: inherit;
			margin-top: 0rem;
			margin-bottom: 0.4rem;
			a {
				text-decoration: none;
			}
		}
		background: linear-gradient(60deg, var(--darkColor) 0%, var(--color) 100%);
		padding: 0.6rem 1rem;
		box-shadow: 0 1px 3px rgba(var(--rgbColor), 0.12),
			0 1px 2px rgba(var(--rgbColor), 0.24);
		border-radius: 0.4rem;
	}

	small {
		background: none !important;
	}
	li {
		&.active .content {
			background-color: transparent !important;
			a:hover {
				color: white !important;
			}
		}
	}
	#documentation-rule-root > article {
		max-width: 800px;
	}
`
export const Wrapper = styled.div`
	max-width: calc(800px + 1.2rem);
	margin: 0 auto;
`
export const QuestionRuleSectionStyle = styled.section`
	display: flex;
	justify-content: center;
	align-items: center;
	@media (max-width: 800px) {
		flex-wrap: wrap;
	}
	h3 {
		font-size: 100%;
		min-width: 14rem;
		margin: 1rem;
	}
`

export const VariableList = styled.ul`
	padding-left: 2rem;
`

export const RightSection = styled.section`
	margin: 1rem 0;
	display: block;
	text-align: right;
`

export const QuestionStyle = styled.q`
	font-size: 180%;
	quotes: '«' '»' '‹' '›';
`

export const ExplainedHeader = styled.header`
	display: flex;
	align-items: baseline;
	h2 {
		margin-right: 1rem;
	}
	small {
		color: var(--lighterColor);
	}
`

export const ExemplesList = styled.ul`
	list-style-type: none;
	li button {
		display: flex;
		align-items: center;
		margin: 0.4rem 0;
		padding: 0;
	}
`

const size = '1.2rem'
export const Circle = styled.span`
	display: inline-block;
	border: 2px solid var(--lightColor);
	width: ${size};
	height: ${size};

	border-radius: ${size};

	margin: 0 0.4rem;
	${(p) => p.$clicked && `background: var(--lightColor)`}
`

export const ExempleTitle = styled.span`
	padding: 0 0.4rem;
	text-align: left;
	${(p) => p.$clicked && `background: var(--lightColor); color: black`}
`
