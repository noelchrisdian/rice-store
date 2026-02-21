import { BackButton } from "../../../../components/back";
import { CircleAlert, SquarePen } from "lucide-react";
import { deleteReview, getReviews } from "../../../../services/reviews";
import { getInventories } from "../../../../services/inventories";
import { InventorySection } from "./inventory";
import {
	Link,
	useLoaderData,
	useSearchParams
} from "react-router-dom";
import { Loader } from "../../../../components/loader";
import { Modal } from "antd";
import { ProductSection } from "./product";
import { ReviewSection } from "./review";
import { toast } from "sonner";
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient
} from "@tanstack/react-query";
import { useState } from "react";

const AdminDetailProduct = () => {
	const { initialInventories, product, initialReviews } = useLoaderData();
	const [modal, setModal] = useState({
		open: false,
		reviewID: null
	})
	const [searchParams, setSearchParams] = useSearchParams();
	const queryClient = useQueryClient();

	const currentPageInventory = Number(searchParams.get("inventoryPage") || 1);
	const pageSizeInventory = Number(searchParams.get("inventoryLimit") || 10);

	const currentPageReview = Number(searchParams.get("reviewPage") || 1);
	const pageSizeReview = Number(searchParams.get("reviewLimit") || 10);

	const { data: inventories, isFetching: isFetchingInventory } = useQuery({
		queryKey: [
			"inventories",
			product._id,
			{ limit: pageSizeInventory, page: currentPageInventory }
		],
		queryFn: () =>
			getInventories(product._id, {
				limit: pageSizeInventory,
				page: currentPageInventory
			}),
		refetchInterval: 2 * 60 * 1000,
		initialData: initialInventories,
		placeholderData: keepPreviousData
	})

	const { data: reviews, isFetching: isFetchingReview } = useQuery({
		queryKey: [
			"reviews",
			product._id,
			{ limit: pageSizeReview, page: currentPageReview }
		],
		queryFn: () =>
			getReviews(product._id, {
				limit: pageSizeReview,
				page: currentPageReview
			}),
		refetchInterval: 5 * 60 * 1000,
		initialData: initialReviews,
		placeholderData: keepPreviousData
	})

	const { isPending, mutateAsync } = useMutation({
		mutationFn: ({ id, reviewID }) => deleteReview(id, reviewID),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["reviews", product._id] })
	})

	const handleCloseModal = () => {
		setModal({ open: false, reviewID: null });
	}

	const handleDeleteReview = async (id, reviewID) => {
		try {
			const response = await mutateAsync({ id, reviewID });
			toast.success(
				`Ulasan dari ${response?.data?.user?.name} berhasil dihapus`
			)
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}

		setModal({ open: false, reviewID: null });
	}

	return (
		<main className="bg-background font-sans text-foreground min-h-screen py-10 lg:py-20">
			<BackButton type={"link"} path={"/admin/products"} />
			<section className="flex items-center justify-end pb-6 pr-4 lg:pr-6">
				<Link
					to={`/admin/products/edit-product/${product._id}`}
					className="flex bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm justify-center items-center gap-3 shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
					<SquarePen className="size-4" />
					Ubah Produk
				</Link>
			</section>
			<div className="lg:grid lg:grid-cols-2">
				<div className="">
					<ProductSection product={product} />
					{isFetchingInventory ? (
						<Loader color={"#3D6F2E"} size={90} />
					) : (
						<InventorySection
							inventories={inventories?.data}
							limit={pageSizeInventory}
							page={currentPageInventory}
							product={product}
							searchParams={searchParams}
							setSearchParams={setSearchParams}
						/>
					)}
				</div>
				{isFetchingReview ? (
					<Loader color={"#3D6F2E"} size={90} />
				) : (
					<ReviewSection
						limit={pageSizeReview}
						page={currentPageReview}
						reviews={reviews?.data}
						searchParams={searchParams}
						setModal={setModal}
						setSearchParams={setSearchParams}
					/>
				)}
			</div>
			<Modal
				open={modal.open}
				onCancel={handleCloseModal}
				onOk={() => handleDeleteReview(product._id, modal.reviewID)}
				title={
					<div className="flex flex-row items-center gap-2">
						<CircleAlert className="text-destructive size-6" />
						<p className="text-md">Hapus Ulasan</p>
					</div>
				}
				centered
				confirmLoading={isPending}
				okText={"Hapus"}
				okButtonProps={{
					className:
						"bg-destructive! border-desctructive! text-white! shadow-none!"
				}}
				cancelText={"Batal"}
				cancelButtonProps={{
					className: "bg-primary! border-primary! text-white! shadow-none!"
				}}>
				<p className="text-sm font-semibold my-4">
					Anda yakin ingin menghapus ulasan ini?
				</p>
			</Modal>
		</main>
	)
}

export {
	AdminDetailProduct
}