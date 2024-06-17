import { withContentlayer } from 'next-contentlayer'
import createMDX from '@next/mdx'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)

import mdxOptions from './mdxOptions.mjs'

const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false,
	experimental: {
		reactCompiler: true,
	},
	serverComponentsExternalPackages: ['publicodes'],
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
				source: '/voyage/cout-voiture',
				destination: '/cout-voiture',
				permanent: true,
			},
			{
				source: '/voyage/:slug*',
				destination: 'https://cartes.app/:slug*',
				permanent: true,
			},
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
			{
				source: '/elections-legislatives-2024',
				destination: '/?style=elections',
				permanent: false,
			},
		]
	},
	async rewrites() {
		return process.env.VOYAGE === 'oui'
			? {
					beforeFiles: [
						// These rewrites are checked after headers/redirects
						// and before all files including _next/public files which
						// allows overriding page files
						{
							source: '/',
							destination: '/voyage',
						},
					],
			  }
			: {}
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
			//https://github.com/Turfjs/turf/issues/2200
			rbush: path.resolve(__dirname, '/node_modules/rbush/rbush.js'),
		}

		return config
	},
	pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({ options: mdxOptions })

export default withContentlayer(withMDX(nextConfig))
