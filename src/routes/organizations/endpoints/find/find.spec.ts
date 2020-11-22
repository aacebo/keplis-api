import * as mocks from '../../../../testing/mocks';

import { OrganizationModel } from '../../organization.entity';
import { organizationDocument } from '../../organization-document.mock';

import { find } from './find';

describe('find', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  const organizations = [
    organizationDocument(),
    organizationDocument(),
    organizationDocument(),
  ];

  beforeEach(() => {
    params.request = mocks.request({ pagination: { filter: '', skip: 0, sort: [] } });
    params.response = mocks.response();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should find organizations', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const countSpy = jest.spyOn(OrganizationModel, 'countDocuments').mockResolvedValueOnce(100);
    const findSpy = jest.spyOn(OrganizationModel, 'find').mockReturnValueOnce({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            populate: (..._args: string[]) => Promise.resolve(organizations),
          }),
        }),
      }),
    } as any);

    await find(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(countSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(organizations.map(o => {
      delete o.toObject;
      delete o.save;

      return {
        ...o,
        owners: o.owners.length,
        projects: o.projects.length,
      };
    }));
  });
});
