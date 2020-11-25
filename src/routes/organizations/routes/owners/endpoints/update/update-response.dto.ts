import { UserJoinSchema } from '../../../../../users/user.schema';

import { OrganizationSchema } from '../../../../organization.schema';

export const UpdateOrganizationOwnerResponseSchema = OrganizationSchema.append({
  createdBy: UserJoinSchema.required(),
});
