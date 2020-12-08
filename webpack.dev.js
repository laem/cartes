const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const path = require('path')

const {
	commonLoaders,
	styleLoader,
	HTMLPlugins,
	default: common,
} = require('./webpack.common')

module.exports = {
	...common,
	module: {
		rules: [...commonLoaders(), styleLoader('style-loader')],
	},
	devServer: {
		historyApiFallback: true,
		contentBase: path.join(__dirname, 'dist'),
		hot: true,
	},
	mode: 'development',
	plugins: [
		...(common.plugins || []),
		...HTMLPlugins({ injectTrackingScript: true }),
		new ReactRefreshWebpackPlugin(),
		new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
		new webpack.HotModuleReplacementPlugin(),
	],
}
