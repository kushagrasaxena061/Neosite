import Image from 'next/image';
import React, { useContext } from 'react';
import { Button } from '../ui/button';
import { UserDetailContext } from '@/context/UserDetailContext';
import { ActionContext } from '@/context/ActionContext';
import { usePathname } from 'next/navigation';

function Header() {
  const userDetail = useContext(UserDetailContext);
  const { action, setAction } = useContext(ActionContext)
  const path = usePathname()


  const onActionBtn = (action) => {
    setAction({
      actionType: action,
      timeStamp: Date.now()
    })
  }

  if (!userDetail) {
    console.warn("UserDetailContext is undefined. Make sure it's wrapped in a Provider.");
    return null;
  }

  return (
    <div className="p-4 flex justify-between items-center w-full">
      <Image src="/Neosite.png" alt="Logo" width={100} height={100} />

      {userDetail?.name || path?.includes("workspace") ? (
        <div className="flex gap-5">
          <Button onClick={() => onActionBtn("deploy")} className="text-white font-bold bg-gradient-to-br from-green-400 to-green-600 px-6 py-2">
            Deploy
          </Button>
          <Button onClick={() => onActionBtn("export")} variant="default" className="px-6 py-2">
            Export
          </Button>

          <Image src={'/dp.png'} alt='user' width={40} height={40} className='rounded-lg  ' />
        </div>
      ) : (
        <div className="flex gap-5">
          <Button className="text-white font-bold bg-gradient-to-br from-green-400 to-green-600 px-6 py-2">
            Get Started
          </Button>
          <Button variant="default" className="px-6 py-2">
            Sign In
          </Button>
        </div>
      )}
    </div>


  );
}

export default Header;
