import {
	CalendarDays,
	Mail,
	MapPin,
	Phone,
	Search,
	UserRoundX,
} from "lucide-react";
import { columns } from "./columns";
import { handleDate } from "../../../utils/date";
import {
	Input,
	Pagination,
	Table
} from "antd";
import { Navbar } from "../../../components/Navbar";
import { useLoaderData, useSearchParams } from "react-router-dom";

const AdminUsers = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const users = useLoaderData();
	const currentPage = Number(
		searchParams.get("page") || users?.meta?.page || 1
	)
	const pageSize = Number(
		searchParams.get("limit") || users?.meta?.limit || 10
	)

	return (
		<>
			<section className="hidden lg:block">
				<Navbar active={"users"} position={"top"} />
			</section>
			<main className="bg-background font-sans text-foreground min-h-screen lg:hidden">
				<section className="pt-6 pb-28 px-6 lg:hidden">
					<div className="mb-6">
						<div className="pt-4 lg:pt-10 lg:pb-1">
							<div className="relative">
								<Search className="size-5 text-muted-foreground absolute left-3.5 top-1/2" />
								<Input
									className="w-full! pl-11! pr-4! py-3! rounded-xl! bg-input! border-0! text-foreground! placeholder:text-muted-foreground! focus:ring-2! focus:ring-primary! lg:py-2!"
									type="text"
									suffix={
										<Search className="size-5 text-muted-foreground absolute left-3.5" />
									}
									placeholder="Cari berdasarkan nama atau alamat email"
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
										<div className="p-4 flex items-start gap-4">
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
													<p className="text-sm text-muted-foreground flex items-center gap-3">
														<MapPin className="size-5 text-primary" />
														{user?.address}
													</p>
												</div>
												<div className="pt-2 border-t border-border/50">
													<p className="text-xs text-muted-foreground flex items-center gap-2">
														<CalendarDays className="size-3.5" />
														Terdaftar : {handleDate(user?.createdAt)}
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
						<section className="flex-1 flex items-center justify-center py-16">
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
			<main className="hidden bg-background font-sans text-foreground min-h-screen lg:block">
				<div className="lg:pt-40 lg:px-10 lg:pb-10">
					<Table
						columns={columns(searchParams)}
						dataSource={users?.users}
						pagination={{
							position: ['none', 'bottomCenter'],
							pageSize,
							current: currentPage,
							total: users?.meta?.total,
							showSizeChanger: true,
							onChange: (page, pageSize) => {
								const params = new URLSearchParams();
								params.set('limit', String(pageSize));
								params.set('page', String(page));
								setSearchParams(params)
							}
						}}
					/>
				</div>
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