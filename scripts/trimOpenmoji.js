const fs = require('fs')
const openmoji = require('openmoji')

const data = openmoji.openmojis.reduce(
	(memo, next) => ({ ...memo, [next.emoji]: next.hexcode }),
	{}
)

fs.writeFileSync('source/data/openmojis.json', JSON.stringify(data))
