const assert = require('assert');
const { onStart, onAnswer } = require('../lib/game');
const texts = require('../lib/texts');

function isOneOf(text, arr) {
    return arr.some(item => text.includes(item));
}

describe('onStart', function() {
    describe('isFinger', function() {
        it('should answer with not a finger', function() {
            assert(!onStart(false).isFinger);
        });

        it('should answer with a finger', function() {
            assert(onStart(true).isFinger);
        });

        it('should answer with random', function() {
            const results = new Set();

            for (let i = 0; i < 10; i++) {
                results.add(onStart().isFinger);
            }

            assert(results.size === 2);
        });
    });
});

describe('onAnswer', function() {
    it('should react on right answer', function() {
        const { message, isFinger } = onAnswer(true);

        assert(isOneOf(message, isFinger ?
            texts.triggerYesAnswers :
            texts.yesAnswers
        ));
    });

    it('should react on wrong answer', function() {
        const { message, isFinger } = onAnswer(false);

        assert(isOneOf(message, isFinger ?
            texts.triggerNoAnswers :
            texts.noAnswers
        ));
    });
});
