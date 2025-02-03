"use client";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export default function Breadcrumbs() {
  const path = usePathname();
  const breadcrumbs = path.split("/").filter(Boolean);
  const currentPage = breadcrumbs.pop();

  const getLabel = (text: string) => {
    return text.replace(/-/g, " ");
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const { pathname } = new URL(
            `${window.location.origin}/${breadcrumbs
              .slice(0, index + 1)
              .join("/")}`
          );

          return (
            <Fragment key={pathname}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={pathname} className="capitalize">
                    {getLabel(crumb)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          );
        })}
        {currentPage ? (
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">
              {getLabel(currentPage)}
            </BreadcrumbPage>
          </BreadcrumbItem>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
