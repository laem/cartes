'use client'
import { RootState } from '@/reducers'

const emptySituation: Situation = {}

export const situationSelector = (state: RootState) =>
	state.simulation?.situation ?? emptySituation

export const targetUnitSelector = (state: RootState) =>
	state.simulation?.targetUnit ?? '€/mois'
