import { MDXRemote } from 'next-mdx-remote/rsc'

export const Markdown = ({ children }) => (
	<MDXRemote source={children}></MDXRemote>
)
