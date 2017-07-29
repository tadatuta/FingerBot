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

const triggerQuestions = [
    'Смотрите внимательно!',
    'Здесь главное — внимательность.',
    'Это игра на внимательность!'
];

const questions = [
    'Не перепутайте!',
    'Подумайте!',
    'Не ошибитесь!',
    'Сосредоточьтесь!',
    'Не прогадайте!'
];

const triggerNoAnswers = [
    'Вы невнимательно смотрели!',
    'Будьте внимательнее!',
    'Вам стоит быть повнимательнее!',
    'Нет. Это игра на внимательность!',
    'Увы... Чуть больше внимания и в следующий раз все получится.',
    'Промах! Внимание и еще раз внимание!',
    'Не в этот раз. Только спокойствие и внимательность.'
];

const noAnswers = [
    'Мимо. Сосредоточьтесь!',
    'Попробуйте еще раз!',
    'Не повезло...',
    'Увы...',
    'Не то пальто',
    'А вот и нет!',
    'Промах!',
    'Стоило выбрать другой ответ',
    'Да, казалось бы, но нет :(',
    'ЛОЛ! Нет, конечно',
    'Ахахаха! Нет.',
    'Пффф! Нет.',
    'Думай лучше!'
];

const triggerYesAnswers = [
    'Верно! Вы были внимательны!',
    'Правильно, вот что значит внимательность!',
    'Вот, стоило лишь чуть внимательнее посмотреть и ура!',
    'Верно! Это игра на внимательность!'
];

const yesAnswers = [
    'Точняк!',
    'В точку!',
    'Да!',
    'Именно!',
    'Совершенно верно!',
    'Да! Отличная игра!',
    'Правильно!',
    'На этот раз верно. Сыграете еще?',
    'Да! Да! Да!',
    'Правильно! Вам сейчас просто повезло или вы догадались?',
    'Конечно!',
    'Согласен!',
    'Да и еще раз да!',
    'Абсолютно верно',
    'Именно так!',
    'Ай, молодца!'
];

const finalParts = [
    'А это',
    'Тогда это',
    'Как на счет этого',
    'Это'
];

const fingerWords = [
    'палец',
    'пальчик'
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandom(collection) {
    return collection[getRandomInt(0, collection.length)];
}

const db = {};

bot.command('start')
    .invoke(function(ctx) {
        const chatId = ctx.meta.chat.id;
        const chat = db[chatId] || (db[chatId] = {});
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

        const chatId = ctx.meta.chat.id;
        const username = ctx.meta.user.username;

        const isRight = db[chatId].state === ctx.answer;

        const isFinger = Math.random() > 0.55;
        db[chatId].state = isFinger;
        db[chatId].users[username] || (db[chatId].users[username] = {
            win: 0,
            fail: 0,
            sequence: 0
        });

        const user = db[chatId].users[username];
        if (isRight) {
            user.win += 1;
            user.sequence += 1;
        } else {
            user.fail += 1;
            user.sequence = 0;
        }

        const answer = isFinger ?
            getRandom(isRight ? triggerYesAnswers : triggerNoAnswers) :
            getRandom(isRight ? yesAnswers : noAnswers);

        return ctx
            .sendMessage(answer)
            .then(() => ctx.go('start'));
    });

bot.command('stat')
    .invoke(function(ctx) {
        const chatId = ctx.meta.chat.id;
        const users = db[chatId].users;

        if (!db[chatId].users) return;

        db[chatId].isFromStat = true;

        ctx.sendMessage(Object.keys(db[chatId].users).map(username => {
            const user = users[username];
            return '@' + username +
                '\nПобед: ' + user.win + ' (подряд: ' + user.sequence +
                ')\nПоражений: ' + user.fail;
        }).join('\n'));
    })
    .keyboard([
        [{ 'MOAR!': { go: 'start' } }]
    ]);
