'use client'

import useSetSearchParams from '@/components/useSetSearchParams'
import { useState } from 'react'
import { initialDate } from '../GareInfo'
import { DialogButton } from '../UI'

export default function DateSelector({ date }) {
	const [localDate, setLocalDate] = useState(date)
	const setSearchParams = useSetSearchParams()
	return (
		<div
			css={`
				display: flex;
				align-items: center;
				> input {
					margin-right: 0.4rem !important;
					font-size: 110%;
					height: 1.4rem;
					padding: 0 0.2rem;
					color: var(--darkerColor);
					border: 2px solid var(--darkColor);
					border-radius: 0.15rem;
				}
			`}
		>
			<input
				type="datetime-local"
				id="trainDate"
				name="trainDate"
				value={localDate}
				min={initialDate}
				onChange={(e) => {
					const value = e.target.value
					// changing e.g. the weekday starting with the 0 diigt with the keyboard will make value '' on firefox, LOL
					if (value !== '') setLocalDate(e.target.value)
				}}
			/>
			{date !== localDate && (
				<DialogButton
					onClick={() => setSearchParams({ date: encodeDate(localDate) })}
					css={`
						font-size: 100%;
					`}
				>
					OK
				</DialogButton>
			)}
		</div>
	)
}

export const encodeDate = (date) => date?.replace(/:/, 'h')
export const decodeDate = (date) => date?.replace(/h/, ':')
