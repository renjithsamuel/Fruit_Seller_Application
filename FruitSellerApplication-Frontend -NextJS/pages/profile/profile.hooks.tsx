import { useMutation, useQueryClient } from 'react-query';
import { createLoginValidation } from '@/validations/login';
import { UpdateUser } from '../../api/user/updateUser';
import { DeleteUser } from '../../api/user/deleteUser';
import { useRouter } from 'next/router';
import { UserInitialValues } from '@/entity/user';
import { useUserContext } from '@/context/userContext/userContext.hooks';

export function useProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isUserError, isUserLoading } = useUserContext();

  const validationSchema = createLoginValidation();

  const mutation = useMutation((values: UserInitialValues) => UpdateUser(values), {
    onSuccess: () => {
      queryClient.invalidateQueries('getUser');
    },
  });

  const handleSubmit = async (values: UserInitialValues) => {
    console.log(values);
    try {
      const userData = await mutation.mutateAsync(values);
      console.log(userData);
    } catch (error) {
      console.error('update user failed:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirm('Are you sure?')) {
      return;
    }
    if (await DeleteUser()) {
      Logout();
    }
  };

  const Logout = () => {
    if (confirm('Sure to logout?')) {
      localStorage.clear();
      queryClient.invalidateQueries('getUser');
      queryClient.invalidateQueries('cartItems');
      router.push('/');
      return;
    }
  };

  const initialValues: UserInitialValues = {
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'buyer',
    dateOfBirth: user?.dateOfBirth && new Date(user?.dateOfBirth),
    phoneNumber: user?.phoneNumber,
    preferredLanguage: user?.preferredLanguage || '',
    address: user?.address || '',
    country: user?.country || '',
  };

  return {
    initialValues,
    validationSchema,
    handleSubmit,
    handleDeleteUser,
    Logout,
    isUserError,
    isUserLoading,
    user,
    router,
  };
}
