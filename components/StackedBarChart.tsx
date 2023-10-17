'use client'
import {
	situationSelector,
	targetUnitSelector,
} from '@/selectors/simulationSelectors'
import useDisplayOnIntersecting from 'Components/utils/useDisplayOnIntersecting'
import Link from 'next/link'
import { EvaluatedNode } from 'publicodes'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import {
	BarItem,
	BarStack,
	BarStackLegend,
	BarStackLegendItem,
	SmallCircle,
} from './StackedBarChartUI'

type Precision = 1 | 0.1 | 0.01

function integerAndDecimalParts(value: number) {
	const integer = Math.floor(value)
	const decimal = value - integer
	return { integer, decimal }
}

/**
 * Produces integers only.
 */
function simpleRoundedPer(values: Array<number>, logScale: number) {
	const scale = Math.pow(10, 2 - logScale) // 100, 1000, 10000
	const sum = (a = 0, b: number) => a + b
	const total = values.reduce(sum, 0)
	// By default we are talking percentages, but this can be per-mille or more
	const perscalages = values.map((value) =>
		integerAndDecimalParts((value / total) * scale)
	)
	const totalRoundedPerscalage = perscalages
		.map((v) => v.integer)
		.reduce(sum, 0)
	const indexesToIncrement = perscalages
		.map((percentage, index) => ({ ...percentage, index }))
		.sort((a, b) => b.decimal - a.decimal)
		.map(({ index }) => index)
		.splice(0, scale - totalRoundedPerscalage)

	return perscalages.map(
		({ integer }, index) =>
			integer + (indexesToIncrement.includes(index) ? 1 : 0)
	)
}

/**
 * Calculates rounded percentages so that the sum of all returned values is
 * always 100. For instance: [60, 30, 10] or [60.1, 30, 9.9] depending on the
 * precision.
 */
export function roundedPercentages(
	values: Array<number>,
	precision: Precision
) {
	const logScale = Math.log10(precision)
	return simpleRoundedPer(values, logScale).map(
		(int) => int / Math.pow(10, -logScale)
	)
}

type InnerStackedBarChartProps = {
	data: Array<{
		color?: string
		value: EvaluatedNode['nodeValue']
		legend: React.ReactNode
		key: string
	}>
	precision: Precision
}

export function StackedBarChart({
	data,
	precision,
	percentageFirst = true,
}: InnerStackedBarChartProps) {
	const percentages = roundedPercentages(
		data.map((d) => (typeof d.value === 'number' && d.value) || 0),
		precision
	)
	const dataWithPercentage = data.map((data, index) => ({
		...data,
		percentage: percentages[index],
	}))

	return (
		<>
			<BarStack className="print-background-force">
				{dataWithPercentage
					// <BarItem /> has a border so we don't want to display empty bars
					// (even with width 0).
					.filter(({ percentage }) => percentage !== 0)
					.map(({ key, color, percentage }) => (
						<BarItem
							style={{
								width: `${percentage}%`,
								backgroundColor: color || 'green',
							}}
							key={key}
						/>
					))}
			</BarStack>
			<BarStackLegend className="print-background-force">
				{dataWithPercentage.map(({ key, percentage, color, legend, value }) => {
					const formatter = (val) =>
							Intl.NumberFormat('fr-FR', {
								maximumSignificantDigits: ('' + precision).length - 1,
							}).format(val),
						displayValue = formatter(value) + ' €', // TODO to genericize one day, easy
						displayPercentage = formatter(percentage) + ' %'
					return (
						<BarStackLegendItem key={key} title={value}>
							<SmallCircle style={{ backgroundColor: color }} />
							{legend}
							<strong
								title={percentageFirst ? displayValue : displayPercentage}
							>
								{percentageFirst ? displayPercentage : displayValue}
							</strong>
						</BarStackLegendItem>
					)
				})}
			</BarStackLegend>
		</>
	)
}

type StackedRulesChartProps = {
	data: Array<{ color?: string; dottedName: string; title?: string }>
	precision?: Precision
	engine: object
	situation: object
	percentageFirst: boolean
}

export default function StackedRulesChart({
	data,
	precision = 0.1,
	engine,
	percentageFirst,
}: StackedRulesChartProps) {
	const targetUnit = useSelector(targetUnitSelector)
	const situation = useSelector(situationSelector)
	const evaluatedData = data.map(({ dottedName, title, color }) => {
		const rule = engine.getRule(dottedName)

		return {
			key: dottedName,
			value: engine
				.setSituation(situation)
				.evaluate({ valeur: dottedName, unité: targetUnit }).nodeValue,
			legend: <span>{title || rule.title}</span>,
			color,
		}
	})

	return (
		<StackedBarChart
			precision={precision}
			data={evaluatedData}
			percentageFirst={percentageFirst}
		/>
	)
}
