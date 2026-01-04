import {
	CircleAlert,
	Plus,
	SquarePen,
	Trash
} from "lucide-react";
import { deleteProduct } from "../../../services/products";
import { handleCurrency } from "../../../utils/price";
import { Image, Modal } from "antd";
import {
	Link,
	useLoaderData,
	useNavigate,
	useRevalidator
} from "react-router-dom";
import { Navbar } from "../../../components/Navbar";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const AdminProducts = () => {
	const products = useLoaderData();
	const navigate = useNavigate();
	const revalidator = useRevalidator();
	const [productSelected, setProductSelected] = useState(null);
	const [openModal, setOpenModal] = useState(false);

	const { isPending, mutateAsync } = useMutation({
		mutationFn: (id) => deleteProduct(id)
	})

	const handleOpenModal = (product) => {
		setProductSelected(product);
		setOpenModal(true);
	}

	const handleOK = async () => {
		try {
			const product = await mutateAsync(productSelected._id);
			revalidator.revalidate();
			toast.success(`${product?.data?.name} berhasil dihapus`);
		} catch (error) {
			toast.error(error?.response?.data?.message);
		} finally {
			setProductSelected(null);
			setOpenModal(false);
		}
	}

	const handleCancel = () => {
		setProductSelected(null);
		setOpenModal(false);
	}

	return (
		<>
			<section className="hidden lg:block">
				<Navbar active={"products"} position={"top"} />
			</section>
			<main className="bg-background text-foreground font-sans min-h-screen pt-10 pb-32 lg:py-20">
				<section className="flex items-center justify-end pb-6 pr-4 lg:pb-12 lg:pr-8">
					<Link
						to={"/admin/products/add-product"}
						className={
							"flex bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm justify-center items-center gap-3 shadow-sm active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
						}>
						<Plus className="size-4 bg-background rounded-full text-primary" />
						Buat Produk
					</Link>
				</section>
				<section className="space-y-3 px-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-8">
					{products?.map((product, index) => (
						<div
							className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden h-full"
							key={index}>
							<div className="p-4 flex gap-3 lg:grid lg:grid-cols-1">
								<Image
									alt={product.name}
									width={95}
									src={product.image.imageURL}
									onClick={(e) => e.stopPropagation()}
									preview={true}
									className="size-12 rounded-xl object-cover bg-muted"
								/>
								<div
									className="flex-1 min-w-0 cursor-pointer"
									onClick={() =>
										navigate(`/admin/products/${product._id}`)
									}>
									<div className="flex items-start justify-between gap-2 mb-1">
										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-foreground text-base truncate">
												{product.name}
											</h3>
										</div>
										<span
											className={`text-xs px-2 py-1 rounded-md ${
												product.stock >= 10
													? "bg-primary/10"
													: product.stock === 0
													? "bg-destructive/80 text-white"
													: "bg-orange-500 text-white"
											} text-primary font-medium whitespace-nowrap`}>
											{product.stock >= 10
												? "Tersedia"
												: product.stock === 0
												? "Habis"
												: "Stok Menipis"}
										</span>
									</div>
									<div className="flex items-center justify-between mt-2">
										<div>
											<p className="font-heading text-xl font-bold text-primary mb-2">
												{handleCurrency(product.price)}
											</p>
											<p className="text-xs text-muted-foreground">
												Stok : {product.stock}
											</p>
										</div>
										<div
											className="flex gap-1.5"
											onClick={(e) => e.stopPropagation()}>
											<Link
												to={`/admin/products/edit-product/${product._id}`}
												className="size-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center transition-transform
												cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
												<SquarePen className="size-4" />
											</Link>
											<button
												className="size-9 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center transition-transform cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-destructive/50"
												onClick={() => handleOpenModal(product)}>
												<Trash className="size-4" />
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
					<Modal
						open={openModal}
						onCancel={handleCancel}
						onOk={handleOK}
						confirmLoading={isPending}
						title={
							<div className="flex flex-row items-center gap-2">
								<CircleAlert className="text-destructive size-6" />
								<p className="text-md">Hapus Produk</p>
							</div>
						}
						okText={"Hapus"}
						okButtonProps={{
							className:
								"bg-destructive! border-destructive! text-white! shadow-none!",
						}}
						cancelText={"Batal"}
						cancelButtonProps={{
							className:
								"bg-primary! border-primary! text-white! shadow-none!",
						}}
						centered>
						<p className="text-sm font-semibold my-4">
							Anda yakin ingin menghapus produk {productSelected?.name}?
						</p>
					</Modal>
				</section>
			</main>
			<section className="lg:hidden">
				<Navbar active={"products"} position={"bottom"} />
			</section>
		</>
	)
}

export {
    AdminProducts
}