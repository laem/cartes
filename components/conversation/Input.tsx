'use client'
import { Evaluation, serializeUnit, Unit } from 'publicodes'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { NumericFormat } from 'react-number-format'
import { currencyFormat, debounce } from 'Components/utils/utils'
import InputSuggestions from './InputSuggestions'
import { InputCommonProps } from './RuleInput'
import { InputStyle } from './UI'

// TODO: fusionner Input.js et CurrencyInput.js
export default function Input({
	suggestions,
	onChange,
	onSubmit,
	id,
	value,
	missing,
	unit,
	autoFocus,
	noSuggestions,
}: InputCommonProps & {
	onSubmit: (source: string) => void
	unit: Unit | undefined
	value: Evaluation<number>
}) {
	const debouncedOnChange = useCallback(debounce(550, onChange), [])
	const { language } = useTranslation().i18n
	const unité = serializeUnit(unit)
	const { thousandSeparator, decimalSeparator } = currencyFormat(language)

	return (
		<>
			<div>
				<div>
					{!noSuggestions && (
						<InputSuggestions
							suggestions={suggestions}
							onFirstClick={(value) => {
								onChange(value)
							}}
							onSecondClick={() => onSubmit?.('suggestion')}
						/>
					)}

					<InputStyle>
						<NumericFormat
							autoFocus={autoFocus}
							id={id}
							thousandSeparator={thousandSeparator}
							decimalSeparator={decimalSeparator}
							allowEmptyFormatting={true}
							// We don't want to call `onValueChange` in case this component is
							// re-render with a new "value" prop from the outside.
							onValueChange={({ floatValue }) => {
								debouncedOnChange(
									floatValue != undefined ? { valeur: floatValue, unité } : {}
								)
							}}
							autoComplete="off"
							{...{ [missing ? 'placeholder' : 'value']: value ?? '' }}
						/>
					</InputStyle>
					<span className="suffix">&nbsp;{unité}</span>
				</div>
			</div>
		</>
	)
}
