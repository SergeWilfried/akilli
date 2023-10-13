import classNames from 'classnames';
import NextLink from 'next/link';

export interface SidebarMenuItem {
  name: string;
  href: string;
  icon?: any;
  active?: boolean;
  isBeta?: boolean;
  items?: Omit<SidebarMenuItem, 'icon' | 'items'>[];
  className?: string;
}

const SidebarItem = ({
  href,
  name,
  icon,
  active,
  isBeta,
  className,
}: SidebarMenuItem) => {
  const Icon = icon;

  return (
    <NextLink
      href={href}
      className={classNames(
        active ? 'bg-gray-100 font-semibold' : 'dark:text-white',
        'flex items-center rounded-lg text-sm text-gray-900 hover:dark:text-black hover:bg-gray-100 p-2',
        className
      )}
    >
      <div className="flex gap-2">
        {Icon && <Icon className="h-5 w-5" />}
        <span>{name}</span>
        {isBeta && <span className="badge badge-accent ml-2">Beta</span>}
      </div>
    </NextLink>
  );
};

export default SidebarItem;
