import { BenefitSection } from "./benefit";
import { Footer } from "../../../components/footer";
import { getGlobalProducts } from "../../../services/products";
import { getSession } from "../../../utils/axios";
import { HeroSection } from "./hero";
import { Navbar } from "../../../components/navbar/navbar";
import { ProductSection } from "./product";
import { RegisterSection } from "./register";
import { ReviewSection } from "./review";
import { useLoaderData } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const CustomerHome = () => {
	const { initial, reviews } = useLoaderData();
	const { data: products, isFetching } = useQuery({
		queryKey: ["index-products"],
		queryFn: async () => {
			const result = await getGlobalProducts();
			return result.data;
		},
		initialData: initial
	})
	const { data: session } = useQuery({
		queryKey: ['session'],
		queryFn: getSession,
		retry: false,
		staleTime: 5 * 60 * 1000,
		refetchOnMount: false,
		refetchOnWindowFocus: false
	})

	return (
		<>
			<section className="hidden lg:block">
				<Navbar active={"home"} position={"top"} />
			</section>
			<main className="relative bg-background font-sans text-foreground min-h-screen">
				<HeroSection />
				<BenefitSection />
				<ProductSection products={products} isFetching={isFetching} />
				<ReviewSection reviews={reviews} />
				{!session && (
					<RegisterSection />
				)}
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