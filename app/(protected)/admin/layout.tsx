import { PropsChildren } from "@/constant";
import { AdminShell } from "@/features/admin/components/AdminShell";

const AdminLayout = ({ children }: PropsChildren) => {
  return <AdminShell>
    {children}
  </AdminShell>
};

export default AdminLayout;
