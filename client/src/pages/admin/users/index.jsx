import {
	CalendarDays,
	Mail,
	MapPin,
	Phone,
	Search,
	UserRoundX
} from "lucide-react";
import { handleDate } from "../../../utils/date";
import { Input, Pagination } from "antd";
import { Navbar } from "../../../components/navbar";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { useState } from "react";

const AdminUsers = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [identity, setIdentity] = useState(searchParams.get('search') || '');
	const [value] = useDebounce(identity, 500);
	const users = useLoaderData();
	const currentPage = Number(
		searchParams.get("page") || users?.meta?.page || 1
	)
	const pageSize = Number(
		searchParams.get("limit") || users?.meta?.limit || 10
	)

	useEffect(() => {
		const url = searchParams.get('search') || '';

		if (url !== identity) {
			setIdentity(url);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams])

	useEffect(() => {
		const params = new URLSearchParams(searchParams);

		if (value) {
			params.set('search', value);
		} else {
			params.delete('search');
		}

		params.set('page', '1');
		setSearchParams(params);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value])

	return (
		<>
			<section className="hidden lg:block">
				<Navbar active={"users"} position={"top"} />
			</section>
			<main className="bg-background font-sans text-foreground min-h-screen">
				<section className="pt-6 pb-28 px-6 lg:pt-20 lg:max-w-5xl lg:mx-auto">
					<div className="mb-6">
						<div className="pt-4 lg:pt-10 lg:pb-1">
							<div className="relative">
								<Search className="size-5 text-muted-foreground absolute left-3.5 top-1/2" />
								<Input
									allowClear
									value={identity}
									className="w-full! pl-11! pr-4! py-3! rounded-xl! bg-input! border-0! text-foreground! placeholder:text-muted-foreground! focus:ring-2! focus:ring-primary! lg:py-2!"
									type="text"
									suffix={
										<Search className="size-5 text-muted-foreground absolute left-3.5" />
									}
									placeholder="Cari berdasarkan nama atau alamat email"
									onChange={(e) => setIdentity(e.target.value)}
								/>
							</div>
						</div>
					</div>
					{users?.users.length > 0 ? (
						<>
							<div className="space-y-3 pb-4">
								{users?.users.map((user, index) => (
									<div
										className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden"
										key={index}>
										<div className="p-4 flex items-start gap-4 lg:grid lg:grid-cols-1">
											<div className="flex-col min-w-0 space-y-3">
												<div className="">
													<h3 className="font-semibold text-foreground text-lg mb-1">
														{user?.name}
													</h3>
													<p className="text-sm text-muted-foreground flex items-center gap-2">
														<Mail className="size-4 text-primary" />
														{user?.email}
													</p>
												</div>
												<div className="space-y-2">
													<p className="text-sm text-muted-foreground flex items-center gap-2">
														<Phone className="size-4 text-primary" />
														{user?.phoneNumber}
													</p>
													<p className="text-sm text-muted-foreground flex items-center gap-3 lg:gap-1.5">
														<MapPin className="size-5 text-primary" />
														{user?.address}
													</p>
												</div>
												<div className="pt-2 border-t border-border/50">
													<p className="text-xs text-muted-foreground flex items-center gap-2">
														<CalendarDays className="size-3.5" />
														Terdaftar :{" "}
														{handleDate(user?.createdAt)}
													</p>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
							<Pagination
								align="center"
								current={currentPage}
								pageSize={pageSize}
								total={users?.meta?.total}
								showSizeChanger
								onChange={(page, pageSize) => {
									const params = new URLSearchParams(searchParams);
									params.set("limit", String(pageSize));
									params.set("page", String(page));
									setSearchParams(params);
								}}
							/>
						</>
					) : (
						<section className="absolute inset-0 flex items-center justify-center">
							<div className="text-center px-6 max-w-md mx-auto">
								<div className="inline-flex items-center justify-center size-24 bg-muted rounded-full mb-6 lg:size-32">
									<UserRoundX className="size-12 text-muted-foreground lg:size-16" />
								</div>
								<h3 className="font-font-heading text-2xl font-bold text-primary mb-3 lg:text-3xl">
									Pengguna Tidak Ditemukan
								</h3>
							</div>
						</section>
					)}
				</section>
			</main>
			<section className="lg:hidden">
				<Navbar active={"users"} position={"bottom"} />
			</section>
		</>
	)
}

export {
	AdminUsers
}