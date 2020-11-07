import { UserJoinSchema } from '../../../users';

import { OrganizationSchema } from '../../organization.schema';

export const RemoveOrganizationResponseSchema = OrganizationSchema.append({
  createdBy: UserJoinSchema.required(),
});
