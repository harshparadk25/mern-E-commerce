
import { Route, Routes } from 'react-router-dom'
import AuthLayout from './components/auth/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'
import AdminLayout from './components/admin/layout'
import AdminDashboard from './pages/admin-view/dashboard'
import AdminProducts from './pages/admin-view/products'
import AdminOrders from './pages/admin-view/orders'
import AdminFeatures from './pages/admin-view/features'
import ShoppingLayout from './components/shopping/layout'
import NotFound from './pages/notfound'
import ShoppingHome from './pages/shopping-view/home'
import ShopListingPage from './pages/shopping-view/listingPage'
import ShopCheckOut from './pages/shopping-view/checkOut'
import ShopAccount from './pages/shopping-view/account'
import CheckAuth from './components/common/checkAuth'
import UnauthPage from './pages/unauth-page'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth } from './store/auth-slice/index'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from "@/components/ui/skeleton"
import PaypalReturn from './pages/shopping-view/paypal-return'
import PaymentSuccessPage from './pages/shopping-view/payment-success'
import Search from './pages/shopping-view/search'

function App() {

   const  {isAuthenticated,user,isLoading} = useSelector(state => state.auth);
   
   const dispatch = useDispatch();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    dispatch(checkAuth(token));
  }, [dispatch]);

    if (isLoading) return  <Skeleton className="h-[600px] w-[600px] " />;


  return (
  <div className='flex flex-col overflow-hidden bg-white'>
    
    <Routes>
      
      <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
      <Route path='/auth' element={<CheckAuth isAuthenticated={isAuthenticated} user={user}>
        <AuthLayout/>
      </CheckAuth>}>
        <Route path='login' element={<AuthLogin/>}/>
        <Route path='register' element={<AuthRegister/>}/>
      </Route>
      <Route path='/admin' element={<CheckAuth isAuthenticated={isAuthenticated} user={user}>
        <AdminLayout/>
      </CheckAuth>}>
      <Route path='dashboard' element={<AdminDashboard/>}/>
      <Route path='products' element={<AdminProducts/>}/>
      <Route path='orders' element={<AdminOrders/>}/>
      <Route path='features' element={<AdminFeatures/>}/>
      </Route>
      <Route path='/shop' element={<CheckAuth  isAuthenticated={isAuthenticated} user={user}>
        <ShoppingLayout/>
      </CheckAuth>}>
      <Route path='home' element={<ShoppingHome/>}/>
      <Route path='listing' element={<ShopListingPage/>}/>
      <Route path='checkout' element={<ShopCheckOut/>}/>
      <Route path='account' element={<ShopAccount/>}/>
      <Route path='paypal-return' element={<PaypalReturn/>}/>
      <Route path='payment-success' element={<PaymentSuccessPage/>}/>
      <Route path='search' element={<Search/>}/>
      </Route>
      <Route path='*' element={<NotFound/>}></Route>
      <Route path='/unauth-page' element={<UnauthPage/>}/>
    </Routes>
  </div>
  )
}

export default App
