import { addItem } from "../../../services/carts";
import { BackButton } from "../../../components/back";
import { CircularLoading } from "respinner";
import { CookingSection } from "./cooking";
import { DescriptionSection } from "./description";
import { Footer } from "../../../components/footer";
import { getSession } from "../../../utils/axios";
import { Image } from "antd";
import { ProductCard } from "./card";
import { ProductModal } from "./modal";
import { ReviewSection } from "./review";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const CustomerProductDetail = () => {
	const navigate = useNavigate();
	const session = getSession();
	const { product, reviews } = useLoaderData();
	const [modalUser, setModalUser] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [quantity, setQuantity] = useState(1);

	const totalReviews = reviews?.analytics?.total;

	const { isPending, mutateAsync } = useMutation({
		mutationFn: (data) => addItem(data)
	})

	const handleAddItem = async () => {
		const data = {
			products: [
				{
					product: product._id,
					quantity
				}
			]
		}

		try {
			if (!session || session.role === "admin") {
				setModalUser(true);
				return;
			}

			await mutateAsync(data);
			setOpenModal(true);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [])

	return (
		<main className="relative bg-background min-h-screen text-foreground font-sans">
			<BackButton type={"button"} path={-1} />
			<section className="lg:max-w-352 lg:mx-auto lg:relative">
				<div className="lg:grid lg:grid-cols-2">
					<div className="w-full aspect-square bg-secondary p-4 rounded-3xl lg:max-w-md lg:mt-20 lg:ml-4">
						<Image
							alt={product?.name}
							src={product?.image?.imageURL}
							className="w-full! object-cover! rounded-2xl!"
						/>
					</div>
					<div className="hidden lg:block lg:justify-self-center lg:self-end">
						<ProductCard
							handleAddItem={handleAddItem}
							isPending={isPending}
							product={product}
							quantity={quantity}
							setQuantity={setQuantity}
						/>
					</div>
				</div>
				<div className="px-5 pt-6 pb-2 bg-background lg:pb-0">
					<DescriptionSection product={product} reviews={reviews} />
					<ReviewSection reviews={reviews} totalReviews={totalReviews} />
					<CookingSection />
				</div>
				<div className="fixed bottom-0 left-0 right-0 px-5 py-4 z-20 shadow-lg lg:absolute lg:shadow-none">
					<button
						disabled={isPending}
						className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-base transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] lg:hidden"
						onClick={() => handleAddItem()}>
						{isPending ? (
							<CircularLoading size={26} color="#FFFFFF" />
						) : (
							<>
								<ShoppingBag className="size-6" />
								<span>Tambah ke Keranjang</span>
							</>
						)}
					</button>
				</div>
			</section>
			<ProductModal
				type={"navigation"}
				navigate={navigate}
				openModal={openModal}
				product={product}
				setOpenModal={setOpenModal}
			/>
			<ProductModal
				type={"authentication"}
				modalUser={modalUser}
				navigate={navigate}
				setModalUser={setModalUser}
			/>
			<Footer />
		</main>
	)
}

export {
	CustomerProductDetail
}