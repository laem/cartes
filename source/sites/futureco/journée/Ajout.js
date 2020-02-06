import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import Search from '../Search'
import SearchSuggestions from '../Suggestions'
import Suggestions from './Suggestions'

export default ({ items }) => {
	const [input, setInput] = useState('')

	const rules = useSelector(flatRulesSelector)
	return (
		<div
			css={`
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				flex-direction: column;
				text-align: center;
				max-width: 30rem;
				margin: 0 auto;

				small {
					margin-bottom: 1rem;
				}
			`}
		>
			<h1>Qu'as-tu fait aujourd'hui&nbsp;?</h1>
			<Suggestions rules={rules} />
			<small>Autre chose</small>
			<Search {...{ input, setInput }} />
			{input && <SearchSuggestions {...{ input }} />}
		</div>
	)
}
