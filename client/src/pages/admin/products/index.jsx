import { CircularLoading } from "respinner";
import { CircleAlert, Plus } from "lucide-react";
import { deleteProduct, getProducts } from "../../../services/products";
import { Modal } from "antd";
import { Link, useLoaderData } from "react-router-dom";
import { Navbar } from "../../../components/navbar";
import { ProductSection } from "./products";
import { toast } from "sonner";
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient
} from "@tanstack/react-query";
import { useState } from "react";

const AdminProducts = () => {
	const initial = useLoaderData();
	const queryClient = useQueryClient();
	const [productSelected, setProductSelected] = useState(null);
	const [openModal, setOpenModal] = useState(false);

	const { isPending, mutateAsync } = useMutation({
		mutationFn: (id) => deleteProduct(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
	})

	const { data: products, isFetching } = useQuery({
		queryKey: ['products'],
		queryFn: getProducts,
		initialData: initial,
		placeholderData: keepPreviousData,
		refetchInterval: 2 * 60 * 1000
	})

	const handleOpenModal = (product) => {
		setProductSelected(product);
		setOpenModal(true);
	}

	const handleOK = async () => {
		try {
			const product = await mutateAsync(productSelected._id);
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
						Produk
					</Link>
				</section>
				<section className="space-y-3 px-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-8">
					{isFetching ? (
						<section className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
							<CircularLoading color="#3D6F2E" size={90} />
						</section>
					) : (
						<ProductSection
							products={products.data}
							handleOpenModal={handleOpenModal}
						/>
					)}
				</section>
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
							"bg-destructive! border-destructive! text-white! shadow-none!"
					}}
					cancelText={"Batal"}
					cancelButtonProps={{
						className:
							"bg-primary! border-primary! text-white! shadow-none!"
					}}
					centered>
					<p className="text-sm font-semibold my-4">
						Anda yakin ingin menghapus produk {productSelected?.name}?
					</p>
				</Modal>
			</main>
			<section className="lg:hidden">
				<Navbar active={"products"} position={"bottom"} />
			</section>
		</>
	);
}

export {
	AdminProducts
}