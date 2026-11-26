import type { Metadata } from "next";
import type { ReactNode } from "react";

import Container from "@/components/layout/Container";
import SiteFooter from "@/components/layout/SiteFooter";
import QueryProvider from "@/components/providers/QueryProvider";
import StudentGate from "@/features/student/components/StudentGate";
import StudentHeader from "@/features/student/components/StudentHeader";
import StudentNav from "@/features/student/components/StudentNav";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function StudentLayout({ children }: { children: ReactNode }) {
	return (
		<QueryProvider>
			<StudentGate>
				<div className="student-shell flex min-h-dvh flex-col [--student-bottom-bar:calc(4.5rem+env(safe-area-inset-bottom))]">
					<StudentHeader />
					<main className="flex-1 pb-[var(--student-bottom-bar)] md:pb-0">
						<Container className="space-y-5 py-4 md:space-y-8 md:py-6 lg:py-8">
							{children}
						</Container>
					</main>
					<StudentNav mobile className="md:hidden" />
					<SiteFooter className="hidden pb-[env(safe-area-inset-bottom)] md:block" />
				</div>
			</StudentGate>
		</QueryProvider>
	);
}
