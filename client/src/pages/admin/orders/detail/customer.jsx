import { Contact, MapPin } from "lucide-react"

const CustomerSection = ({ order }) => {
	return (
		<div className="bg-card rounded-2xl border border-border p-4">
			<h2 className="font-font-heading text-lg font-bold text-foreground mb-4">
				Alamat Pengiriman
			</h2>
			<div className="space-y-4">
				<div className="flex items-start gap-3">
					<Contact className="size-7 text-primary mt-0.5 shrink-0" />
					<div className="flex-1 mb-2">
						<p className="text-sm text-foreground mb-1">
							{order?.user?.name}
						</p>
						<p className="text-sm text-foreground mb-1">
							{order?.user?.email}
						</p>
						<p className="text-sm text-foreground">
							{order?.user?.phoneNumber}
						</p>
					</div>
				</div>
				<div className="flex items-start gap-3">
					<MapPin className="size-7 text-primary mt-0.5 shrink-0" />
					<div className="flex-1">
						<p className="text-sm text-foreground mb-2 lg:mt-1.5">
							{order?.user?.address}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export {
    CustomerSection
}