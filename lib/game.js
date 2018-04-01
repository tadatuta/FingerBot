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
