const bb = require('bot-brother');
const bot = bb({
    key: process.env.BOT_KEY,
    sessionManager: bb.sessionManager.memory(),
    // webHook: {},
    polling: { interval: 0, timeout: 3 }
});

bot.use('before', bb.middlewares.typing());
process.env.BOTANIO_KEY && bot.use('before', bb.middlewares.botanio(process.env.BOTANIO_KEY));

const game = require('./lib/game');

bot.command('start')
    .invoke(function(ctx) {
        const chat = ctx.session;

        if (typeof chat.state === 'undefined' || chat.isFromStat) {
            if (chat.isFromStat) {
                chat.isFromStat = false;
            } else {
                chat.users = {};
            }

            const {isFinger, message} = game.onStart();
            chat.state = isFinger;

            return ctx.sendMessage(message);
        }

        return ctx.sendMessage(game.onStart(chat.state).message);
    })
    .keyboard([
        [{ 'Палец': { value: true } }],
        [{ 'Не палец': { value: false } }]
    ])
    .answer(function(ctx) {
        ctx.hideKeyboard();

        const chat = ctx.session;
        const metaUser = ctx.message.from;
        const username = metaUser.username || metaUser.first_name;

        chat.users || (chat.users = {});

        chat.users[username] || (chat.users[username] = {
            win: 0,
            fail: 0,
            sequence: 0
        });

        const isRight = ctx.session.state === ctx.answer;

        const answer = game.onAnswer(isRight);
        chat.state = answer.isFinger;

        const user = chat.users[username];

        if (isRight) {
            user.win += 1;
            user.sequence += 1;
        } else {
            user.fail += 1;
            user.sequence = 0;
        }

        return ctx
            .sendMessage('@' + username + ' ' + answer.message)
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
