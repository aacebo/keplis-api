import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';

import { CommentModel } from '../../comment.entity';
import { commentDocument } from '../../comment-document.mock';

import { findOne } from './find-one';

describe('findOne', () => {
  const comment = commentDocument();
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      params: {
        commentId: 'test',
      }
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find comment', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findCommentSpy = jest.spyOn(CommentModel, 'findOne').mockReturnValueOnce({
      populate: () => ({
        populate: () => Promise.resolve(undefined),
      }),
    } as any);

    await findOne(params.request, params.response);

    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should find comment', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status');
    const findCommentSpy = jest.spyOn(CommentModel, 'findOne').mockReturnValueOnce({
      populate: () => ({
        populate: () => Promise.resolve(comment),
      }),
    } as any);

    await findOne(params.request, params.response);

    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
