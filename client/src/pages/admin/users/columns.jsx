import {
	Button,
	Input,
	Space
} from "antd";
import { handleDate } from "../../../utils/date";
import { Search } from "lucide-react";

const search = (searchParams) => {
	return {
		filterIcon: () => <Search className={`text-background size-3.5 flex justify-center items-center`} />,
		filterDropdown: ({
			confirm,
			clearFilters,
			selectedKeys,
			setSelectedKeys
		}) => (
			<div className="p-4">
				<Input
					placeholder="Cari nama"
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() => confirm()}
					className="block! mb-4!"
				/>
				<Space>
					<Button
						onClick={() => confirm()}
						size="small"
						className="w-[90px]! bg-primary! border-0! text-background! rounded-sm! py-4! px-2! hover:border-0! hover:shadow-none! active:shadow-none! active:border-0!">
						Cari
					</Button>
					<Button
						onClick={() => {
							clearFilters();
							confirm();
						}}
						size="small"
						className="w-[90px]! border! border-border! text-foreground! rounded-sm! py-4! px-2! hover:shadow-none! active:shadow-none!">
						Reset
					</Button>
				</Space>
			</div>
		),
		filteredValue: searchParams.get("name")
			? [searchParams.get("name")]
			: null
	}
}

const columns = (searchParams) => {
	return [
		{
			title: "Nama",
			dataIndex: "name",
			key: "name",
			...search(searchParams),
			render: (data) => (
				<span className="py-3 px-2 text-sm text-foreground">{data}</span>
			)
		},
		{
			title: "Nomor Handphone",
			dataIndex: "phoneNumber",
			key: "phoneNumber",
			render: (data) => (
				<span className="py-3 px-2 text-sm text-foreground">{data}</span>
			)
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			render: (data) => (
				<span className="py-3 px-2 text-sm text-foreground">{data}</span>
			)
		},
		{
			title: "Alamat",
			dataIndex: "address",
			key: "address",
			render: (data) => (
				<span className="py-3 px-2 text-sm text-foreground">{data}</span>
			)
		},
		{
			title: "Terdaftar Sejak",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (data) => (
				<span className="py-3 px-2 text-sm text-foreground">
					{handleDate(data)}
				</span>
			)
		}
	]
}

export {
	columns
}