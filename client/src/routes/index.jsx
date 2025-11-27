import { AuthLayout } from '../layout/auth';
import { createBrowserRouter, redirect } from 'react-router-dom';
import { getSession } from '../utils/axios';
import { LoginForm } from '../pages/login/Form';
import { RegisterForm } from '../pages/register/Form';
import { router as AdminRouter } from './admin';

const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                path: '/sign-in',
                loader: () => {
                    const session = getSession();
                    if (session) {
                        if (session.role === 'admin') {
                            throw redirect('/admin');
                        } else {
                            throw redirect('/');
                        }
                    }
                },
                element: <LoginForm />
            },
            {
                path: '/sign-up',
                element: <RegisterForm />
            }
        ]
    },
    ...AdminRouter
])

export {
    router
}