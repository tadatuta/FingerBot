const bb = require('bot-brother');
const bot = bb({
    key: process.env.KEY,
    sessionManager: bb.sessionManager.memory(),
    polling: { interval: 0, timeout: 1 }
});

const fingers = ['🖕', '🖖', '☝', '👆', '🖐️', '👌', '✌', '👍', '👈', '👉', '👇', '☝️'];

const triggerQuestions = [
    'Смотрите внимательно!',
    'Здесь главное — внимательность'
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
    'Вам стоит быть повнимательнее!'
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
    'Да, казалось бы, но нет :('
];

const triggerYesAnswers = [
    'Верно! Вы были внимательны!',
    'Правильно, вот что значит внимательность!',
    'Вот, стоило лишь чуть внимательнее посмотреть и ура!'
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandom(collection) {
    return collection[getRandomInt(0, collection.length - 1)];
}

const db = {};

bot.command('start')
    .invoke(function(ctx) {
        const chatId = ctx.meta.chat.id;
        let question = '';

        if (typeof db[chatId] === 'undefined') {
            const isFinger = Math.random() > 0.8;
            db[chatId] = isFinger;

            question = (isFinger ?
                getRandom(triggerQuestions) :
                getRandom(questions)) + ' ';
        }

        return ctx.sendMessage(question + [
            getRandom(fingers),
            getRandom(fingers),
            getRandom(fingers),
            'а это?'
        ].join(', '));
    })
    .keyboard([
        [{ 'Палец': { value: true } }],
        [{ 'Не палец': { value: false } }]
    ])
    .answer(function(ctx) {
        const chatId = ctx.meta.chat.id;
        const isRight = db[chatId] === ctx.answer;

        const isFinger = Math.random() > 0.8;
        db[chatId] = isFinger;

        const answer = isFinger ?
            getRandom(isRight ? triggerYesAnswers : triggerNoAnswers) :
            getRandom(isRight ? yesAnswers : noAnswers);

        return ctx
            .sendMessage(answer)
            .then(() => ctx.go('start'));
    });
