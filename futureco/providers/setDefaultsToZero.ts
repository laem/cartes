import zeros from './zeroDefaults.yaml'
// This is a difficult task : categories must equal to zero, in order to not make the test fail without having answered to a non-zero per default category
// but some categories are conditionned by one variable, like the housing which is divided by the number of inhabitants.
// Or, should the number of inhabitants be the first question asked ?
// Yes it should.
// But e.g. the question of number of people in the car is asked after the number of km. Hence we set this number to 2.
const setDefaultsToZero = (rules) =>
	Object.entries(rules).reduce(
		(memo, [k, v]) =>
			!v
				? memo
				: !v['par défaut']
				? { ...memo, [k]: v }
				: {
						...memo,
						[k]:
							zeros[k] != null
								? { ...v, 'par défaut': zeros[k] }
								: //console.log('NO', k, ':', v['par défaut']) ||
								  v,
				  },
		{}
	)

export default setDefaultsToZero
