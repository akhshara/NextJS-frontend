"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/utils";

import { consoleNavItems } from "./nav-items";

function isActive(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(`${href}/`);
}

/** Section links: a column in the sidebar, a bottom bar on small screens. */
export default function ConsoleNav({ orientation }: { orientation: "vertical" | "bottom" }) {
	const pathname = usePathname();
	const vertical = orientation === "vertical";

	return (
		<nav
			aria-label="Console"
			className={cn(
				!vertical &&
					"fixed inset-x-0 bottom-0 z-30 h-[var(--admin-bottom-bar)] border-t bg-card pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] lg:hidden",
			)}
		>
			<ul className={vertical ? "flex flex-col gap-1" : "grid h-full grid-cols-4 px-1"}>
				{consoleNavItems.map(({ href, label, shortLabel, icon: Icon }) => {
					const active = isActive(pathname, href);
					return (
						<li key={href} className={vertical ? "shrink-0" : "min-w-0 p-1"}>
							<Link
								href={href}
								aria-label={label}
								aria-current={active ? "page" : undefined}
								className={cn(
									"flex items-center rounded-lg outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
									vertical
										? "gap-3 px-3 py-2 text-label-lg"
										: "h-full flex-col justify-center gap-1 text-label-md font-semibold",
									active && vertical && "bg-primary text-primary-foreground",
									active && !vertical && "text-primary",
									!active && "text-muted-foreground hover:bg-muted hover:text-foreground",
								)}
							>
								<span
									className={cn(
										"grid shrink-0 place-items-center",
										!vertical && "h-7 w-12 rounded-full",
										!vertical && active && "bg-primary-container",
									)}
								>
									<Icon aria-hidden className={vertical ? "size-4" : "size-5"} />
								</span>
								{vertical ? label : (shortLabel ?? label)}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
