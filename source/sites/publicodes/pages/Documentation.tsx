import { goBackToSimulation } from 'Actions/actions'
import SearchBar from 'Components/SearchBar'
import SearchButton from 'Components/SearchButton'
import { EngineContext } from 'Components/utils/EngineContext'
import { ScrollToTop } from 'Components/utils/Scroll'
import { Documentation, getDocumentationSiteMap } from 'publicodes-react'
import { useCallback, useContext, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import Meta from '../../../components/utils/Meta'
import BandeauContribuer from '../BandeauContribuer'
import Méthode from './Méthode'
import styled from 'styled-components'

export default function RulePage() {
	const currentSimulation = useSelector(
		(state: RootState) => !!state.simulation?.url
	)
	const engine = useContext(EngineContext)
	const documentationPath = '/documentation'
	const { pathname } = useLocation()
	const documentationSitePaths = useMemo(
		() => getDocumentationSiteMap({ engine, documentationPath }),
		[engine, documentationPath]
	)
	console.log(documentationSitePaths)
	const { i18n } = useTranslation()

	if (pathname === '/documentation') {
		return <DocumentationLanding />
	}
	if (!documentationSitePaths[pathname]) {
		return <Redirect to="/404" />
	}
	return (
		<DocumentationStyle>
			<ScrollToTop key={pathname} />
			<div
				css={`
					display: flex;
					margin-top: 2rem;
					justify-content: space-between;
				`}
			>
				{currentSimulation ? <BackToSimulation /> : <span />}
				<SearchButton key={pathname} />
			</div>
			<Documentation
				language={i18n.language as 'fr' | 'en'}
				engine={engine}
				documentationPath={documentationPath}
			/>
			{/* <button>Voir l</button> */}
			<BandeauContribuer />
		</DocumentationStyle>
	)
}
function BackToSimulation() {
	const dispatch = useDispatch()
	const handleClick = useCallback(() => {
		dispatch(goBackToSimulation())
	}, [])
	return (
		<button
			className="ui__ simple small push-left button"
			onClick={handleClick}
		>
			← <Trans i18nKey="back">Reprendre la simulation</Trans>
		</button>
	)
}

function DocumentationLanding() {
	return (
		<>
			<Meta
				title="Comprendre nos calculs"
				description="Notre modèle de calcul est entièrement transparent. Chacun peut l'explorer, donner son avis, l'améliorer."
			/>
			<Méthode />
			<h2>Explorer notre documentation</h2>
			<SearchBar showListByDefault={true} />
		</>
	)
}

export const DocumentationStyle = styled.div`
	max-width: 850px;
	margin: 0 auto;
	small {
		background: none !important;
	}

	div[name='somme'] > div > div:nth-child(2n) {
		background: var(--darkerColor);
	}
`
