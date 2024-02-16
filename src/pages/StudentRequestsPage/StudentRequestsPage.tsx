import { Tabs, Tab } from "@nextui-org/react";
import BookingRequestTab from "../StaffRequestsPage/BookingRequestTab";
import ChangeRoomRequestTab from "../StaffRequestsPage/ChangeRoomRequestTab";
import ExtensionRequestTab from "../StaffRequestsPage/ExtensionRequestTab";

export default function StudentRequestsPage() {
  return <>
    <Tabs color="primary" variant='underlined'>
      <Tab
        key="booking"
        title='Yêu cầu thuê'
      >
        <BookingRequestTab />
      </Tab>
      <Tab
        key="changeRoom"
        title='Yêu cầu chuyển phòng'
      >
        <ChangeRoomRequestTab />
      </Tab>
      <Tab
        key="extension"
        title='Yêu cầu gia hạn'
      >
        <ExtensionRequestTab />
      </Tab>
    </Tabs>
  </>;
}
