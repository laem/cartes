import { MDXRemote } from 'next-mdx-remote/rsc'
export default ({ children }) => <MDXRemote source={children}></MDXRemote>
