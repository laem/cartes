import { RuleInputProps } from 'Components/conversation/RuleInput'
import { Rule } from 'publicodes'
import { useCallback, useEffect, useMemo, useState } from 'react'
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

	const handleDateChange = useCallback(
		(evt) => {
			if (!evt.target.value) {
				return onChange(null)
			}
			const [year, month, day] = evt.target.value.split('-')
			if (+year < 1700) {
				return
			}
			if (year.length > 4) {
				return
			}
			if ([day, month, year].some((x) => Number.isNaN(+x))) {
				return
			}
			onChange(`${day}/${month}/${year}`)
		},
		[onChange]
	)
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

		onChange(hours)
	}, [start, end, day])
	return (
		<div className="step input">
			<div>
				{suggestions && (
					<InputSuggestions
						suggestions={suggestions}
						onFirstClick={(value) => {
							onChange(value)
						}}
						onSecondClick={() => onSubmit?.('suggestion')}
					/>
				)}
				<label>
					Départ à
					<DateStyledInput
						type="time"
						value={start}
						onChange={(e) => setStart(e.target.value)}
						className="ui__ input"
					/>
				</label>
				<label>
					Arrivée à
					<DateStyledInput
						type="time"
						value={end}
						onChange={(e) => setEnd(e.target.value)}
						className="ui__ input"
					/>
				</label>
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
						<input
							type="radio"
							checked={day === 2}
							onChange={() => setDay(2)}
						/>
						le surlendemain
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
