import { logout } from "../services/auth";

const handleLogout = async (queryClient, navigate) => {
    await logout();
    queryClient.clear();
    navigate('/');
}

export {
    handleLogout
}