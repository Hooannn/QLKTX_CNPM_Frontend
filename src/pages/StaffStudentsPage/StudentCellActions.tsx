import { Button } from '@nextui-org/button'
import StudentDetailModal from './StudentDetailModal'
import { useDisclosure } from '@nextui-org/use-disclosure';
import { IUser } from '../../types';

export default function StudentCellActions({ user }: { user: IUser }) {
    const {
        isOpen: isDetailUserModalOpen,
        onOpen: onOpenDetailUserModal,
        onClose: onDetailUserModalClose,
    } = useDisclosure();
    return (
        <>
            <StudentDetailModal user={user} isOpen={isDetailUserModalOpen} onClose={onDetailUserModalClose} />
            <div className='flex items-center'>
                <Button
                    size="sm"
                    onClick={onOpenDetailUserModal}
                    color="primary"
                    variant="light"
                >
                    Xem chi tiết
                </Button>
            </div>
        </>
    )
}
