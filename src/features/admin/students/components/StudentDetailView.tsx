"use client";

import { ArrowLeft } from "lucide-react";

import QueryState from "@/components/feedback/QueryState";
import { Card } from "@/components/ui/card";
import { TextLink } from "@/components/ui/text-link";

import { useStudent } from "../queries";
import { STUDENTS_PATH } from "../routes";
import { StudentAccountDetails, StudentIdentity } from "./StudentAccount";
import StudentActions from "./StudentActions";
import StudentActivity from "./StudentActivity";
import StudentListings from "./StudentListings";

export default function StudentDetailView({ studentId }: { studentId: number }) {
	const query = useStudent(studentId);
	const student = query.data;

	return (
		<>
			<TextLink
				href={STUDENTS_PATH}
				className="max-lg:inline-flex max-lg:min-h-11 max-lg:items-center"
			>
				<ArrowLeft />
				Student directory
			</TextLink>

			{student ? (
				<div className="grid items-start gap-6 xl:grid-cols-[20rem_minmax(0,1fr)]">
					<Card
						aria-label={`${student.full_name} account`}
						className="gap-5 p-4 lg:gap-6 lg:p-5 xl:sticky xl:top-20"
					>
						<StudentIdentity student={student} heading="h1" />
						<StudentAccountDetails student={student} />
						<StudentActions student={student} />
					</Card>

					<div className="min-w-0 space-y-4 lg:space-y-6">
						<StudentListings studentId={student.id} />
						<StudentActivity studentId={student.id} />
					</div>
				</div>
			) : (
				<Card className="p-5">
					<QueryState isPending={!query.isError} error={query.error} onRetry={query.refetch} />
				</Card>
			)}
		</>
	);
}
