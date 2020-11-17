import { UserJoinSchema } from '../../../users';

import { ProjectSchema } from '../../project.schema';

export const FindOneProjectResponseSchema = ProjectSchema.append({
  createdBy: UserJoinSchema.required(),
});
