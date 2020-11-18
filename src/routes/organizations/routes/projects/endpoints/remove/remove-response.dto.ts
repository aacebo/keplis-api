import { UserJoinSchema } from '../../../../../users';

import { ProjectSchema } from '../../project.schema';

export const RemoveProjectResponseSchema = ProjectSchema.append({
  createdBy: UserJoinSchema.required(),
});
