import { BenefitSection } from "./benefit";
import { Footer } from "../../../components/footer";
import { getGlobalProducts } from "../../../services/products";
import { HeroSection } from "./hero";
import { Navbar } from "../../../components/navbar";
import { ProductSection } from "./product";
import { RegisterSection } from "./register";
import { ReviewSection } from "./review";
import { useLoaderData } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const CustomerHome = () => {
	const { initial, reviews } = useLoaderData();
	const { data: products } = useQuery({
		queryKey: ["index-products"],
		queryFn: async () => {
			const result = await getGlobalProducts();
			return result.data;
		},
		initialData: initial,
		refetchInterval: 2 * 60 * 1000
	})

	return (
		<>
			<section className="hidden lg:block">
				<Navbar active={"home"} position={"top"} />
			</section>
			<main className="relative bg-background font-sans text-foreground min-h-screen">
				<HeroSection />
				<BenefitSection />
				<ProductSection products={products} />
				<ReviewSection reviews={reviews} />
				<RegisterSection />
				<Footer />
			</main>
			<section className="lg:hidden">
				<Navbar active={"home"} position={"bottom"} />
			</section>
		</>
	)
}

export {
	CustomerHome
}