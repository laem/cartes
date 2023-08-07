import remarkFrontmatter from 'remark-frontmatter'
import nextMdx from '@next/mdx'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	compiler: {
		styledComponents: true,
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	async redirects() {
		return [
			{
				source: '/ferry',
				destination: '/simulateur/transport/ferry/empreinte-du-voyage',
				permanent: true,
			},
			{
				source: '/avion',
				destination: '/simulateur/transport/avion/impact',
				permanent: true,
			},
		]
	},
	webpack: (config, options) => {
		config.module.rules.push({
			test: /\.ya?ml$/,
			use: 'yaml-loader',
		})
		config.module.rules.push({ test: /\.mp3$/, type: 'asset/resource' })
		config.resolve.alias = {
			Components: path.resolve(__dirname, './app/components'),
			Selectors: path.resolve(__dirname, './app/selectors'),
		}

		return config
	},
	publicRuntimeConfig: {
		NODE_ENV: process.env.NODE_ENV,
	},
}

const withMDX = nextMdx({
	options: {
		// If you use remark-gfm, you'll need to use next.config.mjs
		// as the package is ESM only
		// https://github.com/remarkjs/remark-gfm#install
		remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
	},
})

export default withMDX(nextConfig)
