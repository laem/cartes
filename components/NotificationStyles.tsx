import styled from 'styled-components'

export const NotificationsBlock = styled.div`
	blockingNotification {
		text-align: center;
		font-size: 150%;
	}

	.notificationText .hide {
		position: absolute;
		top: 0rem;
		right: -1.4rem;
		font-size: 200%;
	}

	#notificationExplanation > div {
		display: inline;
	}

	/*Disable links visually */
	#notificationExplanation a {
		color: inherit;
		text-decoration: none;
	}

	> ul {
		list-style: none;
		padding: 0;
	}
	.notification {
		margin: 1em 0;
		display: flex;
		align-items: center;
	}
	.notificationText {
		width: 100%;
		padding: 1rem 2.6rem 1rem 1.6rem;
		/*For the .hide element */
		position: relative;
	}
	.notificationText p:last-child {
		margin: 0;
	}

	/* Display the values of the variables in the explanation of the failed control */
	.variable .situationValue {
		display: inline-block;
	}
	img {
		margin: 0 1em 0 !important;
		width: 1.6em !important;
		height: 1.6em !important;
	}
`
