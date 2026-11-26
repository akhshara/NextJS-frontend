"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useUnreadCount } from "@/features/chat/queries";
import { cn } from "@/lib/utils/utils";

import { studentNavItems } from "../constants";
import { STUDENT_HOME, STUDENT_MESSAGES } from "../routes";

function isActive(pathname: string, href: string) {
	// The overview is the portal's root, so it would otherwise match every page.
	if (href === STUDENT_HOME) return pathname === href;
	return pathname === href || pathname.startsWith(`${href}/`);
}

export default function StudentNav({
	className,
	mobile = false,
}: {
	className?: string;
	mobile?: boolean;
}) {
	const pathname = usePathname();
	const unread = useUnreadCount().data ?? 0;

	return (
		<nav
			aria-label="Student portal"
			className={cn(
				mobile &&
					"fixed inset-x-0 bottom-0 z-30 h-[var(--student-bottom-bar)] border-t bg-card pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
				className,
			)}
		>
			<ul className={mobile ? "grid h-full grid-cols-3 px-2" : "flex gap-1"}>
				{studentNavItems.map(({ href, label, icon: Icon }) => {
					const active = isActive(pathname, href);
					return (
						<li key={href} className={mobile ? "min-w-0 p-1" : "shrink-0"}>
							<Link
								href={href}
								aria-current={active ? "page" : undefined}
								className={cn(
									"relative flex items-center rounded-lg outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
									mobile
										? "h-full flex-col justify-center gap-1 text-label-md font-semibold"
										: "h-9 gap-2 px-3 text-label-lg",
									active && mobile && "text-primary",
									active && !mobile && "bg-primary text-primary-foreground",
									!active && "text-muted-foreground hover:bg-muted hover:text-foreground",
								)}
							>
								<span
									className={cn(
										"relative flex items-center justify-center",
										mobile && "h-7 w-14 rounded-full",
										mobile && active && "bg-primary-container",
									)}
								>
									<Icon aria-hidden className={mobile ? "size-5" : "size-4"} />
								</span>
								{label}
								{href === STUDENT_MESSAGES && unread > 0 && (
									<span
										className={cn(
											"min-w-5 rounded-full px-1 text-center text-label-sm tabular-nums",
											mobile &&
												"absolute top-1 left-[calc(50%+0.4rem)] bg-primary text-primary-foreground ring-2 ring-card",
											!mobile &&
												(active
													? "bg-primary-foreground text-primary"
													: "bg-primary text-primary-foreground"),
										)}
									>
										<span className="sr-only">, unread: </span>
										{mobile && unread > 99 ? "99+" : unread}
									</span>
								)}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
