import { withContentlayer } from 'next-contentlayer2'
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
	compiler: {
		styledComponents: true,
	},
	compilerOptions: {
		baseUrl: '.',
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
				source: '/sitemap.xml',
				destination: '/sitemap',
				permanent: false,
			},
			{
				source: '/elections-legislatives-2024',
				destination: '/?style=elections',
				permanent: false,
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
			//https://github.com/Turfjs/turf/issues/2200
			rbush: path.resolve(__dirname, '/node_modules/rbush/rbush.js'),
		}

		return config
	},
	pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({ options: mdxOptions })

export default withContentlayer(withMDX(nextConfig))
