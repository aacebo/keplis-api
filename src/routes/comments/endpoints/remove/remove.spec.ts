import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';

import { CommentModel } from '../../comment.entity';
import { commentDocument } from '../../comment-document.mock';

import { remove } from './remove';

describe('remove', () => {
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
    const findCommentSpy = jest.spyOn(CommentModel, 'findOne').mockResolvedValueOnce(undefined);

    await remove(params.request, params.response);

    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should be unauthorized', async () => {
    const comment = commentDocument();
    jest.spyOn(comment, 'save').mockResolvedValueOnce({
      populate: () => ({
        execPopulate: () => Promise.resolve(comment),
      }),
    } as any);

    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const sendSpy = spyOn(params.response, 'send');
    const findCommentSpy = jest.spyOn(CommentModel, 'findOne').mockResolvedValueOnce(comment as any);

    await remove(params.request, params.response);

    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should update', async () => {
    const comment = commentDocument({ createdBy: params.request.user.id });
    jest.spyOn(comment, 'save').mockResolvedValueOnce({
      populate: () => ({
        execPopulate: () => Promise.resolve(comment),
      }),
    } as any);

    const statusSpy = spyOn(params.response, 'status');
    const sendSpy = spyOn(params.response, 'send');
    const findCommentSpy = jest.spyOn(CommentModel, 'findOne').mockResolvedValueOnce(comment as any);

    await remove(params.request, params.response);

    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
