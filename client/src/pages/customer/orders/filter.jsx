import { Select } from "antd";

const FilterSection = ({
	range,
	rangeOptions,
	searchParams,
	setSearchParams,
	status,
	statusOptions
}) => {
	return (
		<div className="mb-4">
			<div className="grid grid-cols-2 gap-4 lg:pt-10 lg:pb-1">
				<div className="flex-1">
					<Select
						className="w-full! p-0!"
						placeholder={"Status Pesanan"}
						allowClear
						options={statusOptions}
						value={status}
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
						className="w-full! p-0!"
						placeholder={"Rentang Waktu"}
						allowClear
						options={rangeOptions}
						value={range}
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