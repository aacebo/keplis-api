import { UserJoinSchema } from '../../../users';

import { OrganizationSchema } from '../../organization.schema';

export const FindOneOrganizationResponseSchema = OrganizationSchema.append({
  createdBy: UserJoinSchema.required(),
});
