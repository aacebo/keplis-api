import { UserJoinSchema } from '../../../../../users';

import { ProjectSchema } from '../../../../../projects/project.schema';

export const CreateProjectResponseSchema = ProjectSchema.append({
  createdBy: UserJoinSchema.required(),
});
