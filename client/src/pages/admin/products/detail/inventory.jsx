import { columns } from "../../inventories/columns";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Table } from "antd";

const InventorySection = ({
	inventories,
	limit,
	page,
	product,
	searchParams,
	setSearchParams
}) => {
	return (
		<section className="pb-4 px-3 lg:pl-6">
			<div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden p-4">
				<div className="flex items-center justify-end mb-3">
					<Link
						to={`/admin/products/${product._id}/inventories/add-inventory`}
						className="flex bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm justify-center items-center gap-3 shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
						<Plus className="size-4 bg-background rounded-full text-primary" />
						Buat Stok
					</Link>
				</div>
				<div className="overflow-x-auto -mx-4 px-4">
					<Table
						className="[&_.ant-table-thead_th]:border-b-0! [&_.ant-table-thead_th::before]:hidden!"
						columns={columns(product._id)}
						dataSource={inventories?.inventories}
						rowKey={"_id"}
						scroll={{ x: 600 }}
						pagination={{
							current: page,
							position: ["none", "bottomCenter"],
							pageSize: limit,
							showSizeChanger: true,
							total: inventories?.meta?.total,
							onChange: (page, pageSize) => {
								const params = new URLSearchParams(searchParams);
								params.set("inventoryLimit", String(pageSize));
								params.set("inventoryPage", String(page));
								setSearchParams(params);
							}
						}}
					/>
				</div>
			</div>
		</section>
	)
}

export {
    InventorySection
}