module.exports = {
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
				throwIfNamespace: false,
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
		['webpack-alias', { config: './webpack.dev.js' }],
	].filter(Boolean),
}
