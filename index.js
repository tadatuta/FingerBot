const { triggerQuestions, questions, triggerNoAnswers, noAnswers, triggerYesAnswers, yesAnswers, finalParts, fingerWords } = require('./texts');
const bb = require('bot-brother');
const bot = bb({
    key: process.env.BOT_KEY,
    sessionManager: bb.sessionManager.memory(),
    // webHook: {},
    polling: { interval: 0, timeout: 3 }
});

bot.use('before', bb.middlewares.typing());
process.env.BOTANIO_KEY && bot.use('before', bb.middlewares.botanio(process.env.BOTANIO_KEY));

const fingers = ['🖕', '🖖', '☝', '👆', '🖐️', '👌', '✌', '👍', '👈', '👉', '👇', '☝️'];

bot.command('start')
    .invoke(function(ctx) {
        const chat = ctx.session;
        const isBefore = Math.random() > 0.4;
        let question = '';

        if (typeof chat.state === 'undefined' || chat.isFromStat) {
            const isFinger = Math.random() > 0.4;
            chat.state = isFinger;

            if (chat.isFromStat) {
                chat.isFromStat = false;
            } else {
                chat.users = {};
            }

            question = (isFinger ?
                getRandom(triggerQuestions) :
                getRandom(questions)) + '\n';
        }

        return ctx.sendMessage(
            (isBefore ? question : '') +
            getRandom(fingers) + ' — ' + getRandom(fingerWords) + ',\n' +
            getRandom(fingers) + ' — ' + getRandom(fingerWords) + ',\n' +
            getRandom(fingers) + ' — ' + getRandom(fingerWords) + '.\n' +
            getRandom(finalParts) + ' ' + getRandom(fingers) + '?' +
            (isBefore ? '' : ('\n' + question))
        );
    })
    .keyboard([
        [{ 'Палец': { value: true } }],
        [{ 'Не палец': { value: false } }]
    ])
    .answer(function(ctx) {
        ctx.hideKeyboard();

        const chat = ctx.session;
        const metaUser = ctx.meta.user;
        const username = metaUser.username || metaUser.first_name;

        chat.users[username] || (chat.users[username] = {
            win: 0,
            fail: 0,
            sequence: 0
        });

        const isRight = ctx.session.state === ctx.answer;

        const isFinger = Math.random() > 0.55;
        chat.state = isFinger;

        const user = chat.users[username];

        if (isRight) {
            user.win += 1;
            user.sequence += 1;
        } else {
            user.fail += 1;
            user.sequence = 0;
        }

        const shouldMention = Math.random() > 0.6;

        const answer = isFinger ?
            shouldMention ?
                ('@' + username + ' ' + getRandom(isRight ? triggerYesAnswers : triggerNoAnswers)) :
                getRandom(isRight ? triggerYesAnswers : triggerNoAnswers) :
            getRandom(isRight ? yesAnswers : noAnswers);

        return ctx
            .sendMessage(answer)
            .then(() => ctx.go('start'));
    });

bot.command('stat')
    .invoke(function(ctx) {
        const chat = ctx.session;
        const users = chat.users;

        if (!chat.users) return;

        chat.isFromStat = true;

        ctx.sendMessage(Object.keys(chat.users).map(username => {
            const user = users[username];
            return '@' + username +
                '\nПобед: ' + user.win + ' (подряд: ' + user.sequence +
                ')\nПоражений: ' + user.fail;
        }).join('\n'));
    })
    .keyboard([
        [{ 'MOAR!': { go: 'start' } }]
    ]);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandom(collection) {
    return collection[getRandomInt(0, collection.length)];
}
