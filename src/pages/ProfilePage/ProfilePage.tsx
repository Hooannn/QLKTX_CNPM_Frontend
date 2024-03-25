import { Tabs, Tab } from '@nextui-org/react'
import InformationTab from './InformationTab'
import ChangePasswordTab from './ChangePasswordTab'

export default function ProfilePage() {
    return (
        <div className="w-full h-full">
            <Tabs color="primary" variant="underlined">
                <Tab key="information" title="Thông tin cá nhân">
                    <InformationTab />
                </Tab>
                <Tab key="changePassword" title="Đổi mật khẩu">
                    <ChangePasswordTab />
                </Tab>
            </Tabs>
        </div>
    )
}
