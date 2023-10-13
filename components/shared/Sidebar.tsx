import {
  Cog6ToothIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  LanguageIcon,
  SquaresPlusIcon,
  PresentationChartBarIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { forwardRef, useState, useEffect } from 'react';

import SidebarItem, { type SidebarMenuItem } from './SidebarItem';
import TeamDropdown from './TeamDropdown';

interface SidebarMenus {
  [key: string]: SidebarMenuItem[];
}
export default forwardRef<HTMLElement, { isCollapsed: boolean }>(
  function Sidebar({ isCollapsed }, ref) {
    const { asPath, isReady, query } = useRouter();
    const { t } = useTranslation('common');
    const [activePathname, setActivePathname] = useState<null | string>(null);

    const { slug } = query;
    useEffect(() => {
      if (isReady && asPath) {
        const activePathname = new URL(asPath, location.href).pathname;
        setActivePathname(activePathname);
      }
    }, [asPath, isReady]);

    const sidebarMenus: SidebarMenus = {
      personal: [
        {
          name: t('dashboard'),
          href: `/dashboard`,
          icon: SquaresPlusIcon,
          isBeta: true,
          active: activePathname === `/teams/${slug}/dashboard`,
        },
        {
          name: t('tasks'),
          href: `/tasks`,
          icon: ChatBubbleLeftRightIcon,
          active: activePathname === `/teams/${slug}/tasks`,
        },
        {
          name: t('transcripts'),
          href: `#`,
          icon: ChatBubbleLeftRightIcon,
          active: activePathname === `/teams/${slug}/transcripts`,
        },
        {
          name: t('account'),
          href: '/settings/account',
          icon: UserCircleIcon,
        },
      ],
      team: [
        {
          name: t('dashboard'),
          href: `/teams/${slug}/dashboard`,
          icon: SquaresPlusIcon,
          isBeta: true,
          active: activePathname === `/teams/${slug}/dashboard`,
        },
        {
          name: t('languages'),
          href: `/teams/${slug}/language`,
          icon: LanguageIcon,
          active: activePathname === `/teams/${slug}/language`,
        },
        {
          name: t('tasks'),
          href: `/teams/${slug}/tasks`,
          icon: ChatBubbleLeftRightIcon,
          active: activePathname === `/teams/${slug}/tasks`,
        },
        {
          name: t('insights'),
          href: `/`,
          icon: PresentationChartBarIcon,
          active: activePathname === `/teams/${slug}/insights`,
        },
        {
          name: t('settings'),
          href: `/teams/${slug}/settings`,
          active: activePathname === `/teams/${slug}/settings`,
          icon: Cog6ToothIcon,
        },
      ],
    };

    const menus = sidebarMenus[slug ? 'team' : 'personal'];

    return (
      <>
        <aside
          className={`fixed ${!isCollapsed && 'z-10'} h-screen w-10/12 lg:w-64`}
          ref={ref}
          aria-label="Sidebar"
        >
          <div
            className={`relative ${
              isCollapsed && 'invisible'
            } lg:visible flex h-full flex-col border-r border-gray-200 dark:border-gray-600 bg-white dark:bg-black pt-0`}
          >
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex-1 space-y-1 divide-y dark:divide-gray-600">
                <TeamDropdown />
                <div className="p-4">
                  <ul className="space-y-1">
                    {menus.map((menu) => (
                      <li key={menu.name}>
                        <SidebarItem {...menu} />
                        <div className="flex-1">
                          <div className="mt-1 space-y-1">
                            {menu?.items?.map((submenu) => (
                              <SidebarItem
                                key={submenu.name}
                                {...submenu}
                                className="pl-8"
                              />
                            ))}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <div
          className="fixed inset-0 z-10 hidden bg-gray-900 opacity-50"
          id="sidebarBackdrop"
        />
      </>
    );
  }
);
