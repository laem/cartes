'use client'
import { RuleInputProps } from 'Components/conversation/RuleInput'
import { Rule } from 'publicodes'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import InputSuggestions from './InputSuggestions'

type DateInputProps = {
	onChange: RuleInputProps['onChange']
	id: RuleInputProps['id']
	onSubmit: RuleInputProps['onSubmit']
	value: RuleInputProps['value']
	suggestions: Rule['suggestions']
}

export default function DateInput({
	suggestions,
	onChange,
	id,
	onSubmit,
	value,
}: DateInputProps) {
	const dateValue = useMemo(() => {
		if (!value || typeof value !== 'string') return undefined
		const [day, month, year] = value.split('/')
		return `${year}-${month}-${day}`
	}, [value])

	const [start, setStart] = useState('19:00')
	const [end, setEnd] = useState('07:00')
	const [day, setDay] = useState(0)

	const setTime = (date, hhmm) => {
		const [hours, minutes] = hhmm.split(':')
		date.setHours(hours)
		date.setMinutes(minutes)
		return date
	}
	const shiftDays = (date, days) => {
		date.setDate(date.getDate() + days)
		return date
	}
	useEffect(() => {
		const date1 = setTime(new Date(), start),
			date2 = shiftDays(setTime(new Date(), end), day)
		if (date1 > date2) setDay(day + 1)
		const hours = Math.abs(date1 - date2) / 36e5

		onChange(Math.max(hours, 0.5))
	}, [start, end, day])
	return (
		<div
			className="step input"
			css={`
				padding-bottom: 1rem;
				input[type='time'] {
					width: 5.5rem;
				}
				input[type='radio'] {
					margin-right: 0.6rem;
				}
				fieldset label {
					margin-left: 1rem;
				}
			`}
		>
			<div>
				{suggestions && (
					<InputSuggestions
						suggestions={suggestions}
						onFirstClick={(clicked) => {
							const [text, value] = Object.entries(suggestions).find(
								([k, v]) => v.rawNode === clicked.rawNode
							)
							if (text.includes('demi-journée')) {
								setStart('14:00')
								setEnd('20:00')
								setDay(0)
							}
							if (text.includes('nuit')) {
								setStart('19:00')
								setEnd('07:00')
								setDay(1)
							}
							if (text.includes('24h')) {
								setStart('15:00')
								setEnd('15:00')
								setDay(1)
							}
						}}
						onSecondClick={() => null}
					/>
				)}
				<div>
					<label>
						Départ{' '}
						<DateStyledInput
							type="time"
							value={start}
							onChange={(e) => setStart(e.target.value)}
							className="ui__ input"
						/>
					</label>
				</div>
				<div>
					<label>
						Arrivée{' '}
						<DateStyledInput
							type="time"
							value={end}
							onChange={(e) => setEnd(e.target.value)}
							className="ui__ input"
						/>
					</label>
				</div>
				<fieldset>
					<label>
						<input
							type="radio"
							checked={day === 0}
							onChange={() => setDay(0)}
						/>{' '}
						le jour même
					</label>
					<label>
						<input
							type="radio"
							checked={day === 1}
							onChange={() => setDay(1)}
						/>
						le lendemain
					</label>
					<label>
						Jour +{' '}
						<input
							type="number"
							value={day}
							className="ui__"
							min="2"
							css={`
								width: 2rem !important;
								text-align: center;
							`}
							onChange={(e) => setDay(+e.target.value)}
						/>
					</label>
				</fieldset>
			</div>
		</div>
	)
}

const DateStyledInput = styled.input`
	font-family: 'Roboto', sans-serif;
	text-transform: uppercase;
	height: inherit;
`
