import { Link } from "react-router-dom";
import { UserX } from "lucide-react";

const UserSection = ({ recentUsers, userStats }) => {
	return (
		<div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5">
			{recentUsers?.data.length > 0 ? (
				<>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-font-heading text-2xl font-semibold text-foreground">
							Pengguna
						</h3>
						<Link
							to={"/admin/users"}
							className="text-primary text-sm font-medium active:text-primary/80 focus:outline-none focus:underline">
							Lihat semua
						</Link>
					</div>
					<div className="grid grid-cols-2 gap-3 mb-6">
						<div className="bg-muted rounded-xl p-3 text-center">
							<p className="font-font-heading text-xl font-bold text-foreground mb-1">
								{userStats?.data?.total}
							</p>
							<p className="text-[11px] text-muted-foreground">
								Total Pengguna
							</p>
						</div>
						<div className="bg-muted rounded-xl p-3 text-center">
							<p className="font-font-heading text-xl font-bold text-foreground mb-1">
								{userStats?.data?.newThisMonth}
							</p>
							<p className="text-[11px] text-muted-foreground">
								Pengguna Baru Bulan Ini
							</p>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						{recentUsers?.data.map((user) => (
							<div
								className="flex items-center justify-center gap-4"
								key={user?._id}>
								<img
									width={75}
									src={user?.avatar?.imageURL}
									className="size-10! object-cover! rounded-full!"
								/>
								<div className="flex-1">
									<p className="font-semibold text-foreground text-sm">
										{user?.name}
									</p>
									<p className="text-xs text-muted-foreground">
										{user?.phoneNumber}
									</p>
								</div>
							</div>
						))}
					</div>
				</>
			) : (
				<>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-heading text-xl font-semibold text-foreground">
							Pengguna
						</h3>
					</div>
					<div className="py-10 flex flex-col items-center text-center px-4 rounded-2xl">
						<div className="size-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
							<UserX className="size-8" />
						</div>
						<h4 className="font-heading text-lg font-semibold mb-1">
							Belum ada pengguna
						</h4>
						<p className="text-sm text-muted-foreground">
							Registrasi pelanggan baru akan muncul di sini
						</p>
					</div>
				</>
			)}
		</div>
	)
}

export {
	UserSection
}