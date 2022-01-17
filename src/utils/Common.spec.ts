import 'mocha';
import { RoleId } from 'domain/enums/user/RoleId';
import { expect } from 'chai';
import { generateAuthRequiredDoc } from './Common';

describe('Utils - Common', () => {
  it('Generate authentication required without param', () => {
    const data = generateAuthRequiredDoc();
    expect(data).to.eq('Authentication required');
  });

  it('Generate authentication required for API documentation', () => {
    const data = generateAuthRequiredDoc(RoleId.SuperAdmin, RoleId.Manager);
    expect(data).to.eq('Role required: SuperAdmin, Manager');
  });
});
