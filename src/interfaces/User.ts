import {Document} from 'mongoose';
interface User extends Document {
  user_name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
}

interface OutputUser {
  id: string;
  user_name: string;
  email: string;
}

interface TokenMessageResponse {
  message: string;
  user: OutputUser;
  token: string;
}

interface inputUser {
  user_name: string;
  email: string;
  password: string;
}

interface Credentials {
  username: string;
  password: string;
}

interface TokenUser {
  id: string;
  role: 'user' | 'admin';
}

export {User, OutputUser, inputUser, TokenUser, Credentials, TokenMessageResponse};
