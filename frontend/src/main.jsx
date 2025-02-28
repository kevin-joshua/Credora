
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import Layout from './Pages/Layout.jsx';
import UserSelect from './Pages/UserSelect.jsx';
import NotFoundPage from './Pages/NotFoundPage.jsx'
import SignUp from './Pages/SignUp.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import CreateCompany from './Pages/CreateCompany.jsx';
import { AuthProvider } from './Context/AuthContext.jsx';


const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout/>,
      errorElement: <NotFoundPage/>
    },
    {
      path: '/userSelect',
      element: <UserSelect/>,
      errorElement: <NotFoundPage/>
    },
    {
      path: '/adminSignUp',
      element: <SignUp/>,
      errorElement: <NotFoundPage/>
    },
    {
      path: '/employeeSignUp',
      element: <SignUp/>,
      errorElement: <NotFoundPage/>
    },
    {
      path: '/login',
      element: <LoginPage/>,
      errorElement: <NotFoundPage/>
    },
    {
      path: '/createCompany',
      element: <CreateCompany/>,
      errorElement: <NotFoundPage/>
    }
  ]
)

createRoot(document.getElementById('root')).render(
 <AuthProvider>
    <RouterProvider router={router}/>
    </AuthProvider>,
)
