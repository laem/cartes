import { goBackToSimulation } from 'Actions/actions'
import SearchBar from 'Components/SearchBar'
import SearchButton from 'Components/SearchButton'
import { EngineContext } from 'Components/utils/EngineContext'
import { ScrollToTop } from 'Components/utils/Scroll'
import { RulePage, getDocumentationSiteMap } from 'publicodes-react'
import { ComponentType, useCallback, useContext, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, Link } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import Meta from '../../../components/utils/Meta'
import BandeauContribuer from '../BandeauContribuer'
import Méthode from './Méthode'
import styled from 'styled-components'
import Helmet from 'react-helmet'
import { Markdown } from 'Components/utils/markdown'
import { Route, Routes, useNavigate, useParams } from 'react-router'
import References from './DocumentationReferences'
import TopBar from '../../../components/TopBar'
import { configSelector } from '../../../selectors/simulationSelectors'
import { currentSimulationSelector } from '../../../selectors/storageSelectors'

export default function ({
	documentationPath = '/documentation',
	engine: givenEngine,
	embedded,
}) {
	const currentSimulation = useSelector(
		(state: RootState) => !!state.simulation?.url
	)
	const engine = givenEngine || useContext(EngineContext)
	const { pathname } = useLocation()
	const documentationSitePaths = useMemo(
		() => getDocumentationSiteMap({ engine, documentationPath }),
		[engine, documentationPath]
	)

	if (pathname === '/documentation') {
		return <DocumentationLanding />
	}
	if (false && !documentationSitePaths[pathname]) {
		return <Redirect to="/404" />
	}
	return (
		<div className="ui__ container">
			{!embedded && (
				<>
					<TopBar />
					<div
						css={`
							display: flex;
							margin-right: 1rem;
							justify-content: space-between;
						`}
					>
						{currentSimulation ? <BackToSimulation /> : <span />}
						<SearchButton key={pathname} />
					</div>
				</>
			)}
			<Routes>
				<Route
					path="*"
					element={<DocPage {...{ documentationPath, engine }} />}
				/>
			</Routes>

			<BandeauContribuer />
		</div>
	)
}
const DocPage = ({ documentationPath, engine }) => {
	const url = useParams()['*']
	const { i18n } = useTranslation()
	return (
		<DocumentationStyle>
			<RulePage
				language={i18n.language as 'fr' | 'en'}
				rulePath={url}
				engine={engine}
				documentationPath={documentationPath}
				renderers={{
					Head: Helmet,
					Link: Link,
					Text: Markdown,
					References,
				}}
			/>
		</DocumentationStyle>
	)
}
function BackToSimulation() {
	const url = useSelector(currentSimulationSelector)?.url
	const navigate = useNavigate()

	return (
		<button
			className="ui__ simple small push-left button"
			onClick={() => {
				navigate(url)
			}}
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
	padding: 0 0.6rem;
	#documentationRuleRoot > p:first-of-type {
		display: inline-block;
		background: var(--darkerColor);
		padding: 0.4rem 0.6rem 0.2rem;
	}
	header {
		color: var(--textColor);
		a {
			color: var(--textColor);
		}

		h1 {
			margin-top: 0.6rem;
			margin-bottom: 0.6rem;
			a {
				text-decoration: none;
			}
		}
		background: linear-gradient(60deg, var(--darkColor) 0%, var(--color) 100%);
		padding: 0.6rem 1rem;
		box-shadow: 0 1px 3px rgba(var(--rgbColor), 0.12),
			0 1px 2px rgba(var(--rgbColor), 0.24);
		border-radius: 0.4rem;
	}
	button {
		color: inherit;
	}
	span {
		background: inherit;
	}
	small {
		background: none !important;
	}

	div[name='somme'] > div > div:nth-child(2n) {
		background: var(--darkerColor);
	}
`
