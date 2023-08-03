import { RuleLink as EngineRuleLink } from 'publicodes-react'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { EngineContext } from './utils/EngineContext'
import { SitePathsContext } from './utils/SitePathsContext'

export default function RuleLink(
	props: {
		dottedName: Object
		displayIcon?: boolean
	} & Omit<React.ComponentProps<Link>, 'to'>
) {
	const sitePaths = useContext(SitePathsContext)
	const engine = useContext(EngineContext)
	return (
		<EngineRuleLink
			{...props}
			engine={engine}
			linkComponent={Link}
			documentationPath={sitePaths.documentation.index}
		/>
	)
}
