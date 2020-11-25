import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../../../testing/mocks';

import { CommentModel } from '../../../../comment.entity';
import { commentDocument } from '../../../../comment-document.mock';

import { find } from './find';

describe('find', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  const comments = [
    commentDocument(),
    commentDocument(),
    commentDocument(),
  ];

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      params: { commentId: 'test' },
      pagination: { filter: '', skip: 0, sort: [] },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find comment', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findCommentSpy = jest.spyOn(CommentModel, 'findById').mockReturnValueOnce({
      populate: () => Promise.resolve(undefined),
    } as any);

    await find(params.request, params.response);

    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should find comments', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status');
    const findCommentSpy = jest.spyOn(CommentModel, 'findById').mockReturnValueOnce({
      populate: () => Promise.resolve(commentDocument({ comments: comments as any })),
    } as any);

    await find(params.request, params.response);

    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
