import { UserJoinSchema } from '../../../users';

import { ProjectSchema } from '../../project.schema';

export const UpdateProjectResponseSchema = ProjectSchema.append({
  createdBy: UserJoinSchema.required(),
});
