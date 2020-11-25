import * as mocks from '../../../../testing/mocks';

import { CommentModel } from '../../comment.entity';
import { commentDocument } from '../../comment-document.mock';

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
      pagination: { filter: '', skip: 0, sort: [] },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should find comments', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status');
    const countCommentSpy = jest.spyOn(CommentModel, 'countDocuments').mockResolvedValueOnce(100);
    const findCommentSpy = jest.spyOn(CommentModel, 'find').mockReturnValueOnce({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            populate: () => ({
              populate: () => Promise.resolve(comments),
            }),
          }),
        }),
      }),
    } as any);

    await find(params.request, params.response);

    expect(countCommentSpy).toHaveBeenCalledTimes(1);
    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
