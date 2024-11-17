import React from 'react'
import * as Yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import { useAuth } from '../../Context/useAuth'
import { useForm } from 'react-hook-form'

type Props = {}

type RegisterFormsInputs = {
  firstName: string,
  lastName: string,
  phone?: string | null,
  email: string,
  password: string,
  dateOfBirth?: Date | null,
  sex?: string | null
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phone: Yup.string().nullable(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  dateOfBirth: Yup.date().nullable(),
  sex: Yup.string().nullable()
});

const RegisterPage = (props : Props) => {
  const { registerUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormsInputs>({
      resolver: yupResolver(validationSchema),
      defaultValues: {
        dateOfBirth: null, // Устанавливаем значение по умолчанию как null
    }
  });

  const handleRegister = (formData : RegisterFormsInputs) => {
    registerUser(
      formData.firstName,
      formData.lastName,
      formData.phone ?? null,          // Если phone undefined, передаем null
      formData.email,
      formData.password,
      formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,    // Если dateOfBirth undefined, передаем null
      formData.sex ?? null             // Если sex undefined, передаем null
  );
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mb-20 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Создайте аккаунт
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleRegister)}>
                        <div>
                            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Имя
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                {...register("firstName")}
                            />
                            {errors.firstName && <p>{errors.firstName.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Фамилия
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                {...register("lastName")}
                            />
                            {errors.lastName && <p>{errors.lastName.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Телефон (необязательно)
                            </label>
                            <input
                                type="text"
                                id="phone"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                {...register("phone")}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Электронная почта
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                {...register("email")}
                            />
                            {errors.email && <p>{errors.email.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Пароль
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                {...register("password")}
                            />
                            {errors.password && <p>{errors.password.message}</p>}
                        </div>
                        <div>
                          <label htmlFor="dateOfBirth" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Дата рождения(необязательно)
                          </label>
                          <input
                              type="date"
                              id="dateOfBirth"
                              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                              {...register("dateOfBirth")}
                          />
                        </div>
                        {errors.dateOfBirth && <p>{errors.dateOfBirth.message}</p>}

                        <div>
                            <label htmlFor="sex" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Пол (необязательно)
                            </label>
                            <select
                                id="sex"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                {...register("sex")}
                            >
                                <option value="">Select your sex</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                {/* Добавьте другие варианты, если необходимо */}
                            </select>
                            {errors.sex && <p>{errors.sex.message}</p>}
                        </div>

                        {/* Кнопка отправки формы */}
                        <button
                          type="submit"
                          className="w-full text-white bg-lightGreen hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                          Зарегистрироваться
                        </button>
                  </form>
              </div>
          </div>
      </div>
  </section>
);
};

export default RegisterPage;