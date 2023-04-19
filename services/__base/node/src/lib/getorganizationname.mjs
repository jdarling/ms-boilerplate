import config from './config.mjs';
import pkg from '../package.json' assert { type: 'json' };

const DEFAULT_ORGANIZATION_NAME = 'boilerplate';

const getOrganizationName = (
  name = pkg.name,
  defaultName = config.organizationName || DEFAULT_ORGANIZATION_NAME
) => {
  if (name[0] === '@') {
    const [org] = name.split('/').shift(0);
    if (org && org.length) {
      return name;
    }
  }
  return defaultName;
};

export default getOrganizationName;
