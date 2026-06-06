export const defaultBaseUrl = 'https://motoparts-taiwan.com';

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || defaultBaseUrl;
}
