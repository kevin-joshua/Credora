
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import UserSelect from './Pages/UserSelect.jsx';
import NotFoundPage from './Pages/NotFoundPage.jsx'
import SignUp from './Pages/SignUp.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import CreateCompany from './Pages/CreateCompany.jsx';
import { AuthProvider } from './Context/AuthContext.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import LandingPage from './Pages/LandingPage.jsx';
import Layout from './Components/Layout.jsx';
import Budget from './Pages/Budget.jsx';
import Expense from './Pages/Expense.jsx';
import RevenuePage from './Pages/RevenuePage.jsx';
import InvoicePage from './Pages/InvoicePage.jsx';
import ReportPage from './Pages/ReportPage.jsx';


const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <LandingPage/>,
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
    },
    {
      path: '/dashboard',
      element: (
        <Layout>
          <Dashboard />
        </Layout>
      ),
      errorElement: <NotFoundPage/>
    },
    {
      path: '/budget',
      element: (
        <Layout>
         <Budget/>
        </Layout>
      ),
      errorElement: <NotFoundPage/>
    },
    {
      path: '/expenses',
      element: (
        <Layout>
         <Expense/>
        </Layout>
      ),
      errorElement: <NotFoundPage/>
    },
    {
      path: '/revenue',
      element: (
        <Layout>
         <RevenuePage/>
        </Layout>
      ),
      errorElement: <NotFoundPage/>
    },
    {
      path: '/invoices',
      element: (
        <Layout>
         <InvoicePage/>
        </Layout>
      ),
      errorElement: <NotFoundPage/>
    },
    {
      path: '/reports',
      element: (
        <Layout>
         <ReportPage/>
        </Layout>
      ),
      errorElement: <NotFoundPage/>
    }
  ]
)

createRoot(document.getElementById('root')).render(
 <AuthProvider>
    <RouterProvider router={router}/>
    </AuthProvider>,
)
