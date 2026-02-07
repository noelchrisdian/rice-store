import { Input, Select } from "antd";
import { Search } from "lucide-react";

const FilterSection = ({
	currentStatus,
    currentRange,
    name,
	searchParams,
	setName,
	setSearchParams
}) => {
	return (
		<div className="mb-6 lg:grid lg:grid-cols-2 lg:gap-2 lg:items-center">
			<div className="space-y-3 pb-3 lg:pt-10 lg:pb-1">
				<div className="relative">
					<Input
						allowClear
						value={name}
						type="text"
						className="w-full! pl-11! pr-4! py-3! rounded-xl! bg-input! border-0! text-foreground! placeholder:text-muted-foreground! lg:py-1.5!"
						suffix={
							<Search className="size-5 text-muted-foreground absolute left-3.5" />
						}
						placeholder="Cari berdasarkan nama pelanggan"
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-2 lg:pt-10 lg:pb-1">
				<div className="flex-1">
					<Select
						className="w-full!"
						placeholder={"Status Pesanan"}
						allowClear
						value={currentStatus}
						options={[
							{ value: "success", label: "Sukses" },
							{ value: "pending", label: "Pending" },
							{ value: "failed", label: "Batal" }
						]}
						onChange={(value) => {
							const params = new URLSearchParams(searchParams);

							if (value) {
								params.set("status", value);
							} else {
								params.delete("status");
							}

							params.set("page", "1");
							setSearchParams(params);
						}}
					/>
				</div>
				<div className="flex-1">
					<Select
						className="w-full!"
						placeholder={"Rentang Waktu"}
						allowClear
						value={currentRange}
						options={[
							{ value: "today", label: "Hari Ini" },
							{ value: "7d", label: "7 Hari Terakhir" },
							{ value: "30d", label: "30 Hari Terakhir" },
							{ value: "90d", label: "90 Hari Terakhir" }
						]}
						onChange={(value) => {
							const params = new URLSearchParams(searchParams);

							if (value) {
								params.set("range", value);
							} else {
								params.delete("range");
							}

							params.set("page", "1");
							setSearchParams(params);
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export {
    FilterSection
}