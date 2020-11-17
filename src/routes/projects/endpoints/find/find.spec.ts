import * as mocks from '../../../../testing/mocks';

import { ProjectModel } from '../../project.entity';

import { find } from './find';

describe('find', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  const posts = [
    mocks.projectDocument(),
    mocks.projectDocument(),
    mocks.projectDocument(),
  ];

  beforeEach(() => {
    params.request = mocks.request({ pagination: { filter: '', skip: 0, sort: [] } });
    params.response = mocks.response();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should find projects', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const countSpy = jest.spyOn(ProjectModel, 'countDocuments').mockResolvedValueOnce(100);
    const findSpy = jest.spyOn(ProjectModel, 'find').mockReturnValueOnce({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            populate: (..._args: string[]) => Promise.resolve(posts),
          }),
        }),
      }),
    } as any);

    await find(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(countSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(posts.map(p => {
      delete p.toObject;
      delete p.save;

      return {
        ...p,
      };
    }));
  });
});
