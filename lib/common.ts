import { enc, lib } from 'crypto-js';
import type { NextApiRequest } from 'next';
import { validatePasswordPolicy } from './auth';
export interface SelectObject {
  id: string | number;
  name: string;
  value: string;
}
export const createRandomString = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;

  let string = '';

  for (let i = 0; i < length; i++) {
    string += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return string;
};

// Create token
export function generateToken(length = 64) {
  const tokenBytes = lib.WordArray.random(length);

  return enc.Base64.stringify(tokenBytes);
}
export const domainRegex =
  /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

// Fetch the auth token from the request headers
export const extractAuthToken = (req: NextApiRequest): string | null => {
  const authHeader = req.headers.authorization || null;

  return authHeader ? authHeader.split(' ')[1] : null;
};

export const countryOptions: SelectObject[] = [
  {
    id: 0,
    name: 'Burkina Faso',
    value: 'Burkina Faso',
  },
  {
    id: 1,
    name: 'Canada',
    value: 'Canada',
  },
  {
    id: 2,
    name: 'United States',
    value: 'United States',
  },
  {
    id: 3,
    name: 'Mexico',
    value: 'Mexico',
  },
  {
    id: 4,
    name: 'Brazil',
    value: 'Brazil',
  },
  {
    id: 5,
    name: 'Argentina',
    value: 'Argentina',
  },
  {
    id: 6,
    name: 'Chile',
    value: 'Chile',
  },
  {
    id: 7,
    name: 'Peru',
    value: 'Peru',
  },
  {
    id: 8,
    name: 'Colombia',
    value: 'Colombia',
  },
  {
    id: 9,
    name: 'Venezuela',
    value: 'Venezuela',
  },
  {
    id: 10,
    name: 'Ecuador',
    value: 'Ecuador',
  },
  {
    id: 11,
    name: 'Bolivia',
    value: 'Bolivia',
  },
  {
    id: 12,
    name: 'Paraguay',
    value: 'Paraguay',
  },
  {
    id: 13,
    name: 'Uruguay',
    value: 'Uruguay',
  },
  {
    id: 14,
    name: 'Guyana',
    value: 'Guyana',
  },
  {
    id: 15,
    name: 'Suriname',
    value: 'Suriname',
  },
  {
    id: 16,
    name: 'French Guiana',
    value: 'French Guiana',
  },
  {
    id: 17,
    name: 'Falkland Islands',
    value: 'Falkland Islands',
  },
  {
    id: 18,
    name: 'Greenland',
    value: 'Greenland',
  },
  {
    id: 19,
    name: 'Saint Pierre and Miquelon',
    value: 'Saint Pierre and Miquelon',
  },
  {
    id: 20,
    name: 'Bahamas',
    value: 'Bahamas',
  },
  {
    id: 21,
    name: 'Cuba',
    value: 'Cuba',
  },
  {
    id: 22,
    name: 'Dominican Republic',
    value: 'Dominican Republic',
  },
  {
    id: 23,
    name: 'Haiti',
    value: 'Haiti',
  },
  {
    id: 24,
    name: 'Jamaica',
    value: 'Jamaica',
  },
  {
    id: 25,
    name: 'Puerto Rico',
    value: 'Puerto Rico',
  },
  {
    id: 26,
    name: 'Trinidad and Tobago',
    value: 'Trinidad and Tobago',
  },
  {
    id: 27,
    name: 'Barbados',
    value: 'Barbados',
  },
  {
    id: 28,
    name: 'Dominica',
    value: 'Dominica',
  },
  {
    id: 29,
    name: 'Grenada',
    value: 'Grenada',
  },
  {
    id: 30,
    name: 'Saint Kitts and Nevis',
    value: 'Saint Kitts and Nevis',
  },
  {
    id: 31,
    name: 'Saint Lucia',
    value: 'Saint Lucia',
  },
  {
    id: 32,
    name: 'Saint Vincent and the Grenadines',
    value: 'Saint Vincent and the Grenadines',
  },
  {
    id: 33,
    name: 'Antigua and Barbuda',
    value: 'Antigua and Barbuda',
  },
  {
    id: 34,
    name: 'Aruba',
    value: 'Aruba',
  },
  {
    id: 35,
    name: 'Belize',
    value: 'Belize',
  },
  {
    id: 36,
    name: 'Costa Rica',
    value: 'Costa Rica',
  },
  {
    id: 37,
    name: 'El Salvador',
    value: 'El Salvador',
  },
  {
    id: 38,
    name: 'Guatemala',
    value: 'Guatemala',
  },
  {
    id: 39,
    name: 'Honduras',
    value: 'Honduras',
  },
  {
    id: 40,
    name: 'Nicaragua',
    value: 'Nicaragua',
  },
  {
    id: 41,
    name: 'Panama',
    value: 'Panama',
  },
  {
    id: 42,
    name: 'Puerto Rico',
    value: 'Puerto Rico',
  },
  {
    id: 43,
    name: 'Trinidad and Tobago',
    value: 'Trinidad and Tobago',
  },
  {
    id: 44,
    name: 'Virgin Islands',
    value: 'Virgin Islands',
  },
  {
    id: 45,
    name: 'Albania',
    value: 'Albania',
  },
  {
    id: 46,
    name: 'Andorra',
    value: 'Andorra',
  },
  {
    id: 47,
    name: 'Austria',
    value: 'Austria',
  },
  {
    id: 48,
    name: 'Belarus',
    value: 'Belarus',
  },
  {
    id: 49,
    name: 'Belgium',
    value: 'Belgium',
  },
  {
    id: 50,
    name: 'Bosnia and Herzegovina',
    value: 'Bosnia and Herzegovina',
  },
  {
    id: 51,
    name: 'Bulgaria',
    value: 'Bulgaria',
  },
  {
    id: 52,
    name: 'Croatia',
    value: 'Croatia',
  },
  {
    id: 53,
    name: 'Cyprus',
    value: 'Cyprus',
  },
  {
    id: 54,
    name: 'Czech Republic',
    value: 'Czech Republic',
  },
  {
    id: 55,
    name: 'Denmark',
    value: 'Denmark',
  },
  {
    id: 56,
    name: 'Estonia',
    value: 'Estonia',
  },
  {
    id: 57,
    name: 'Finland',
    value: 'Finland',
  },
  {
    id: 58,
    name: 'France',
    value: 'France',
  },
  {
    id: 59,
    name: 'Germany',
    value: 'Germany',
  },
  {
    id: 60,
    name: 'Greece',
    value: 'Greece',
  },
  {
    id: 61,
    name: 'Hungary',
    value: 'Hungary',
  },
  {
    id: 62,
    name: 'Iceland',
    value: 'Iceland',
  },
  {
    id: 63,
    name: 'Ireland',
    value: 'Ireland',
  },
  {
    id: 64,
    name: 'Italy',
    value: 'Italy',
  },
  {
    id: 65,
    name: 'Kosovo',
    value: 'Kosovo',
  },
  {
    id: 66,
    name: 'Latvia',
    value: 'Latvia',
  },
  {
    id: 67,
    name: 'Liechtenstein',
    value: 'Liechtenstein',
  },
  {
    id: 68,
    name: 'Lithuania',
    value: 'Lithuania',
  },
  {
    id: 69,
    name: 'Luxembourg',
    value: 'Luxembourg',
  },
  {
    id: 70,
    name: 'Malta',
    value: 'Malta',
  },
  {
    id: 71,
    name: 'Moldova',
    value: 'Moldova',
  },
  {
    id: 72,
    name: 'Monaco',
    value: 'Monaco',
  },
  {
    id: 73,
    name: 'Montenegro',
    value: 'Montenegro',
  },
  {
    id: 74,
    name: 'Netherlands',
    value: 'Netherlands',
  },
  {
    id: 75,
    name: 'Algeria',
    value: 'Algeria',
  },
  {
    id: 76,
    name: 'Angola',
    value: 'Angola',
  },
  {
    id: 77,
    name: 'Benin',
    value: 'Benin',
  },
  {
    id: 78,
    name: 'Botswana',
    value: 'Botswana',
  },
  {
    id: 79,
    name: 'Burkina Faso',
    value: 'Burkina Faso',
  },
  {
    id: 80,
    name: 'Burundi',
    value: 'Burundi',
  },
  {
    id: 81,
    name: 'Cabo Verde',
    value: 'Cabo Verde',
  },
  {
    id: 82,
    name: 'Cameroon',
    value: 'Cameroon',
  },
  {
    id: 83,
    name: 'Central African Republic',
    value: 'Central African Republic',
  },
  {
    id: 84,
    name: 'Chad',
    value: 'Chad',
  },
  {
    id: 85,
    name: 'Comoros',
    value: 'Comoros',
  },
  {
    id: 86,
    name: 'Congo',
    value: 'Congo',
  },
  {
    id: 87,
    name: "Cote d'Ivoire",
    value: "Cote d'Ivoire",
  },
  {
    id: 88,
    name: 'Djibouti',
    value: 'Djibouti',
  },
  {
    id: 89,
    name: 'Egypt',
    value: 'Egypt',
  },
  {
    id: 90,
    name: 'Equatorial Guinea',
    value: 'Equatorial Guinea',
  },
  {
    id: 91,
    name: 'Eritrea',
    value: 'Eritrea',
  },
  {
    id: 92,
    name: 'Eswatini',
    value: 'Eswatini',
  },
  {
    id: 93,
    name: 'Ethiopia',
    value: 'Ethiopia',
  },
  {
    id: 94,
    name: 'Gabon',
    value: 'Gabon',
  },
  {
    id: 95,
    name: 'Gambia',
    value: 'Gambia',
  },
  {
    id: 96,
    name: 'Ghana',
    value: 'Ghana',
  },
  {
    id: 97,
    name: 'Guinea',
    value: 'Guinea',
  },
  {
    id: 98,
    name: 'Guinea-Bissau',
    value: 'Guinea-Bissau',
  },
  {
    id: 99,
    name: 'Kenya',
    value: 'Kenya',
  },
  {
    id: 100,
    name: 'Lesotho',
    value: 'Lesotho',
  },
  {
    id: 101,
    name: 'Liberia',
    value: 'Liberia',
  },
  {
    id: 102,
    name: 'Libya',
    value: 'Libya',
  },
  {
    id: 103,
    name: 'Madagascar',
    value: 'Madagascar',
  },
  {
    id: 104,
    name: 'Malawi',
    value: 'Malawi',
  },
  {
    id: 105,
    name: 'Mali',
    value: 'Mali',
  },
  {
    id: 106,
    name: 'Mauritania',
    value: 'Mauritania',
  },
  {
    id: 107,
    name: 'Mauritius',
    value: 'Mauritius',
  },
  {
    id: 108,
    name: 'Morocco',
    value: 'Morocco',
  },
  {
    id: 109,
    name: 'Mozambique',
    value: 'Mozambique',
  },
  {
    id: 110,
    name: 'Namibia',
    value: 'Namibia',
  },
  {
    id: 111,
    name: 'Niger',
    value: 'Niger',
  },
  {
    id: 112,
    name: 'Nigeria',
    value: 'Nigeria',
  },
  {
    id: 113,
    name: 'Rwanda',
    value: 'Rwanda',
  },
  {
    id: 114,
    name: 'Sao Tome and Principe',
    value: 'Sao Tome and Principe',
  },
  {
    id: 115,
    name: 'Senegal',
    value: 'Senegal',
  },
  {
    id: 116,
    name: 'Seychelles',
    value: 'Seychelles',
  },
  {
    id: 117,
    name: 'Sierra Leone',
    value: 'Sierra Leone',
  },
  {
    id: 118,
    name: 'Somalia',
    value: 'Somalia',
  },
  {
    id: 119,
    name: 'South Africa',
    value: 'South Africa',
  },
  {
    id: 120,
    name: 'South Sudan',
    value: 'South Sudan',
  },
  {
    id: 121,
    name: 'Sudan',
    value: 'Sudan',
  },
  {
    id: 122,
    name: 'Tanzania',
    value: 'Tanzania',
  },
  {
    id: 123,
    name: 'Togo',
    value: 'Togo',
  },
  {
    id: 124,
    name: 'Tunisia',
    value: 'Tunisia',
  },
  {
    id: 125,
    name: 'Uganda',
    value: 'Uganda',
  },
  {
    id: 126,
    name: 'Zambia',
    value: 'Zambia',
  },
  {
    id: 127,
    name: 'Zimbabwe',
    value: 'Zimbabwe',
  },
];

export const getAxiosError = (error: any): string => {
  if (error.response) {
    return error.response.data.error.message;
  }

  return error.message;
};

export const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Password should be at least 8 characters long
  validatePasswordPolicy(password);

  // Password should have at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Password should have at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Password should have at least one number
  if (!/\d/.test(password)) {
    return false;
  }

  // Password should have at least one special character
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return false;
  }

  return true;
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const defaultHeaders = {
  'Content-Type': 'application/json',
};

export const passwordPolicies = {
  minLength: 8,
};
