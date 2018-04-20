(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.paletz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const { triggerQuestions, questions, triggerNoAnswers, noAnswers, triggerYesAnswers, yesAnswers, finalParts, fingerWords } = require('./texts');
const fingers = ['🖕', '🖖', '☝', '👆', '🖐️', '👌', '✌', '👍', '👈', '👉', '👇', '☝️'];

function onStart(isFinger) {
    const isBefore = Math.random() > 0.4;
    let question = '';

    if (typeof isFinger === 'undefined') {
        isFinger = Math.random() > 0.4;

        question = (isFinger ?
            getRandom(triggerQuestions) :
            getRandom(questions)) + '\n';
    }

    const message =
        (isBefore ? question : '') +
        getRandom(fingers) + ' — ' + getRandom(fingerWords) + ',\n' +
        getRandom(fingers) + ' — ' + getRandom(fingerWords) + ',\n' +
        getRandom(fingers) + ' — ' + getRandom(fingerWords) + '.\n' +
        getRandom(finalParts) + ' ' + getRandom(fingers) + '?' +
        (isBefore ? '' : ('\n' + question));

    return {
        message,
        isFinger
    };
}

function onAnswer(isRight) {
    const isFinger = Math.random() > 0.55;

    return {
        isFinger,
        message: isFinger ?
            getRandom(isRight ? triggerYesAnswers : triggerNoAnswers) :
            getRandom(isRight ? yesAnswers : noAnswers)
    };
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandom(collection) {
    return collection[getRandomInt(0, collection.length)];
}

module.exports = {
    onStart,
    onAnswer
};

},{"./texts":2}],2:[function(require,module,exports){
module.exports = {
    triggerQuestions: [
        'Смотрите внимательно!',
        'Здесь главное — внимательность.',
        'Это игра на внимательность!'
    ],
    questions: [
        'Не перепутайте!',
        'Подумайте!',
        'Не ошибитесь!',
        'Сосредоточьтесь!',
        'Не прогадайте!'
    ],
    triggerNoAnswers: [
        'Вы невнимательно смотрели!',
        'Будьте внимательнее!',
        'Вам стоит быть повнимательнее!',
        'Нет. Это игра на внимательность!',
        'Увы... Чуть больше внимания и в следующий раз все получится.',
        'Промах! Внимание и еще раз внимание!',
        'Не в этот раз. Только спокойствие и внимательность.'
    ],
    noAnswers: [
        'Лолшто? Вообще ни разу!',
        'Глаза разуй!',
        'Совсем неверный ответ',
        'Чуть более, чем полностью неправильно',
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
    ],
    triggerYesAnswers: [
        'Верно! Вы были внимательны!',
        'Правильно, вот что значит внимательность!',
        'Вот, стоило лишь чуть внимательнее посмотреть и ура!',
        'Верно! Это игра на внимательность!',
        'Конечно же! Капля внимательности и победа!'
    ],
    yesAnswers: [
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
    ],
    finalParts: [
        'А это',
        'Тогда это',
        'Как на счет этого',
        'Это'
    ],
    fingerWords: [
        'палец',
        'пальчик'
    ]
};

},{}]},{},[1])(1)
});