import {
	DottedName,
	NGCRule,
	NGCRules,
	splitName,
} from '@/components/utils/publicodesUtils'
import { Markdown } from 'Components/utils/ClientMarkdown'
import { capitalise0, omit } from 'Components/utils/utils'
import FriendlyObjectViewer from '../FriendlyObjectViewer'
import { Breadcrumb } from './Breadcrumb'
import DocumentationStyle, {
	QuestionRuleSectionStyle,
	QuestionStyle,
	Wrapper,
} from './DocumentationStyle'
import { GithubContributionLink } from './GithubContributionLink'
import { NamespaceRules } from './NamespaceRules'
import OperationVariables from './OperationVariables'
import References from './References'

/*
 * This page can be seen as a rewrite of publicodes-react's DocPage.
 * The first purpose is to be able to display meaningful content to searche engines without parsing the rules.
 * The second is that I'm not sure relying on the generic publicodes-react's page suffices for our needs here on nosgestesclimat.
 * Publicodes-react could be the generic "getting started" doc package, then forked when projects go big.
 * Hence, the solution could be to provide functions that enable lib users to create their custom pages.
 * E.g. the Breadcrumb component hidden here not exposed https://github.com/betagouv/publicodes/blob/master/packages/react-ui/source/rule/Header.tsx
 *
 */

const QuestionRuleSection = ({ title, children }) => (
	<QuestionRuleSectionStyle>
		<h3>{title}</h3>
		{children}
	</QuestionRuleSectionStyle>
)

export default function QuickDocumentationPage({
	dottedName,
	setLoadEngine,
	rules,
}: {
	rule: NGCRule
	dottedName: DottedName
	setLoadEngine: (value: boolean) => void
	rules: NGCRules
}) {
	const rule = rules[dottedName]
	const split = splitName(dottedName)
	const title = rule.titre ?? capitalise0(split[splitName.length - 1])

	const yamlAttributesToDisplay = omit(
		[
			'couleur',
			'icônes',
			'résumé',
			'abréviation',
			'exposé',
			'question',
			'description',
			'note',
			'titre',
			'références',
			// specific to NGC actions
			'effort',
			'inactive',
			// specific to NGC form generation, could be cool to visualize, but in a <details> tag, since it's big
			'mosaique',
		],
		rule
	)

	return (
		<Wrapper>
			<DocumentationStyle>
				<header id="shareImage">
					<Breadcrumb dottedName={dottedName} rules={rules} />
					<h1>
						{rule.icônes ?? ''} {title}&gt;
					</h1>
				</header>
				{rule.question && (
					<>
						<QuestionRuleSection title="💬 Question pour l'utilisateur">
							<QuestionStyle>{rule.question}</QuestionStyle>
						</QuestionRuleSection>
						{rule.description && (
							<QuestionRuleSection title="ℹ️ Aide à la saisie">
								<Markdown>{rule.description}</Markdown>
							</QuestionRuleSection>
						)}
					</>
				)}
				{!rule.question && (
					<section>
						{rule.description && <Markdown>{rule.description}</Markdown>}
					</section>
				)}
				{false && (
					<button
						onClick={() => setLoadEngine(true)}
						className="ui__ button cta plain attention"
					>
						🧮 Lancer le calcul
					</button>
				)}
				{Object.keys(yamlAttributesToDisplay).length > 0 && (
					<div>
						<h2>Comment cette donnée est-elle calculée ?</h2>

						<FriendlyObjectViewer
							data={yamlAttributesToDisplay}
							context={{ dottedName, rules }}
						/>
					</div>
				)}

				<div>
					<h2>Explorer le calcul</h2>
					<OperationVariables {...{ rule, rules, dottedName }} />
				</div>
				{rule.note && (
					<div>
						<h2>Notes</h2>
						<Markdown>{rule.note}</Markdown>
					</div>
				)}
				{rule.références && (
					<div>
						<h2>Références</h2>
						<References references={rule.références} />
					</div>
				)}

				<GithubContributionLink dottedName={dottedName} />
				<NamespaceRules {...{ rules, dottedName }} />
			</DocumentationStyle>
		</Wrapper>
	)
}
