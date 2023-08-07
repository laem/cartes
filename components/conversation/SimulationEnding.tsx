import { Trans } from 'react-i18next'
import Emoji from '../Emoji'

const SimulationEnding = ({ customEnd, customEndMessages }) => <div style={{ textAlign: 'center' }}>
    {customEnd || (
        <>
            <h3>
                <Emoji e={'🌟'} />{' '}
                <Trans i18nKey="simulation-end.title">
                    Vous avez complété cette simulation
                </Trans>
            </h3>
            <p>
                {customEndMessages ? (
                    customEndMessages
                ) : (
                    <Trans i18nKey="simulation-end.text">
                        Vous avez maintenant accès à l'estimation la plus précise
                        possible.
                    </Trans>
                )}
            </p>
        </>
    )}
</div>;

export default SimulationEnding;
