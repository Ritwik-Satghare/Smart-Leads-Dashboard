import { User, IUser } from '../users/user.model';
import { IRegisterRequest, ILoginRequest, UserRole } from '../../types';
import { generateToken, ConflictError, UnauthorizedError } from '../../utils';

interface AuthResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  token: string;
}

const toAuthResult = (user: IUser, token: string): AuthResult => ({
  user: {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  },
  token,
});

export const registerUser = async (data: IRegisterRequest): Promise<AuthResult> => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new ConflictError('An account with this email already exists');
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role || UserRole.SALES_USER,
  });

  const token = generateToken({
    userId: String(user._id),
    email: user.email,
    role: user.role,
  });

  return toAuthResult(user, token);
};

export const loginUser = async (data: ILoginRequest): Promise<AuthResult> => {
  const user = await User.findOne({ email: data.email }).select('+password');

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = generateToken({
    userId: String(user._id),
    email: user.email,
    role: user.role,
  });

  return toAuthResult(user, token);
};

export const getUserProfile = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId);
};
