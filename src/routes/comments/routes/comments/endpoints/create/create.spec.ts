import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../../../testing/mocks';

import { CommentModel } from '../../../../comment.entity';
import { commentDocument } from '../../../../comment-document.mock';

import { create } from './create';

jest.mock('../../../../comment.entity', () => ({
  CommentModel: class {
    static findById() { return Promise.resolve(); }
    toObject() { }
    save() { return Promise.resolve(); }
    populate() { return this; }
    execPopulate() { return Promise.resolve(commentDocument()); }
  },
}));

describe('create', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      params: { commentId: 'test' },
      body: commentDocument().toObject(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find comment', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findCommentSpy = jest.spyOn(CommentModel, 'findById').mockResolvedValueOnce(undefined);

    await create(params.request, params.response);

    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should create', async () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findCommentSpy = jest.spyOn(CommentModel, 'findById').mockResolvedValueOnce(commentDocument() as any);

    await create(params.request, params.response);

    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.CREATED);
  });
});
