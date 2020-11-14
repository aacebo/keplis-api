import { UserJoinSchema } from '../../../../../users';

import { OrganizationSchema } from '../../../../organization.schema';

export const UpdateOrganizationOwnerResponseSchema = OrganizationSchema.append({
  createdBy: UserJoinSchema.required(),
});
