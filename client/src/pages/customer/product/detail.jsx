import { addItem } from "../../../services/carts";
import { BackButton } from "../../../components/back";
import {
	CircleCheck,
	Contact,
	ShoppingBag
} from "lucide-react";
import { CircularLoading } from "respinner";
import { CookingSection } from "./cooking";
import { DescriptionSection } from "./description";
import { Footer } from "../../../components/footer";
import { getSession } from "../../../utils/axios";
import { Modal } from "antd";
import { ReviewSection } from "./review";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const CustomerProductDetail = () => {
	const navigate = useNavigate();
	const session = getSession();
	const { product, reviews } = useLoaderData();
	const [openModal, setOpenModal] = useState(false);
	const [modalUser, setModalUser] = useState(false);

	const handleCancel = () => {
		setOpenModal(false);
	}

	const totalReviews = reviews?.analytics?.total;

	const { isPending, mutateAsync } = useMutation({
		mutationFn: (data) => addItem(data)
	})

	const handleAddItem = async () => {
		const data = {
			products: [
				{
					product: product._id,
					quantity: 1
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
	}, []);

	return (
		<main className="relative bg-background min-h-screen text-foreground font-sans">
			<BackButton type={"button"} path={-1} />
			<section className="lg:max-w-7xl lg:mx-auto lg:relative">
				<section className="w-full aspect-square bg-secondary p-4 rounded-3xl lg:max-w-md lg:mt-4">
					<img
						alt={product?.name}
						src={product?.image?.imageURL}
						className="w-full h-full object-cover rounded-2xl"
					/>
				</section>
				<section className="px-5 pt-6 pb-2 bg-background lg:pb-16">
					<DescriptionSection product={product} reviews={reviews} />
					<ReviewSection reviews={reviews} totalReviews={totalReviews} />
					<CookingSection />
				</section>
				<div className="fixed bottom-0 left-0 right-0 px-5 py-4 z-20 shadow-lg lg:absolute lg:shadow-none">
					<button
						disabled={isPending}
						className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-base transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
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
			<Modal
				open={openModal}
				title={null}
				centered
				closeIcon={null}
				footer={null}
				styles={{
					content: {
						borderRadius: "36px",
						overflow: "hidden"
					}
				}}
				width={380}>
				<div className="bg-card p-6">
					<div className="flex flex-col items-center text-center mb-6">
						<div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
							<CircleCheck className="size-10 fill-primary text-white" />
						</div>
						<h2 className="font-heading text-2xl font-bold text-foreground mb-2">
							Item berhasil ditambah
						</h2>
						<p className="text-base text-muted-foreground">
							{product?.name} berhasil ditambahkan ke keranjang belanja
							Anda
						</p>
					</div>

					<div className="space-y-3">
						<button
							onClick={() => navigate("/cart")}
							className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-base transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
							<span>Lihat Keranjang</span>
						</button>

						<button
							onClick={handleCancel}
							className="w-full h-14 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-base transition-transform flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
							<span>Lanjutkan Belanja</span>
						</button>
					</div>
				</div>
			</Modal>
			<Modal
				open={modalUser}
				onCancel={() => setModalUser(false)}
				title={null}
				centered
				footer={null}
				styles={{
					content: {
						padding: 0,
						borderRadius: "36px",
						overflow: "hidden"
					}
				}}
				width={380}>
				<div className="bg-card p-6">
					<div className="flex flex-col items-center text-center mb-6">
						<div className="size-20 p-1 bg-primary rounded-full flex items-center justify-center mb-4">
							<Contact className="size-12 text-white" />
						</div>
						<h2 className="font-heading text-2xl font-bold text-foreground mb-2">
							Masuk ke Akun Anda
						</h2>
						<p className="text-base text-muted-foreground">
							Anda perlu masuk ke akun Anda untuk dapat menambahkan
							produk ke keranjang belanja
						</p>
					</div>

					<div className="space-y-3">
						<button
							onClick={() => {
								setModalUser(false);
								navigate("/sign-in");
							}}
							className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-base transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
							<span>Masuk</span>
						</button>

						<button
							onClick={() => {
								setModalUser(false);
								navigate("/sign-up");
							}}
							className="w-full h-14 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-base cursor-pointer transition-transform flex items-center justify-center gap-2 active:scale-[0.98]">
							<span>Daftar</span>
						</button>
					</div>
				</div>
			</Modal>
			<Footer />
		</main>
	)
}

export {
	CustomerProductDetail
}