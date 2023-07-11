const { parseSVG, makeAbsolute } = require('svg-path-parser')

export default function (svgPathString, opts = {}) {
	if (!opts.tolerance) opts.tolerance = 1
	const polys = []
	const tolerance2 = opts.tolerance * opts.tolerance
	let poly = []
	let prev
	makeAbsolute(parseSVG(svgPathString)).forEach((cmd) => {
		switch (cmd.code) {
			case 'M':
				polys.push((poly = []))
			// intentional flow-through
			case 'L':
			case 'H':
			case 'V':
			case 'Z':
				add(cmd.x, cmd.y)
				if (cmd.code === 'Z') poly.closed = true
				break

			case 'C':
				sampleCubicBézier(
					cmd.x0,
					cmd.y0,
					cmd.x1,
					cmd.y1,
					cmd.x2,
					cmd.y2,
					cmd.x,
					cmd.y
				)
				add(cmd.x, cmd.y)
				break

			case 'S':
				let x1 = 0,
					y1 = 0
				if (prev) {
					if (prev.code === 'C') {
						x1 = prev.x * 2 - prev.x2
						y1 = prev.y * 2 - prev.y2
					} else {
						x1 = prev.x
						y1 = prev.y
					}
				}
				sampleCubicBézier(cmd.x0, cmd.y0, x1, y1, cmd.x2, cmd.y2, cmd.x, cmd.y)
				add(cmd.x, cmd.y)
				break

			default:
				console.error(
					'Our deepest apologies, but ' +
						cmd.command +
						' commands (' +
						cmd.code +
						') are not yet supported.'
				)
				process.exit(2)
		}
		prev = cmd
	})
	return polys

	// http://antigrain.com/research/adaptive_bezier/
	function sampleCubicBézier(x0, y0, x1, y1, x2, y2, x3, y3) {
		// Calculate all the mid-points of the line segments
		const x01 = (x0 + x1) / 2,
			y01 = (y0 + y1) / 2,
			x12 = (x1 + x2) / 2,
			y12 = (y1 + y2) / 2,
			x23 = (x2 + x3) / 2,
			y23 = (y2 + y3) / 2,
			x012 = (x01 + x12) / 2,
			y012 = (y01 + y12) / 2,
			x123 = (x12 + x23) / 2,
			y123 = (y12 + y23) / 2,
			x0123 = (x012 + x123) / 2,
			y0123 = (y012 + y123) / 2

		// Try to approximate the full cubic curve by a single straight line
		const dx = x3 - x0,
			dy = y3 - y0

		const d1 = Math.abs((x1 - x3) * dy - (y1 - y3) * dx),
			d2 = Math.abs((x2 - x3) * dy - (y2 - y3) * dx)

		if ((d1 + d2) * (d1 + d2) < tolerance2 * (dx * dx + dy * dy))
			add(x0123, y0123)
		else {
			// Continue subdivision
			sampleCubicBézier(x0, y0, x01, y01, x012, y012, x0123, y0123)
			sampleCubicBézier(x0123, y0123, x123, y123, x23, y23, x3, y3)
		}
	}

	function add(x, y) {
		if (opts.decimals && opts.decimals >= 0) {
			x = x.toFixed(opts.decimals) * 1
			y = y.toFixed(opts.decimals) * 1
		}
		poly.push([x, y])
	}
}

// OMG YOU FOUND THE SECRET UNDOCUMENTED FEATURE
function compare(pathData, opts = {}) {
	var polys = svgPathToPolygons(pathData, opts)
	var minX = Infinity,
		maxX = -Infinity,
		minY = Infinity,
		maxY = -Infinity
	polys.forEach((poly) => {
		poly.forEach((pt) => {
			if (pt[0] < minX) minX = pt[0]
			if (pt[1] < minY) minY = pt[1]
			if (pt[0] > maxX) maxX = pt[0]
			if (pt[1] > maxY) maxY = pt[1]
		})
	})
	let dx = maxX - minX,
		dy = maxY - minY
	console.log(
		`
<svg xmlns="http://www.w3.org/2000/svg" width="${dx}px" height="${dy}px" viewBox="${minX} ${minY} ${
			dx * 2
		} ${dy}">
<style>path,polygon,polyline { fill-opacity:0.2; stroke:black }</style>
<path d="${pathData}"/>
<g transform="translate(${dx},0)">
${polys
	.map(
		(poly) =>
			`  <${poly.closed ? 'polygon' : 'polyline'} points="${poly.join(' ')}"/>`
	)
	.join('\n')}
</g>
</svg>
	`.trim()
	)
}

export function calcPolygonArea(vertices) {
	var total = 0

	for (var i = 0, l = vertices.length; i < l; i++) {
		var addX = vertices[i][0]
		var addY = vertices[i == vertices.length - 1 ? 0 : i + 1][1]
		var subX = vertices[i == vertices.length - 1 ? 0 : i + 1][0]
		var subY = vertices[i][1]

		total += addX * addY * 0.5
		total -= subX * subY * 0.5
	}

	return Math.abs(total)
}
