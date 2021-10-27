export type Roles = 'suscriptor' | 'admin';
export interface User {
  username: string,
  password: string,
}

export interface UserResponse {
  email: string,
  dni: string,
  name: string,
  last_name: string,
  second_last_name: string,
  gender: number,
  business: number,
  country: number,
  token: string,
  role: Roles
}
