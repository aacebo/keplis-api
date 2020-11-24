import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';

import { ProjectModel } from '../../project.entity';
import { projectDocument } from '../../project-document.mock';

import { findOne } from './find-one';

describe('findOne', () => {
  const project = projectDocument();
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.request = mocks.request({ params: { projectName: 'test' } });
    params.response = mocks.response();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find project', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findSpy = jest.spyOn(ProjectModel, 'findOne').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(undefined),
    } as any);

    await findOne(params.request, params.response);

    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledTimes(1);
  });

  it('should find project', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findSpy = jest.spyOn(ProjectModel, 'findOne').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(project),
    } as any);

    await findOne(params.request, params.response);

    expect(statusSpy).not.toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
