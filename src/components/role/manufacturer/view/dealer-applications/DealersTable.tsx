"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ApplicationStatus, Dealer } from "@/types";

interface Props {
  dealersData: {
    dealer: Dealer;
    status: ApplicationStatus;
    message: string | null;
    created_at: string;
  }[];
}

const statusBadgeClass = (status: ApplicationStatus) => {
  switch (status) {
    case "APPROVED":
      return "border-green-500 bg-green-100 text-green-700";
    case "REJECTED":
      return "border-red-500 bg-red-100 text-red-700";
    case "IN_REVIEW":
      return "border-yellow-500 bg-yellow-100 text-yellow-700";
    default:
      return "border-gray-300 bg-gray-100 text-gray-700";
  }
};

const DealersTable = ({ dealersData }: Props) => {
  return (
    <Table>
      <TableHeader className="bg-primary/10">
        <TableRow>
          <TableHead className="px-5">Logo</TableHead>
          <TableHead className="text-center">Company Name</TableHead>
          <TableHead className="text-center">City</TableHead>
          <TableHead className="text-center">State</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="px-5 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {dealersData?.map((row) => {
          const dealer = row.dealer;

          return (
            <TableRow key={dealer.id} className="h-14">
              <TableCell className="pl-5">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-primary/10">
                  {dealer.company_logo ? (
                    <Avatar className="h-full w-full">
                      <AvatarImage
                        src={dealer.company_logo}
                        alt={`${dealer.company_name} logo`}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-lg">
                        {dealer.company_name?.[0]}
                        {dealer.company_name?.[1]}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted font-semibold text-muted-foreground text-xl">
                      {dealer.company_name?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell className="text-center text-sm">
                {dealer.company_name}
              </TableCell>

              <TableCell className="text-center text-sm">
                {dealer.city}
              </TableCell>

              <TableCell className="text-center text-sm">
                {dealer.state}
              </TableCell>

              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className={statusBadgeClass(row.status)}
                >
                  {row.status}
                </Badge>
              </TableCell>

              <TableCell className="pr-5 text-right">
                <Button size="sm" asChild>
                  <Link href={`/manufacturer/dealer-applications/${dealer.id}`}>
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default DealersTable;
