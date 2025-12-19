"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Manufacturer } from "@/types";

interface Props {
  manufacturers: Pick<
    Manufacturer,
    | "id"
    | "company_name"
    | "company_logo"
    | "contact_person"
    | "gst_number"
    | "email"
    | "mobile"
    | "address"
    | "city"
    | "state"
    | "pincode"
    | "website"
    | "company_description"
  >[];
}

const ManufacturersTable = ({ manufacturers }: Props) => {
  return (
    <Table>
      <TableHeader className="bg-primary/10">
        <TableRow>
          <TableHead className="px-5">Logo</TableHead>
          <TableHead className="text-center">Company Name</TableHead>
          <TableHead className="text-center">City</TableHead>
          <TableHead className="text-center">State</TableHead>
          <TableHead className="px-5 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {manufacturers.map((manufacturer) => (
          <TableRow key={manufacturer.id} className="h-14">
            <TableCell className="pl-5 text-left text-sm">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-primary/10">
                {manufacturer?.company_logo ? (
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src={manufacturer.company_logo}
                      alt={`${manufacturer?.company_name} logo`}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg">
                      {manufacturer?.company_name?.[0]}
                      {manufacturer?.company_name?.[1]}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted font-semibold text-muted-foreground text-xl">
                    {manufacturer?.company_name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell className=" text-center text-sm">
              {manufacturer.company_name}
            </TableCell>
            <TableCell className="text-center text-sm">
              {manufacturer.city}
            </TableCell>
            <TableCell className="text-center text-sm">
              {manufacturer.state}
            </TableCell>
            <TableCell className="pr-5 text-right text-sm">
              <Button size="sm" asChild>
                <Link href={`/dealer/manufacturers/${manufacturer.id}`}>
                  View
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ManufacturersTable;
