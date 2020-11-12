import * as uuid from 'uuid';

import * as mocks from '../../../../testing/mocks';

import { findOne } from './find-one';

jest.mock('../../uploader', () => ({
  Uploader: class {
    download() {
      return {
        pipe: () => 0,
      };
    }
  },
}));

describe('findOne', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({ params: { fileId: uuid.v4() } });
  });

  it('should find one', async () => {
    const statusSpy = spyOn(params.response, 'status');

    await findOne(params.request, params.response);

    expect(statusSpy).toHaveBeenCalledTimes(0);
  });
});
