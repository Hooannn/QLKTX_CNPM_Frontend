import { Image } from '@nextui-org/image'
import React from 'react'

export default function RequestsTab() {
    return (
        <div className='flex items-center flex-col py-20'>
            <Image width={200} src='/Empty_Post.svg' />
            <small>Sinh viên chưa có yêu cầu nào</small>
        </div>
    )
}
