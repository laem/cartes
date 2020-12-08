import React from 'react'
import emoji from 'react-easy-emoji'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import remarkFootnotes from 'remark-footnotes'
import { Link } from 'react-router-dom'

function LinkRenderer({ href, children }) {
	if (href.startsWith('http')) {
		return (
			<a target="_blank" href={href}>
				{children}
			</a>
		)
	} else {
		return <Link to={href}>{children}</Link>
	}
}
const TextRenderer = ({ children }) => <>{emoji(children)}</>

type MarkdownProps = ReactMarkdownProps & {
	source: string
	className?: string
}

export const Markdown = ({
	source,
	className = '',
	renderers = {},
	...otherProps
}: MarkdownProps) => (
	<ReactMarkdown
		children={source}
		plugins={[remarkFootnotes]}
		className={`markdown ${className}`}
		allowDangerousHtml
		renderers={{
			...renderers,
			link: LinkRenderer,
			text: TextRenderer,
			footnoteReference: ({ identifier, label }) => (
				<sup id={'ref' + identifier}>
					<a href={window.location.pathname + '#def' + identifier}>{label}</a>
				</sup>
			),
			footnoteDefinition: ({ identifier, label, children }) => (
				<div
					id={'def' + identifier}
					css={`
						${window.location.hash === '#def' + identifier
							? `{
								background: var(--color); 
								color: var(--textColor); 
								a {color: inherit}; 
								border-radius: .3rem; 
								padding: 0.1rem 0.3rem;
						    }`
							: ''};
						> p {
							display: inline;
						}
					`}
				>
					<a href={window.location.pathname + '#ref' + identifier}>{label}</a> :{' '}
					{children}
				</div>
			),
		}}
		{...otherProps}
	/>
)
