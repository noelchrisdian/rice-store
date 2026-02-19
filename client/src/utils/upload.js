import { toast } from "sonner";
import { Upload } from "antd";

const beforeUpload = (file) => {
    const typesAllowed = [
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/png"
    ]

    const filetype = typesAllowed.includes(file.type);
    if (!filetype) {
        toast.error("File tidak valid");
    }

    const fileSize = file.size / 1024 / 1024 <= 4;
    if (!fileSize) {
        toast.error("Ukuran file maksimal 4 MB");
    }

    if (!filetype || !fileSize) {
        return Upload.LIST_IGNORE;
    }

    return false;
}

export {
    beforeUpload
}