import emoji from 'react-easy-emoji'

const IllustratedMessage = ({ emoji: e, message, inline }) => <div
    css={`
        max-width: 26rem;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
            font-size: 300%;
            margin: 0.6rem !important;
        }
        ${inline &&
        `flex-direction: row; justify-content: start; max-width: 100%; p {margin: 0}`}
    `}
>
    {emoji(e)}
    {message}
</div>;

export default IllustratedMessage;
