// svgo.config.js
module.exports = {
	plugins: [
		{
			name: 'preset-default',
			params: {
				overrides: {
					cleanupIds: false,
				},
			},
		},
	],
}
