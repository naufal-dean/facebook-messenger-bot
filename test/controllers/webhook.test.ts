import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import { mockRequest, mockResponse } from 'mock-req-res';

import webhook from '../../controllers/webhook';
import logger from '../../utils/logger';

chai.use(sinonChai);

logger.transports.forEach((t) => (t.silent = true));

describe('webhook controller', () => {
    describe('get', () => {
        before(() => {
            process.env.VERIFY_TOKEN = process.env.VERIFY_TOKEN || '';
        });

        afterEach(() => {
            sinon.restore();
        });

        it('succeed call', async () => {
            // Arrange
            const challenge = 'CHALLENGE_VALUE';
            const verifyToken = 'VERIFY_TOKEN_VALUE';
            
            const req = mockRequest({
                query: {
                    'hub.mode': 'subscribe',
                    'hub.verify_token': verifyToken,
                    'hub.challenge': challenge,
                },
            });
            const res = mockResponse();

            sinon.stub(process.env, 'VERIFY_TOKEN').value(verifyToken);

            // Act
            await webhook.get(req, res);

            // Assert
            expect(res.status).to.have.been.calledOnceWith(200);
            expect(res.send).to.have.been.calledOnceWith(challenge);
        });

        it('invalid verify token', async () => {
            // Arrange
            const challenge = 'CHALLENGE_VALUE';
            const verifyToken = 'VERIFY_TOKEN_VALUE';
            const invalidVerifyToken = 'INVALID_VERIFY_TOKEN_VALUE';

            const req = mockRequest({
                query: {
                    'hub.mode': 'subscribe',
                    'hub.verify_token': invalidVerifyToken,
                    'hub.challenge': challenge,
                },
            });
            const res = mockResponse();

            sinon.stub(process.env, 'VERIFY_TOKEN').value(verifyToken);

            // Act
            await webhook.get(req, res);

            // Assert
            expect(res.sendStatus).to.have.been.calledOnceWith(403);
            expect(res.send).to.have.not.been.calledOnceWith(challenge);
        });

        it('invalid mode', async () => {
            // Arrange
            const challenge = 'CHALLENGE_VALUE';
            const verifyToken = 'VERIFY_TOKEN_VALUE';

            const req = mockRequest({
                query: {
                    'hub.mode': 'invalid',
                    'hub.verify_token': verifyToken,
                    'hub.challenge': challenge,
                },
            });
            const res = mockResponse();

            sinon.stub(process.env, 'VERIFY_TOKEN').value(verifyToken);

            // Act
            await webhook.get(req, res);

            // Assert
            expect(res.sendStatus).to.have.been.calledOnceWith(403);
            expect(res.send).to.have.not.been.calledOnceWith(challenge);
        });

        it('incomplete query', async () => {
            // Arrange
            const challenge = 'CHALLENGE_VALUE';
            const verifyToken = 'VERIFY_TOKEN_VALUE';

            const req = mockRequest({
                query: {
                    'hub.verify_token': verifyToken,
                    'hub.challenge': challenge,
                },
            });
            const res = mockResponse();

            sinon.stub(process.env, 'VERIFY_TOKEN').value(verifyToken);

            // Act
            await webhook.get(req, res);

            // Assert
            expect(res.sendStatus).to.have.been.calledOnceWith(403);
            expect(res.send).to.have.not.been.calledOnceWith(challenge);
        });
    });

    describe('post', () => {
        afterEach(() => {
            sinon.restore();
        });

        it('succeed call', async () => {
            // Arrange
            const req = mockRequest({
                body: {
                    object: 'page',
                    entry: [],
                },
            });
            const res = mockResponse();

            // Act
            await webhook.post(req, res);

            // Assert
            expect(res.status).to.have.been.calledOnceWith(200);
            expect(res.send).to.have.been.calledOnce;
        });

        it('invalid object value', async () => {
            // Arrange
            const req = mockRequest({
                body: {
                    object: 'invalid',
                    entry: [],
                },
            });
            const res = mockResponse();

            // Act
            await webhook.post(req, res);

            // Assert
            expect(res.sendStatus).to.have.been.calledOnceWith(404);
        });
    });
});
