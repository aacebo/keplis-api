import * as uuid from 'uuid';

import * as mocks from '../../../../testing/mocks';

import { create } from './create';

describe('create', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      protocol: 'http',
      file: { id: uuid.v4() },
      get: () => 'localhost',
    });
  });

  it('should send response url', async () => {
    const status = { send: () => 0 };
    const sendSpy = spyOn(status, 'send');

    await create(params.request, { ...params.response, status: () => status });

    expect(sendSpy).toHaveBeenCalledWith({
      url: `http://localhost/files/${params.request.file.id}`,
    });
  });
});
