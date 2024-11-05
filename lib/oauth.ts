import { GitHub, Google } from 'arctic';

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.LUCIA_AUTH_URL + '/api/auth/google/callback'
);

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!,
  {
    redirectURI: process.env.LUCIA_AUTH_URL + '/api/auth/github/callback',
  }
);
