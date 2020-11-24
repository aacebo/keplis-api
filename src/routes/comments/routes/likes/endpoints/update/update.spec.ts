import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../../../testing/mocks';

import { CommentModel } from '../../../../comment.entity';
import { commentDocument } from '../../../../comment-document.mock';

import { update } from './update';

describe('update', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      params: { commentId: 'test' },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find comment', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findCommentSpy = jest.spyOn(CommentModel, 'findOne').mockResolvedValueOnce(undefined);

    await update(params.request, params.response);

    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should like comment', async () => {
    const comment = commentDocument();
    jest.spyOn(comment, 'save').mockResolvedValueOnce({
      populate: () => ({
        populate: () => ({
          execPopulate: () => Promise.resolve(comment),
        }),
      }),
    } as any);

    const statusSpy = spyOn(params.response, 'status');
    const sendSpy = spyOn(params.response, 'send');
    const findCommentSpy = jest.spyOn(CommentModel, 'findOne').mockResolvedValueOnce(comment as any);

    await update(params.request, params.response);

    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith({
      ...comment.toObject(),
      likes: [params.request.user.id],
    });
  });

  it('should unlike comment', async () => {
    const comment = commentDocument({ likes: [params.request.user.id] });
    jest.spyOn(comment, 'save').mockResolvedValueOnce({
      populate: () => ({
        populate: () => ({
          execPopulate: () => Promise.resolve(comment),
        }),
      }),
    } as any);

    const statusSpy = spyOn(params.response, 'status');
    const sendSpy = spyOn(params.response, 'send');
    const findCommentSpy = jest.spyOn(CommentModel, 'findOne').mockResolvedValueOnce(comment as any);

    await update(params.request, params.response);

    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith({
      ...comment.toObject(),
      likes: [],
    });
  });
});
