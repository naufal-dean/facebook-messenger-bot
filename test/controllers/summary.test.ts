import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import { mockRequest, mockResponse } from 'mock-req-res';

import summary from '../../controllers/summary';
import logger from '../../utils/logger';
import User from '../../models/user';

chai.use(sinonChai);

logger.transports.forEach((t) => (t.silent = true));

describe('summary controller', () => {
    describe('get', () => {
        afterEach(() => {
            sinon.restore();
        });

        it('succeed call', async () => {
            // Arrange
            const response = [{
                name: 'test user',
                user: '1234567890',
                messages: [{
                    _id: 'abcdefghij',
                    text: 'test message'
                }]
            }];

            const req = mockRequest();
            const res = mockResponse();

            User.aggregate = sinon
                .stub()
                .returns(Promise.resolve(response));
                
            // Act
            await summary.get(req, res);

            // Assert
            expect(User.aggregate).to.have.been.calledOnce;
            expect(res.status).to.have.been.calledOnceWith(200);
            expect(res.json).to.have.been.calledOnceWith(response);
        });
    });
});
