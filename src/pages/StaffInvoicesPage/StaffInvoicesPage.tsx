import { Tabs, Tab } from "@nextui-org/react";
import PaidTab from "./PaidTab";
import UnpaidTab from "./UnpaidTab";

export default function StaffInvoicesPage() {
  return (
    <>
      <Tabs color="primary" variant="underlined">
        <Tab key="unpaid" title="Chưa thanh toán">
          <UnpaidTab />
        </Tab>
        <Tab key="paid" title="Đã thanh toán">
          <PaidTab />
        </Tab>
      </Tabs>
    </>
  );
}
