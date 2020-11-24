import { UserJoinSchema } from '../../../../user.schema';

import { OrganizationSchema } from '../../../../../organizations/organization.schema';

export const UpdateOrganizationOwnerResponseSchema = OrganizationSchema.append({
  createdBy: UserJoinSchema.required(),
});
