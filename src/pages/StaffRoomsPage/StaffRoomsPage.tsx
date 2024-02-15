import { Accordion, AccordionItem, Button, Image } from "@nextui-org/react";
import RoomCard from "./RoomCard";

export default function StaffRoomsPage() {
  return <>
    <div>
      <div className="flex items-center justify-between pb-4">
        <div className="text-lg font-bold">Phòng và dãy phòng</div>
        <div className="flex gap-4">
          <Button className="h-12" color='primary'>
            Thêm dãy phòng
          </Button>
        </div>
      </div>
      <div>
        <Accordion defaultExpandedKeys={'all'} selectionMode="multiple" variant='splitted'>
          <AccordionItem key="1" aria-label="Dãy A" title="Dãy A">
            <div className="flex flex-wrap gap-4">
              {
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => <RoomCard key={i} />)
              }
            </div>
          </AccordionItem>
          <AccordionItem key="2" aria-label="Dãy B" title="Dãy B">
            Hello world
          </AccordionItem>
          <AccordionItem key="3" aria-label="Dãy F" title="Dãy F">
            <div className="flex items-center flex-col gap-2">
              <Image src="/Empty_Noti.svg" width={150} />
              <small>Dãy này hiện tại chưa có phòng</small>
              <div className="flex gap-2">
                <Button className="w-28" color='primary' variant='flat'>Thêm phòng</Button>
                <Button className="w-28" color='danger' variant='flat'>Xóa dãy</Button>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </>
}
