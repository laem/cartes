'use client'
import { RootState } from '@/reducers'

const emptySituation: Situation = {}

export const situationSelector = objective => (state: RootState) =>
	state.simulation?[objective].situation ?? emptySituation

export const targetUnitSelector = (state: RootState) =>
	state.simulation?.targetUnit ?? '€/mois'
