import secureLocalStorage from "react-secure-storage";
import { Image } from "antd";
import {
	Link,
	useLoaderData,
	useNavigate
} from "react-router-dom";
import { LogOutIcon, UserPen } from "lucide-react";
import { Navbar } from "../../components/Navbar";

const AdminSettings = () => {
    const user = useLoaderData();
    const navigate = useNavigate();

    const handleLogout = () => {
        secureLocalStorage.removeItem('SESSION_KEY');
        navigate('/sign-in');
    }

	return (
		<>
			<main className="bg-background font-sans text-foreground min-h-screen">
				<section className="pt-8 px-4 pb-4 flex flex-col lg:max-w-3xl lg:mx-auto">
					<div className="mb-6">
						<div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 flex flex-col items-center">
							<div className="size-24 rounded-full overflow-hidden mb-4 border-4 border-primary/20">
								<Image
									src={user?.avatar?.imageURL}
									width={95}
									height={95}
									className="w-full! object-cover!"
								/>
							</div>
							<h2
								className={`font-font-heading text-2xl font-bold text-foreground ${
									user?.role === "admin" ? "mb-0.5" : ""
								}`}>
								{user?.name}
							</h2>
							<p className="text-sm text-muted-foreground">
								{user?.role === "admin" ? "Administrator" : ""}
							</p>
						</div>
					</div>
					<div className="mb-4">
						<div className="space-y-2">
                            <Link
                                to={`/admin/change-profile`}
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
                            onClick={() => handleLogout()}
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
				<Navbar active={"settings"} position={"bottom"} />
			</section>
		</>
	)
}

export {
	AdminSettings,
}