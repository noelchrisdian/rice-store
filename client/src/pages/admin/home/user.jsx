import { Link } from "react-router-dom";

const UserSection = ({ recentUsers, userStats }) => {
	return (
		<div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5">
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
		</div>
	)
}

export {
    UserSection
}