'use client'
import { RootState } from '@/reducers'

const emptySituation: Situation = {}

export const situationSelector = (objective: string) => (state: RootState) =>
	(objective != null && state.simulation[objective]?.situation) ??
	emptySituation

export const targetUnitSelector = (state: RootState) =>
	state.simulation?.targetUnit ?? '€/mois'
