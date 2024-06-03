import {
  AiOutlineClose,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineUser,
} from "react-icons/ai";
import { IUser } from "../../types";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from "@nextui-org/react";
import dayjs from "../../libs/dayjs";
import BookingsTab from "./BookingsTab";
import InvoicesTab from "./InvoicesTab";
export default function StudentDetailModal(props: {
  isOpen: boolean;
  onClose: () => void;
  user: IUser;
}) {
  return (
    <>
      <Modal
        size="full"
        isDismissable={false}
        scrollBehavior="outside"
        hideCloseButton
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-row items-center gap-4">
                <Button size="lg" onClick={props.onClose} isIconOnly>
                  <AiOutlineClose />
                </Button>
                Thông tin chi tiết
              </ModalHeader>
              <ModalBody className="flex-row bg-white">
                <div className="h-full flex flex-col items-center gap-3 w-[500px] border-r-1 border-gray pr-5">
                  <Avatar
                    size="lg"
                    className="w-32 h-32"
                    fallback={<AiOutlineUser size={40} />}
                  ></Avatar>
                  <div className="font-semibold text-xl">
                    {props.user.first_name} {props.user.last_name}
                  </div>
                  <div className="flex gap-2 items-center justify-center w-full">
                    <a className="w-full" href={`tel:+${props.user.phone}`}>
                      <Button
                        color="primary"
                        variant="flat"
                        className="py-6 w-full"
                      >
                        <AiOutlinePhone />
                        Liên hệ
                      </Button>
                    </a>
                    <a
                      className="w-full"
                      target="_blank"
                      href={`mailto:${props.user.email}`}
                    >
                      <Button color="primary" className="py-6 w-full">
                        <AiOutlineMail />
                        Gửi mail
                      </Button>
                    </a>
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <div className="flex items-center justify-between">
                      <div className="opacity-70">Mã sinh viên</div>{" "}
                      <div>{props.user.id}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="opacity-70">Email</div>{" "}
                      <div>{props.user.email}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="opacity-70">Địa chỉ</div>{" "}
                      <div>
                        {props.user.address ?? (
                          <>
                            <small>Chưa cập nhật</small>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="opacity-70">Ngày sinh</div>{" "}
                      <div>
                        {props.user.date_of_birth ? (
                          dayjs(props.user.date_of_birth).format("DD/MM/YYYY")
                        ) : (
                          <>
                            <small>Chưa cập nhật</small>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="opacity-70">SĐT</div>{" "}
                      <div>
                        {props.user.phone ?? (
                          <>
                            <small>Chưa cập nhật</small>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-full">
                  <Tabs color="primary" variant="underlined">
                    <Tab key="bookings" title="Phiếu thuê">
                      <BookingsTab student={props.user} />
                    </Tab>
                    <Tab key="invoices" title="Hóa đơn">
                      <InvoicesTab student={props.user} />
                    </Tab>
                  </Tabs>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
