const { json } = require('micro');
const game = require('./lib/game');

const db = {};

module.exports = async req => {
    const { request, session, version } = await json(req);

    const chat = db[session.session_id] || (db[session.session_id] = {});

    let responseText;

    const {isFinger, message} = game.onStart(chat.state);

    if (session.new) {
        responseText = message;
        chat.state = isFinger;
    } else {
        const command = request.command.toLowerCase();
        const isAnswerValid = command.includes('палец');

        if (isAnswerValid) {
            const isUserAnsweredWithFinger = !command.includes('не палец');
            const isRight = chat.state === isUserAnsweredWithFinger;

            const answer = game.onAnswer(isRight);
            chat.state = answer.isFinger;
            responseText = answer.message + '\n' + game.onStart(answer.isFinger).message;
        } else {
            responseText = 'Выражайтесь понятнее, пожалуйста!';
        }
    }

    return {
        version,
        session,
        response: {
            text: responseText,

            end_session: false
        }
    };
};
