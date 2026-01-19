import { handleDate } from "../../../utils/date";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";

const columns = (productID) => {
	return [
		{
			title: "Sisa Stok",
			dataIndex: "remaining",
			key: "remaining",
			render: (data) => (
				<span className="py-3 px-2 text-sm text-foreground">{data}</span>
			)
		},
		{
			title: "Jumlah Stok",
			dataIndex: "quantity",
			key: "quantity",
			render: (data) => (
				<span className="py-3 px-2 text-sm text-foreground">{data}</span>
			)
		},
		{
			title: "Tanggal Diterima",
			dataIndex: "receivedAt",
			key: "receivedAt",
			render: (data) => (
				<span className="py-3 px-2 text-sm text-foreground">
					{handleDate(data)}
				</span>
			)
		},
		{
			title: "Tanggal Kadaluarsa",
			dataIndex: "expiredAt",
			key: "expiredAt",
			render: (data) => (
				<span className="py-3 px-2 text-sm text-foreground">
					{handleDate(data)}
				</span>
			)
		},
		{
			key: "action",
			align: "right",
			render: (_, row) => (
				<div className="py-3 px-2 text-right">
					<Link
						to={`/admin/products/${productID}/inventories/edit-inventories/${row._id}`}
						className="text-primary!">
						<Pencil className="size-4" />
					</Link>
				</div>
			)
		}
	]
}

export {
	columns
}