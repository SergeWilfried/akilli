import { Cog6ToothIcon, KeyIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Link from 'next/link';

interface TasksTabProps {
  activeTab: string;
  task: any;
  heading?: string;
}

const TasksTab = (props: TasksTabProps) => {
  const { activeTab, task, heading } = props;
  const teamSlug = 'akilli';
  const navigations = [
    {
      name: 'Details',
      href: `/teams/${teamSlug}/tasks/${task.id}/settings`,

      active: activeTab === 'settings',
      icon: Cog6ToothIcon,
    },
  ];
  navigations.push({
    name: 'Files',
    href: `/teams/${teamSlug}/tasks/${task.id}/files`,
    active: activeTab === 'files',
    icon: KeyIcon,
  });
  navigations.push({
    name: 'Transcribers',
    href: `/teams/${teamSlug}/tasks/${task.id}/transcribers`,
    active: activeTab === 'transcribers',
    icon: KeyIcon,
  });
  navigations.push({
    name: task?.type === 'VOICE TO TEXT' ? 'Transcripts' : 'Sentences',
    href: `/teams/${teamSlug}/tasks/${task.id}/transcripts?page=1&perPage=10`,
    active: activeTab === 'transcripts',
    icon: KeyIcon,
  });

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold mb-2">
        {heading ? heading : task.name}
      </h2>
      <nav
        className=" flex space-x-5 border-b border-gray-300"
        aria-label="Tabs"
      >
        {navigations.map((menu) => {
          return (
            <Link
              href={menu.href}
              key={menu.href}
              className={classNames(
                'inline-flex items-center border-b-2 py-4 text-sm font-medium',
                menu.active
                  ? 'border-gray-900 text-gray-700'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              )}
            >
              {menu.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default TasksTab;
