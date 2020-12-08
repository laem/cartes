module.exports = (api) => {
	// This caches the Babel config by environment.
	api.cache.using(() => process.env.NODE_ENV)
	return {
		presets: [
			[
				'@babel/preset-env',
				{
					targets: {
						node: 'current',
					},
				},
			],
			[
				'@babel/preset-react',
				{
					runtime: 'automatic',
				},
			],
			'@babel/preset-typescript',
		],
		plugins: [
			'babel-plugin-styled-components',
			'@babel/plugin-proposal-class-properties',
			'@babel/plugin-proposal-optional-chaining',
			'@babel/plugin-proposal-nullish-coalescing-operator',
			'@babel/plugin-proposal-object-rest-spread',
			'@babel/plugin-syntax-dynamic-import',
			!api.env('production') && 'react-refresh/babel',
			['webpack-alias', { config: './webpack.dev.js' }],
			[
				'ramda',
				{
					useES: true,
				},
			],
		].filter(Boolean),
	}
}
