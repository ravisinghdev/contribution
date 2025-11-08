'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  Mail,
  MessageSquare,
  Package,
  AlertCircle,
  CheckCircle2,
  X,
  Check,
  MoreHorizontal,
  Trash2,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { format, isToday, isYesterday, subHours } from 'date-fns';

// --- Notification Type ---
type NotificationType = 'system' | 'messages';

interface INotification {
  id: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
  time: Date;
  unread: boolean;
  type: NotificationType;
}

// --- Mock Notification Data ---
const now = new Date();
const initialNotifications: INotification[] = [
  {
    id: 1,
    icon: Package,
    title: 'Order Shipped',
    desc: 'Your package is on its way 🚚',
    time: subHours(now, 1),
    unread: true,
    type: 'system',
  },
  {
    id: 2,
    icon: MessageSquare,
    title: 'New Message',
    desc: 'Alex sent you a message',
    time: subHours(now, 2),
    unread: true,
    type: 'messages',
  },
  {
    id: 3,
    icon: Mail,
    title: 'Support Update',
    desc: 'Your ticket has been resolved',
    time: subHours(now, 20),
    unread: false,
    type: 'system',
  },
  {
    id: 4,
    icon: AlertCircle,
    title: 'Security Alert',
    desc: 'Unusual login detected',
    time: subHours(now, 25),
    unread: false,
    type: 'system',
  },
  {
    id: 5,
    icon: CheckCircle2,
    title: 'Backup Complete',
    desc: 'Your files are now safe ☁️',
    time: subHours(now, 48),
    unread: false,
    type: 'system',
  },
];

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<INotification[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all');
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // --- Filter Logic ---
  const filtered = useMemo(() => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter((n) => n.unread);
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  // --- Grouped by Time ---
  const grouped = useMemo(() => {
    const today: INotification[] = [];
    const yesterday: INotification[] = [];
    const earlier: INotification[] = [];

    filtered.forEach((n) => {
      if (isToday(n.time)) today.push(n);
      else if (isYesterday(n.time)) yesterday.push(n);
      else earlier.push(n);
    });

    return { today, yesterday, earlier };
  }, [filtered]);

  // --- Actions ---
  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  const clearAll = () => setNotifications([]);
  const handleClose = () => setOpen(false);

  const toggleRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );

  const deleteNotification = (id: number) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const formatTime = (date: Date) => format(date, 'p');

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-md hover:bg-muted relative transition">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2 animate-pulse" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[26rem] p-0 overflow-hidden rounded-xl shadow-lg border animate-in fade-in-80"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
          <DropdownMenuLabel className="text-sm font-semibold">
            Notifications
          </DropdownMenuLabel>

          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => setFilter('all')}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('unread')}>Unread</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('messages')}>Messages</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('system')}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={!unreadCount}
              className="text-xs"
            >
              <Check className="h-3 w-3 mr-1" /> Read All
            </Button>

            <Button variant="outline" size="sm" onClick={clearAll} className="text-xs">
              <Trash2 className="h-3 w-3 mr-1" /> Clear
            </Button>

            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* BODY */}
        <div className="max-h-[26rem] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-sm">
              <CheckCircle2 className="h-6 w-6 mb-2 opacity-70" />
              No notifications
            </div>
          ) : (
            <>
              {/* Today */}
              {grouped.today.length > 0 && (
                <>
                  <div className="px-4 pt-2 text-xs uppercase text-muted-foreground font-medium">
                    Today
                  </div>
                  {grouped.today.map((n) => (
                    <NotificationItem
                      key={n.id}
                      data={n}
                      onToggleRead={toggleRead}
                      onDelete={deleteNotification}
                      formatTime={formatTime}
                    />
                  ))}
                </>
              )}

              {/* Yesterday */}
              {grouped.yesterday.length > 0 && (
                <>
                  <div className="px-4 pt-2 text-xs uppercase text-muted-foreground font-medium">
                    Yesterday
                  </div>
                  {grouped.yesterday.map((n) => (
                    <NotificationItem
                      key={n.id}
                      data={n}
                      onToggleRead={toggleRead}
                      onDelete={deleteNotification}
                      formatTime={formatTime}
                    />
                  ))}
                </>
              )}

              {/* Earlier */}
              {grouped.earlier.length > 0 && (
                <>
                  <div className="px-4 pt-2 text-xs uppercase text-muted-foreground font-medium">
                    Earlier
                  </div>
                  {grouped.earlier.map((n) => (
                    <NotificationItem
                      key={n.id}
                      data={n}
                      onToggleRead={toggleRead}
                      onDelete={deleteNotification}
                      formatTime={formatTime}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="#"
            className="text-center text-sm w-full py-3 hover:bg-muted/40 font-medium"
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// --- Notification Item Component ---
interface NotificationItemProps {
  data: INotification;
  onToggleRead: (id: number) => void;
  onDelete: (id: number) => void;
  formatTime: (date: Date) => string;
}

function NotificationItem({ data, onToggleRead, onDelete, formatTime }: NotificationItemProps) {
  const { id, icon: Icon, title, desc, time, unread } = data;

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 border-b last:border-0 transition-colors group',
        unread ? 'bg-muted/40 hover:bg-muted/60' : 'hover:bg-muted/30'
      )}
    >
      <div className="p-2 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex flex-col text-sm flex-1">
        <span className="font-medium">{title}</span>
        <span className="text-muted-foreground text-xs">{desc}</span>
        <span className="text-[10px] text-muted-foreground mt-1">{formatTime(time)}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-muted">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => onToggleRead(id)}>
            {unread ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" /> Mark as Read
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" /> Mark as Unread
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(id)}>
            <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
