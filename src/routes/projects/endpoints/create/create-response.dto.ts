import { UserJoinSchema } from '../../../users';

import { ProjectSchema } from '../../project.schema';

export const CreateProjectResponseSchema = ProjectSchema.append({
  createdBy: UserJoinSchema.required(),
});
