import {
	DottedName,
	NGCRule,
	NGCRules,
	title as ruleTitle,
} from '@/components/utils/publicodesUtils'
import { Markdown } from 'Components/utils/ClientMarkdown'
import { omit } from 'Components/utils/utils'
import FriendlyObjectViewer from '../FriendlyObjectViewer'
import { Breadcrumb } from './Breadcrumb'
import ComputeButton from './ComputeButton'
import DocumentationStyle, {
	QuestionRuleSectionStyle,
	QuestionStyle,
	Wrapper,
} from './DocumentationStyle'
import Exemples from './Exemples'
import { GithubContributionLink } from './GithubContributionLink'
import { NamespaceRules } from './NamespaceRules'
import OperationVariables, { isExpressionRule } from './OperationVariables'
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
	pathPrefix = '',
}: {
	rule: NGCRule
	dottedName: DottedName
	setLoadEngine: (value: boolean) => void
	rules: NGCRules
}) {
	const rule = rules[dottedName] || {}

	const title = ruleTitle({ ...rule, dottedName })

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
			'exemples',
		],
		rule
	)

	return (
		<Wrapper>
			<DocumentationStyle>
				<header id="shareImage">
					<Breadcrumb
						dottedName={dottedName}
						rules={rules}
						pathPrefix={pathPrefix}
					/>
					<h1>
						{rule.icônes ?? ''} {title}&gt;
					</h1>
				</header>
				{Object.keys(rule).length < 1 && (
					<div>
						<p>
							Cette règle n'est qu'un espace de nom qui contient d'autres
							règles.
						</p>
					</div>
				)}
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
				<ComputeButton dottedName={dottedName} />
				{Object.keys(yamlAttributesToDisplay).length > 0 && (
					<div>
						<h2>Comment cette donnée est-elle calculée ?</h2>
						{typeof rule === 'string' ? (
							<FriendlyObjectViewer
								data={rule}
								context={{ dottedName, rules }}
								pathPrefix={pathPrefix}
							/>
						) : (
							<FriendlyObjectViewer
								data={yamlAttributesToDisplay}
								context={{ dottedName, rules }}
								pathPrefix={pathPrefix}
							/>
						)}
					</div>
				)}
				<Exemples exemples={rule.exemples} />
				{isExpressionRule(rule) && (
					<div>
						<h2>Explorer le calcul</h2>
						<OperationVariables
							{...{ rule, rules, dottedName }}
							pathPrefix={pathPrefix}
						/>
					</div>
				)}
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
				<NamespaceRules {...{ rules, dottedName }} pathPrefix={pathPrefix} />
			</DocumentationStyle>
		</Wrapper>
	)
}
