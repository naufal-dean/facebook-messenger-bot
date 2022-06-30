import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import { mockRequest, mockResponse } from 'mock-req-res';

import messages from '../../controllers/messages';
import logger from '../../utils/logger';
import Message from '../../models/message';

chai.use(sinonChai);

logger.transports.forEach((t) => (t.silent = true));

describe('messages controller', () => {
    describe('get', () => {
        afterEach(() => {
            sinon.restore();
        });

        it('succeed call', async () => {
            // Arrange
            const response = [{
                _id: 'abcdefghij',
                text: 'test message 1'
            }, {
                _id: 'klmnopqrst',
                text: 'test message 2'
            }];

            const req = mockRequest();
            const res = mockResponse();

            const messageFindSelectStub = sinon
                .stub()
                .returns(Promise.resolve(response));
            Message.find = sinon
                .stub()
                .returns({
                    select: messageFindSelectStub
                });

            // Act
            await messages.get(req, res);

            // Assert
            expect(Message.find).to.have.been.calledOnce;
            expect(messageFindSelectStub).to.have.been.calledOnce;
            expect(res.status).to.have.been.calledOnceWith(200);
            expect(res.json).to.have.been.calledWith(response);
        });
    });

    describe('getById', () => {
        afterEach(() => {
            sinon.restore();
        });
        
        it('succeed call', async () => {
            // Arrange
            const paramId = 'abcdefghij';
            const response = {
                _id: 'abcdefghij',
                text: 'test message',
                userId: 'test user id'
            };

            const req = mockRequest({
                params: {
                    id: paramId
                }
            });
            const res = mockResponse();

            const messageFindByIdSelectStub = sinon
                .stub()
                .returns(Promise.resolve(response));
            Message.findById = sinon
                .stub()
                .returns({
                    select: messageFindByIdSelectStub
                });

            // Act
            await messages.getById(req, res);

            // Assert
            expect(Message.findById).to.have.been.calledOnceWith(paramId);
            expect(messageFindByIdSelectStub).to.have.been.calledOnce;
            expect(res.status).to.have.been.calledOnceWith(200);
            expect(res.json).to.have.been.calledWith(response);
        });

        it('message not found', async () => {
            // Arrange
            const paramId = 'invalid';

            const req = mockRequest({
                params: {
                    id: paramId
                }
            });
            const res = mockResponse();

            const messageFindByIdSelectStub = sinon
                .stub()
                .returns(Promise.resolve(null));
            Message.findById = sinon
                .stub()
                .returns({
                    select: messageFindByIdSelectStub
                });

            // Act
            await messages.getById(req, res);

            // Assert
            expect(Message.findById).to.have.been.calledOnceWith(paramId);
            expect(messageFindByIdSelectStub).to.have.been.calledOnce;
            expect(res.status).to.have.been.calledOnceWith(404);
        });
    });
});
