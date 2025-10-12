import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// Layouts
import Layout from './layouts/layout'
import LayoutDashboard from './layouts/layoutDashboard'
// Pages Website
import Home from './pages/website/home/page'
import SignIn from './pages/website/auth/signIn'
import SignUp from './pages/website/auth/signUp'
import Verification from './pages/website/auth/verification'
import NewPanel from './pages/website/AddPanel/newPanel'
import DetailsPanel from './pages/website/panel/detailsPanel'

// Pages Dashboard
import Dashboard from './pages/dashboard/page'
import Account from './pages/dashboard/account'
import SMMPanels from './pages/dashboard/panels/smmPanels'
import Services from './pages/website/services/page'
import Check from './pages/website/auth/check'
import Paltforms from './pages/website/platforms/page'
import OurServices from './pages/website/ourServices/page'
import LayoutAdminDashboard from './layouts/layoutAdminDashboard'
import AdminDashboard from './pages/adminDashboard/page'
import Categories from './pages/adminDashboard/categories/categories'
import Users from './pages/adminDashboard/users/users'
import Tags from './pages/adminDashboard/tags/tags'
import AddTag from './pages/adminDashboard/tags/addTag'
import AddCategory from './pages/adminDashboard/categories/addCategory'
import ServicesAdmin  from "./pages/adminDashboard/services/services"
import AddService from './pages/adminDashboard/services/addService'
import Settings from './pages/adminDashboard/settings/settings'
import Panels from './pages/adminDashboard/panels/panels'
import AddPanel from './pages/adminDashboard/panels/addPanel'
import ServicesWrapper from './pages/website/ourServices/slugs/page'
import AddUser from './pages/adminDashboard/users/addUser'
import HistoryPanel from './pages/adminDashboard/panels/historyPanel'
import TypeEmail from './pages/website/auth/typeEmail'
import ForgetPassword from './pages/website/auth/forgetPassword'
import NotificationList from './pages/commonElements/notifications/page'
import SignInAdmin from './pages/website/auth/signInAdmin'
import HistoryRequestServices from './pages/commonElements/services/historyRequestsServices'
import DetailsServiceRequest from './pages/commonElements/services/detailsServiceRequest'
import Transactions from './pages/commonElements/transactions/transactions'
import ProviderPage from './pages/website/provider/page'
import ResultPaltforms from './pages/website/platforms/resultPlatforms'
import Reviews from './pages/commonElements/reviews/reviews'
import DetailsReview from './pages/commonElements/reviews/detailsReview'
import AddWithServicesNextStep from './pages/website/ourServices/slugs/withServicesNextStep'
import PanelRequests from './pages/adminDashboard/panels/panelsRequests'
import Basic from './pages/adminDashboard/settings/basicSettings'
import PeriodsWithControl from './pages/adminDashboard/settings/periodsWithControl'
import Currency from './pages/adminDashboard/settings/currency'


function App() {
  return (<BrowserRouter>
    <Routes>
      <Route path='/*' element={<Layout/>}>
        <Route path='' element={<Home/>}/>
        {/* Authentication Routes */}
        <Route path='auth/signIn' element={<SignIn/>}/>
        <Route path='auth/admin' element={<SignInAdmin/>}/>
        <Route path='auth/signUp' element={<SignUp/>}/>
        <Route path='auth/typeEmail' element={<TypeEmail/>}/>
        <Route path='auth/typePassword/:code' element={<ForgetPassword/>}/>
        <Route path='auth/typePassword/:code/:role' element={<ForgetPassword/>}/>


        <Route path='services' element={<Services/>} />
        <Route path='providers' element={<ProviderPage/>} />
        <Route path='auth/verification' element={<Verification/>}/>
        <Route path='smm-panel/new' element={<NewPanel/>}/>
        <Route path='smm-panel/:name/:id' element={<DetailsPanel/>} />
        <Route path='platforms' element={<Paltforms/>} />
        <Route path='platforms/:id' element={<ResultPaltforms/>} />
        <Route path='platforms/:id/:subId' element={<ResultPaltforms/>} />
        {/* Services in website */}
        <Route path='our-services' element={<OurServices/>} />
        <Route path='our-services/:slug/:id' element={<ServicesWrapper/>} />
        <Route path='our-services/:slug/:id/:panel_id' element={<AddWithServicesNextStep/>} />

      </Route>
      <Route path='/dashboard/*' element={<LayoutDashboard/>}>
        <Route path='' element={<Dashboard/>}/>
        <Route path='settings' element={<Account/>}/>
        <Route path='funds' element={<Transactions/>}/>
        <Route path='SMMPanels' element={<SMMPanels/>}/>
        <Route path='SMMServices' element={<HistoryRequestServices/>}/>
        <Route path='SMMServices/:id' element={<DetailsServiceRequest/>}/>
        {/* Notifications Interfaces */}
        <Route path='notifications' element={<NotificationList/>}/>
      </Route>


      <Route path='/dashboard/admin/*' element={<LayoutAdminDashboard/>}>
        <Route path='' element={<AdminDashboard/>}/>
        <Route path='users' element={<Users/>}/>
        <Route path='users/add' element={<AddUser/>}/>
        <Route path='users/edit/:id' element={<AddUser/>}/>
        {/* Panels Collection */}
        <Route path='panels' element={<Panels/>}/>
        <Route path='panels/add' element={<AddPanel/>}/>
        <Route path='panels/edit/:id' element={<AddPanel/>}/>
        <Route path='panel/requests/edit/:id/:type' element={<AddPanel/>}/>
        <Route path='panels/history/:id/:name' element={<HistoryPanel/>}/>
        <Route path='panel/requests' element={<PanelRequests/>}/>
        {/* Reviews */}
        <Route path="reviews" element={<Reviews/>} />
        <Route path='reviews/:id' element={<DetailsReview/>}/>
        {/* Services Requests */}
        <Route path="history/servicesRequests" element={<HistoryRequestServices/>} />
        <Route path='history/servicesRequests/:id' element={<DetailsServiceRequest/>}/>
        {/* Services Collection */}
        <Route path='services' element={<ServicesAdmin/>}/>
        <Route path='services/add' element={<AddService/>}/>
        <Route path='services/edit/:id' element={<AddService/>}/>
        {/* Notifications Interfaces */}
        <Route path='notifications' element={<NotificationList/>}/>
        {/* Transctions */}
        <Route path='funds' element={<Transactions/>}/>
        <Route path='funds/:type' element={<Transactions/>}/>
        {/* Settings */}
        <Route path='settings/*' element={<Settings/>}>
          <Route index element={<Basic/>}/>
          <Route path="periods" element={<PeriodsWithControl/>}/>
          <Route path="currency" element={<Currency/>}/>
        </Route>
        <Route path='categories' element={<Categories/>}/>
        <Route path='category/add' element={<AddCategory/>}/>
        <Route path='tags' element={<Tags/>}/>
        <Route path='tag/add' element={<AddTag/>}/>
      </Route>

        {/* Authentication Routes */}
        <Route path='/auth/check/:code' element={<Check/>}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
