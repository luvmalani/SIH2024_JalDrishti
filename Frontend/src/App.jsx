import { Route, Routes, useLocation } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

import Feedback from "./pages/Feedback";
import Homes from "./main/Home";

function App() {
	const location = useLocation(); // Get the current location

	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 mt-44 '>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='' />
				<div className='' />
			</div>
			
			{location.pathname !== '/home' && location.pathname !== '/feedback' && <Sidebar />}

			
			<Routes>
				<Route path='/' element={<ProductsPage />} />
				<Route path='/products' element={<ProductsPage />} />
				<Route path='/users' element={<UsersPage />} />
				<Route path='/sales' element={<SalesPage />} />
				<Route path='/orders' element={<OrdersPage />} />
				<Route path='/analytics' element={<AnalyticsPage />} />
				<Route path='/settings' element={<SettingsPage />} />
				<Route path="/feedback" element={<Feedback/>} />
				<Route path="/home" element={<Homes />} />
			</Routes>
		</div>
	);
}

export default App;
