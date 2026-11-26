import type { ReactNode } from "react";

import AdminGate from "@/components/admin/AdminGate";
import ConsoleNav from "@/components/admin/ConsoleNav";
import Sidebar from "@/components/admin/Sidebar";
import TopBar from "@/components/admin/TopBar";

export default function ConsoleLayout({ children }: { children: ReactNode }) {
	return (
		<AdminGate>
			<div className="admin-shell flex min-h-dvh [--admin-bottom-bar:calc(4.5rem+env(safe-area-inset-bottom))]">
				<Sidebar />
				<div className="flex min-w-0 flex-1 flex-col">
					<TopBar />
					<main className="mx-auto w-full max-w-7xl flex-1 space-y-5 px-4 pt-4 pb-[calc(var(--admin-bottom-bar)+1rem)] sm:px-6 lg:space-y-6 lg:px-8 lg:py-8">
						{children}
					</main>
				</div>
				<ConsoleNav orientation="bottom" />
			</div>
		</AdminGate>
	);
}
