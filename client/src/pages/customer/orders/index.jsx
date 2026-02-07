import { ClipboardX } from "lucide-react";
import { FilterSection } from "./filter";
import { Navbar } from "../../../components/navbar";
import { OrderSection } from "./orders";
import { useLoaderData, useSearchParams } from "react-router-dom";

const CustomerOrders = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const orders = useLoaderData();
	const currentPage = Number(
		searchParams.get("page") || orders.meta.page || 1
	)
	const pageSize = Number(
		searchParams.get("limit") || orders.meta.limit || 10
	)
	const currentStatus = searchParams.get("status") || null;
	const currentRange = searchParams.get("range") || null;

	const statusOptions = [
		{ value: "success", label: "Berhasil" },
		{ value: "pending", label: "Pending" },
		{ value: "failed", label: "Gagal" }
	]

	const rangeOptions = [
		{ value: "today", label: "Hari Ini" },
		{ value: "7d", label: "7 Hari Terakhir" },
		{ value: "30d", label: "30 Hari Terakhir" },
		{ value: "90d", label: "90 Hari Terakhir" }
	]

	return (
		<>
			<section className="hidden lg:block">
				<Navbar active={"orders"} position={"top"} />
			</section>
			<main className="bg-background font-sans text-foreground min-h-screen">
				<section className="pt-6 pb-28 px-6 lg:py-20 lg:max-w-5xl lg:mx-auto">
					<FilterSection
						range={currentRange}
						rangeOptions={rangeOptions}
						searchParams={searchParams}
						setSearchParams={setSearchParams}
						status={currentStatus}
						statusOptions={statusOptions}
					/>
					{orders?.orders.length > 0 ? (
						<OrderSection
							limit={pageSize}
							orders={orders}
							page={currentPage}
							searchParams={searchParams}
							setSearchParams={setSearchParams}
						/>
					) : (
						<section className="absolute inset-0 flex items-center justify-center">
							<div className="text-center max-w-md mx-auto">
								<div className="inline-flex items-center justify-center size-24 bg-muted rounded-full mb-6 lg:size-32">
									<ClipboardX className="size-12 text-muted-foreground lg:size-16" />
								</div>
								<h3 className="font-font-heading text-2xl font-bold text-primary mb-3 lg:text-3xl">
									Pesanan Tidak Ditemukan
								</h3>
							</div>
						</section>
					)}
				</section>
			</main>
			<section className="lg:hidden">
				<Navbar active={"orders"} position={"bottom"} />
			</section>
		</>
	)
}

export {
	CustomerOrders
}