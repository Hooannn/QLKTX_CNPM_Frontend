import { Tabs, Tab } from "@nextui-org/react";
import PaidTab from "../StaffInvoicesPage/PaidTab";
import UnpaidTab from "../StaffInvoicesPage/UnpaidTab";
import useAuthStore from "../../stores/auth";

export default function StudentInvoicesPage() {
  const { user } = useAuthStore();
  return (
    <>
      <Tabs color="primary" variant="underlined">
        <Tab key="unpaid" title="Cần thanh toán">
          <UnpaidTab studentId={user?.id} />
        </Tab>
        <Tab key="paid" title="Đã thanh toán">
          <PaidTab studentId={user?.id} />
        </Tab>
      </Tabs>
    </>
  );
}
