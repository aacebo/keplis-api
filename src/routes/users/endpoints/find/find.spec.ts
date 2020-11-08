import * as mocks from '../../../../testing/mocks';

import { UserModel } from '../../user.entity';

import { find } from './find';

describe('find', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
    next: () => {},
  };

  const users = [
    mocks.userDocument(),
    mocks.userDocument(),
    mocks.userDocument(),
  ];

  beforeEach(() => {
    params.request = mocks.request({ pagination: { filter: '', skip: 0, sort: [] } });
    params.response = mocks.response();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should find users', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const countSpy = jest.spyOn(UserModel, 'countDocuments').mockResolvedValueOnce(100);
    const findSpy = jest.spyOn(UserModel, 'find').mockReturnValueOnce({
      sort: () => ({
        skip: () => ({
          limit: () => Promise.resolve(users),
        }),
      }),
    } as any);

    await find(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(countSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(users.map(u => {
      delete u.toObject;
      delete u.save;
      return u;
    }));
  });
});
