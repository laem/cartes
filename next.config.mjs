import { withContentlayer } from 'next-contentlayer'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)

import mdxOptions from './mdxOptions.mjs'

const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */

const nextConfig = {
	experimental: {
		serverComponentsExternalPackages: ['publicodes'],
	},
	compiler: {
		styledComponents: true,
	},
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
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
			{
				source: '/essence',
				destination: '/carburants/prix-a-la-pompe',
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
		config.module.rules.push({
			test: /\.csv$/,
			loader: 'csv-loader',
			options: {
				dynamicTyping: true,
				header: true,
				skipEmptyLines: true,
			},
		})

		config.resolve.alias = {
			...config.resolve.alias,
			Components: path.resolve(__dirname, './components'),
			Selectors: path.resolve(__dirname, './selectors'),
		}

		return config
	},
	pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

export default withContentlayer(nextConfig)
