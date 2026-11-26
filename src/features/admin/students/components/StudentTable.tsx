"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/typography";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/utils";

import { studentPath } from "../routes";
import type { Student } from "../types";
import StudentStatus from "./StudentStatus";

interface StudentTableProps {
	students: readonly Student[];
	selectedId: number | null;
	onSelect: (id: number) => void;
}

export default function StudentTable({ students, selectedId, onSelect }: StudentTableProps) {
	return (
		<>
			<ul className="divide-y lg:hidden">
				{students.map((student) => (
					<li key={student.id}>
						<Link
							href={studentPath(student.id)}
							className="flex items-center gap-3 px-4 py-3 outline-none hover:bg-muted focus-visible:bg-muted"
						>
							<Avatar name={student.full_name} />
							<div className="min-w-0 flex-1 space-y-1">
								<Text variant="label-lg" className="truncate font-semibold">
									{student.full_name}
								</Text>
								<Text variant="body-sm" tone="muted" className="truncate">
									{student.email}
								</Text>
								<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
									<StudentStatus student={student} />
									<Text variant="body-sm" tone="muted" className="truncate">
										{student.department}
									</Text>
								</div>
							</div>
							<ChevronRight aria-hidden className="size-4 shrink-0 text-muted-foreground" />
						</Link>
					</li>
				))}
			</ul>
			<div className="hidden lg:block">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Student</TableHead>
							<TableHead>Department</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Listings</TableHead>
							<TableHead>Joined</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{students.map((student) => {
							const selected = student.id === selectedId;
							return (
								<TableRow
									key={student.id}
									className={cn(
										selected && "bg-primary-container/40 hover:bg-primary-container/40",
									)}
								>
									<TableCell className="min-w-60">
										<div className="flex items-center gap-3">
											<Avatar name={student.full_name} />
											<div className="min-w-0">
												<button
													type="button"
													aria-current={selected || undefined}
													onClick={() => onSelect(student.id)}
													className="rounded text-left text-label-lg outline-none hover:text-primary hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
												>
													{student.full_name}
												</button>
												<Text variant="body-sm" tone="muted" className="truncate">
													{student.email}
												</Text>
											</div>
										</div>
									</TableCell>
									<TableCell className="min-w-40">
										<Text as="span" variant="label-md" className="block">
											{student.department || "—"}
										</Text>
										{student.student_id && (
											<Text as="span" variant="body-sm" tone="muted" className="block">
												ID {student.student_id}
											</Text>
										)}
									</TableCell>
									<TableCell>
										<StudentStatus student={student} />
									</TableCell>
									<TableCell className="whitespace-nowrap">
										<Text as="span" variant="label-md" className="block tabular-nums">
											{student.active_listing_count} active
										</Text>
										<Text as="span" variant="body-sm" tone="muted" className="block tabular-nums">
											{student.listing_count} total
										</Text>
									</TableCell>
									<TableCell className="whitespace-nowrap text-muted-foreground">
										{formatDate(student.date_joined)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
