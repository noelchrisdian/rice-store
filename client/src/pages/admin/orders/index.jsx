import { CircularLoading } from "respinner";
import { ClipboardX } from "lucide-react";
import { FilterSection } from "./filter";
import { getOrders } from "../../../services/orders";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Navbar } from "../../../components/navbar";
import { OrderSection } from "./orders";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { useState } from "react";

const AdminOrders = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [name, setName] = useState(searchParams.get("search") || "");
	const [value] = useDebounce(name, 500);
	const initial = useLoaderData();
	const currentPage = Number(searchParams.get("page") || 1);
	const pageSize = Number(searchParams.get("limit") || 10);

	const currentStatus = searchParams.get("status") || null;
	const currentRange = searchParams.get("range") || null;

	const { data: orders, isFetching } = useQuery({
		queryKey: [
			"orders",
			{
				limit: pageSize,
				page: currentPage,
				search: value,
				status: currentStatus,
				range: currentRange
			}
		],
		queryFn: () =>
			getOrders({
				limit: pageSize,
				page: currentPage,
				search: value,
				status: currentStatus,
				range: currentRange
			}),
		initialData: initial,
		placeholderData: keepPreviousData,
		refetchInterval: 2 * 60 * 1000
	})

	useEffect(() => {
		const url = searchParams.get("search") || "";

		if (url !== name) {
			setName(url);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams.get("search")]);

	useEffect(() => {
		const params = new URLSearchParams(searchParams);

		if (value) {
			params.set("search", value);
		} else {
			params.delete("search");
		}

		params.set("page", "1");
		setSearchParams(params, { replace: true });

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value])

	return (
		<>
			<section className="hidden lg:block">
				<Navbar active={"orders"} position={"top"} />
			</section>
			<main className="bg-background font-sans text-foreground min-h-screen">
				<section className="pt-6 pb-28 px-6 lg:py-20 lg:max-w-5xl lg:mx-auto">
					<FilterSection
						currentStatus={currentStatus}
						currentRange={currentRange}
						name={name}
						searchParams={searchParams}
						setName={setName}
						setSearchParams={setSearchParams}
					/>
					{isFetching ? (
						<section className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
							<CircularLoading color="#3D6F2E" size={90} />
						</section>
					) : orders?.data?.orders?.length > 0 ? (
						<OrderSection
							limit={pageSize}
							orders={orders?.data}
							page={currentPage}
							searchParams={searchParams}
							setSearchParams={setSearchParams}
						/>
					) : !isFetching && (
						<section className="absolute inset-0 flex items-center justify-center py-16">
							<div className="text-center px-6 max-w-md mx-auto">
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
	AdminOrders
}