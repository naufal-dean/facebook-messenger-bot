import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';

import { daysUntilBirthday } from '../../utils/date';

chai.use(sinonChai);

describe('date util', () => {
    describe('daysUntilBirthday', () => {
        let clock: sinon.SinonFakeTimers;

        before(() => {
            clock = sinon.useFakeTimers({
                now: new Date('2022-02-01'),
                shouldAdvanceTime: false,
                toFake: ["Date"],
            });
        })

        afterEach(() => {
            sinon.restore();
            clock.restore();
        });

        it('calculate days until birthday', async () => {
            const tcs = [{
                birthDate: new Date('2000-02-01'),
                expected: 0
            }, {
                birthDate: new Date('2000-02-25'),
                expected: 24
            }, {
                birthDate: new Date('2000-03-01'),
                expected: 28
            }, {
                birthDate: new Date('2000-01-01'),
                expected: 334
            }, {
                birthDate: new Date('2000-01-31'),
                expected: 364
            }];

            tcs.forEach(tc => {
                const res = daysUntilBirthday(tc.birthDate);
                expect(res).equal(tc.expected);
            });
        });
    });
});
