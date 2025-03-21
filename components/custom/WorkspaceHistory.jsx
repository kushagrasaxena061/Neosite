"use client";

import { UserDetailContext } from '@/context/UserDetailContext';
import React, { useContext, useEffect, useState } from 'react';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { useSidebar } from '../ui/sidebar';

function WorkspaceHistory() {
    const { userDetail } = useContext(UserDetailContext);
    const convex = useConvex();

    const [workspaceList, setWorkspaceList] = useState([]);
    const { toggleSidebar } = useSidebar()

    useEffect(() => {
        if (userDetail?._id) {
            GetAllWorkspace();
        }
    }, [userDetail]);

    const GetAllWorkspace = async () => {
        try {
            const result = await convex.query(api.workspace.GetAllWorkspace, {
                userId: userDetail?._id,
            });

            setWorkspaceList(result || []);
        } catch (error) {
            console.error("Error fetching workspaces:", error);
            setWorkspaceList([]);
        }
    };

    return (
        <div>
            <h2 className='font-medium text-lg'>Your Chat</h2>
            <div>
                {workspaceList.length > 0 ? (
                    workspaceList.map((workspace, index) => (
                        <Link href={'/workspace/' + workspace?._id} key={index}>
                            <h2 onClick={toggleSidebar} className='text-sm text-gray-400 mt-2 font-light cursor-pointer hover:text-white'>
                                {workspace?.messages?.[0]?.content || "No messages available"}
                            </h2>
                        </Link>
                    ))
                ) : (
                    <p>No workspaces found.</p>
                )}
            </div>
        </div>
    );
}

export default WorkspaceHistory;
