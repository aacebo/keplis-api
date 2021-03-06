import { UserJoinSchema } from '../../../users';

import { OrganizationSchema } from '../../organization.schema';

export const CreateOrganizationResponseSchema = OrganizationSchema.append({
  createdBy: UserJoinSchema.required(),
});
