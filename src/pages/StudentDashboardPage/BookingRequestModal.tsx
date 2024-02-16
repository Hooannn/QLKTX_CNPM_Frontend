import { AiOutlineClose } from "react-icons/ai";
import { Room } from "../../types";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@nextui-org/react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import Stepper from 'react-stepper-horizontal';
import RoomsPage from "../RoomsPage";
export default function BookingRequestModal(props: {
    isOpen: boolean;
    onClose: () => void;
    selectedRoom?: Room;
}) {
    return (
        <>
            <Modal
                size="full"
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
                                Yêu cầu thuê phòng
                            </ModalHeader>
                            <ModalBody className="overflow-auto">
                                <div className="h-full flex flex-col">
                                    <Stepper steps={[{ title: 'Chọn phòng' }, { title: 'Điền thông tin' }, { title: 'Xác nhận' }]} activeStep={0} />
                                    <RoomsPage />
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
