import { useMutation, useQueryClient } from 'react-query';
import { createLoginValidation } from '@/validations/login';
import { LoginUser } from '../../api/user/loginUser';
import { useRouter } from 'next/router';
import { UserLogin } from '@/entity/user';

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = createLoginValidation();

  const mutation = useMutation((values: UserLogin) => LoginUser(values), {
    onSuccess: () => {
      queryClient.invalidateQueries('getUser');
    },
  });

  const handleSubmit = async (values: UserLogin) => {
    try {
      const userData = await mutation.mutateAsync(values);
      console.log(userData);
      router.push('/profile');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return {
    initialValues,
    validationSchema,
    handleSubmit,
  };
}
