import {
	Link,
	useLoaderData,
	useNavigate
} from "react-router-dom";
import { handleLogout } from "../../utils/logout";
import { LogOutIcon, UserPen } from "lucide-react";
import { Navbar } from "../../components/navbar/navbar";
import { useQueryClient } from "@tanstack/react-query";

const UserSettings = () => {
	const user = useLoaderData();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return (
		<>
			<main className="bg-background font-sans text-foreground min-h-screen">
				<section className="flex-1 flex flex-col pt-8 px-4 lg:max-w-3xl lg:mx-auto">
					<div className="mb-6">
						<div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 flex flex-col items-center">
							<div className="size-24 rounded-full overflow-hidden mb-4 border-4 border-primary/20">
								<img
									src={user?.avatar?.imageURL}
									className="w-full! h-full! object-cover! object-center!"
								/>
							</div>
							<h2
								className={`font-font-heading text-2xl font-bold text-foreground`}>
								{user?.name}
							</h2>
						</div>
					</div>
					<div className="mb-4">
						<div className="space-y-2">
							<Link
								to={"/account/change-profile"}
								className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4 flex items-center justify-between transition-colors active:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50">
								<div className="flex items-center gap-3">
									<div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
										<UserPen className="size-5 text-primary" />
									</div>
									<div className="text-left">
										<p className="text-sm font-medium text-foreground">
											Ubah Profil
										</p>
										<p className="text-xs text-muted-foreground">
											Perbarui informasi personal Anda
										</p>
									</div>
								</div>
							</Link>
						</div>
					</div>
					<div className="">
						<button
							onClick={() => handleLogout(queryClient, navigate)}
							className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4 flex items-center justify-between cursor-pointer active:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50">
							<div className="flex items-center gap-3">
								<div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
									<LogOutIcon className="size-5 text-primary" />
								</div>
								<div className="text-left">
									<p className="text-sm font-medium text-foreground">
										Keluar
									</p>
									<p className="text-xs text-muted-foreground">
										Akhiri sesi akun Anda
									</p>
								</div>
							</div>
						</button>
					</div>
				</section>
			</main>
			<section className="lg:hidden">
				<Navbar active={"account"} position={"bottom"} />
			</section>
		</>
	)
}

export {
	UserSettings
}