import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";



import Rainfall from "../components/products/Rainfall";
import Water from "../components/products/Water";
import WaterDemand from "../components/products/WaterDemand";

const ProductsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Products' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8 '>
				{/* STATS */}
				

				

				{/* CHARTS */}
				<div className=''>
					<Rainfall/>
					<Water/>
					<WaterDemand/>
					
				</div>

			</main>
		</div>
	);
};
export default ProductsPage;
