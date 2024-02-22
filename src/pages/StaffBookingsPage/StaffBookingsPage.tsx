import { Tabs, Tab } from "@nextui-org/react";
import CurrentTab from "./CurrentTab";
import CheckedOutTab from "./CheckedOutTab";

export default function StaffBookingsPage() {
  return (
    <>
      <Tabs color="primary" variant="underlined">
        <Tab key="current" title="Hiện tại">
          <CurrentTab />
        </Tab>
        <Tab key="checkedOut" title="Đã trả">
          <CheckedOutTab />
        </Tab>
      </Tabs>
    </>
  );
}
