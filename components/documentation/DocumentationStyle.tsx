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
	header {
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
			margin-top: 0.6rem;
			margin-bottom: 0.6rem;
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
	button {
		color: inherit;
	}
	span {
		background: inherit;
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
