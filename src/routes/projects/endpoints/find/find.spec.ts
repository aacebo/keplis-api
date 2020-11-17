import * as mocks from '../../../../testing/mocks';

import { ProjectModel } from '../../project.entity';

import { find } from './find';

describe('find', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.request = mocks.request({ pagination: { filter: '', skip: 0, sort: [] } });
    params.response = mocks.response();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
