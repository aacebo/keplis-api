import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../../../testing/mocks';

import { CommentModel } from '../../../../../comments/comment.entity';
import { commentDocument } from '../../../../../comments/comment-document.mock';

import { UserModel } from '../../../../user.entity';
import { userDocument } from '../../../../user-document.mock';

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
      params: { username: 'test' },
      pagination: { filter: '', skip: 0, sort: [] },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find user', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findUserSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(undefined);

    await find(params.request, params.response);

    expect(sendSpy).not.toHaveBeenCalled();
    expect(findUserSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  it('should find comments', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status');
    const findUserSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(userDocument() as any);
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

    expect(findUserSpy).toHaveBeenCalledTimes(1);
    expect(countCommentSpy).toHaveBeenCalledTimes(1);
    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
