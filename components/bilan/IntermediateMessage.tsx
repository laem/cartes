import {
	answeredQuestionsSelector,
	answeredQuestionsSelector,
} from '@/selectors/simulationSelectors'
import { useSelector } from 'react-redux'
import { useNextQuestions } from '../utils/useNextQuestion'
import {
	Almost,
	Done,
	Half,
	NotBad,
	QuiteGood,
} from 'Components/Congratulations'

export default function IntermediateMessage({ engine }) {
	const messages = useSelector((state) => state.simulation?.messages)
	const nextQuestions = useNextQuestions(engine),
		answeredQuestions = useSelector(answeredQuestionsSelector)
	const answeredRatio =
		answeredQuestions.length / (answeredQuestions.length + nextQuestions.length)
	if (answeredRatio >= 0.1 && !messages['notBad'])
		return <NotBad answeredRatio={answeredRatio} />
	if (answeredRatio >= 0.3 && !messages['quiteGood'])
		return <QuiteGood answeredRatio={answeredRatio} />
	if (answeredRatio >= 0.5 && !messages['half'])
		return <Half answeredRatio={answeredRatio} />
	if (answeredRatio >= 0.75 && !messages['almost'])
		return <Almost answeredRatio={answeredRatio} />
	if (!nextQuestions.length) return <Done />
}
