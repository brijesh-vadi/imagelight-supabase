"use client";

import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useManufacturers } from "@/hooks/admin/useManufacturerApplications";
import { formatDate } from "@/lib/utils";

const ApplicationsTable = () => {
  const router = useRouter();

  const { data: manufacturers, isLoading } = useManufacturers({
    page: 1,
    limit: 10,
  });

  if (isLoading)
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader className="bg-primary/10">
          <TableRow>
            <TableHead className="px-5">Logo</TableHead>
            <TableHead className="text-center">Company Name</TableHead>
            <TableHead className="text-center">City</TableHead>
            <TableHead className="text-center">State</TableHead>
            <TableHead className="text-center">Application Status</TableHead>
            <TableHead className="text-center">Is Active?</TableHead>
            <TableHead className="text-center">Verified</TableHead>
            <TableHead className="text-right">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {manufacturers?.data?.map((manufacturer) => (
            <TableRow
              key={manufacturer.id}
              className="h-16 cursor-pointer"
              onClick={() =>
                router.push(`/admin/applications/${manufacturer.id}`)
              }
            >
              <TableCell className="pl-5">
                <div className="relative overflow-hidden rounded-full">
                  {manufacturer.company_logo ? (
                    <Avatar>
                      <AvatarImage
                        src={manufacturer.company_logo}
                        alt={`${manufacturer.company_name} logo`}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {manufacturer.company_name?.[0]}
                        {manufacturer.company_name?.[1]}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted font-semibold text-muted-foreground text-xs">
                      {manufacturer.company_name?.charAt(0).toUpperCase() ||
                        "?"}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {manufacturer.company_name || "—"}
              </TableCell>
              <TableCell className="text-center">{manufacturer.city}</TableCell>
              <TableCell className="text-center">
                {manufacturer.state}
              </TableCell>
              <TableCell className="text-center">
                <ApplicationStatusBadge
                  status={manufacturer.application_status}
                />
              </TableCell>
              <TableCell className="text-center">
                {manufacturer.is_active ? (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Active
                  </Badge>
                ) : (
                  <Badge variant="destructive">Not Active</Badge>
                )}
              </TableCell>
              <TableCell className="text-center">
                {manufacturer.is_verified ? (
                  <BadgeCheck
                    size={22}
                    className="text-white mx-auto text-blue"
                    fill="#2b7fff"
                  />
                ) : (
                  <BadgeCheck
                    size={22}
                    className="text-white mx-auto text-blue bg-gr"
                    fill="#6a7282"
                  />
                )}
              </TableCell>
              <TableCell className="text-right">
                {formatDate(manufacturer.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

function ApplicationStatusBadge({ status }: { status?: string | null }) {
  if (!status) {
    return <Badge variant="outline">No Application</Badge>;
  }

  const styles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    IN_REVIEW: "bg-blue-100 text-blue-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default ApplicationsTable;
