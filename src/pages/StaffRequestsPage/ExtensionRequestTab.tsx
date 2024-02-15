import { Image } from "@nextui-org/image";

export default function ExtensionRequestTab() {
    return (
        <div className='flex items-center flex-col py-20'>
            <Image width={200} src='/Empty_Post.svg' />
            <small>Hiện tại không có yêu cầu nào</small>
        </div>
    )
}
