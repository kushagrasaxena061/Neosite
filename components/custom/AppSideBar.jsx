
import React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from '../ui/sidebar'
import Image from 'next/image'
import { Button } from '../ui/button'
import { MessageCircleCode } from 'lucide-react'
import WorkspaceHistory from './WorkspaceHistory'
import SideBarFooter from './SideBarFooter'
import Link from 'next/link'

function AppSideBar() {
    return (
        <Sidebar>
            <SidebarHeader className="p-1" >
                <Image src={'/Neosite.png'} alt='logo appsidebar' width={100} height={100} className='p-2' />
            </SidebarHeader>
            <Link href="/">
                <Button className="mt-5 ml-6 cursor-pointer"> <MessageCircleCode /> Start new Chat</Button>
            </Link>
            <SidebarContent className="p-5">
                <SidebarGroup >
                    <WorkspaceHistory />
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter >
                <SideBarFooter />
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSideBar
