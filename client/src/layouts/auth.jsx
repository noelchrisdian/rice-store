import { Outlet } from "react-router-dom";
import { Sprout } from "lucide-react";

const AuthLayout = () => {
	return (
		<div className="relative bg-background font-sans text-foreground flex flex-col min-h-screen lg:grid lg:grid-cols-2">
			<div className="flex-1 px-6 pt-20 pb-12 lg:bg-primary lg:flex lg:flex-col lg:items-center lg:justify-center">
				<div className="w-full mx-auto max-w-sm">
					<div className="flex flex-col items-center justify-center mb-8 mt-4">
						<div className="size-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20 lg:bg-background lg:text-primary lg:size-24 lg:mb-8">
							<Sprout className="w-8 h-8 lg:w-16 lg:h-16" />
						</div>
						<h1 className="font-heading font-bold text-3xl text-primary tracking-wide mb-2 lg:text-background lg:text-5xl lg:mb-4">
							Toko Beras AD
						</h1>
						<p className="text-muted-foreground text-center text-sm lg:text-background lg:text-lg">
							Solusi cepat kebutuhan beras Anda
						</p>
					</div>
				</div>
				<div className="w-full max-w-sm mx-auto lg:hidden">
					<Outlet />
				</div>
			</div>
			<div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center lg:bg-background relative">
                <div className="lg:w-100">
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export {
    AuthLayout
}