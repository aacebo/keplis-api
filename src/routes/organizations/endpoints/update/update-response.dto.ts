import { UserJoinSchema } from '../../../users';

import { OrganizationSchema } from '../../organization.schema';

export const UpdateOrganizationResponseSchema = OrganizationSchema.append({
  createdBy: UserJoinSchema.required(),
});
