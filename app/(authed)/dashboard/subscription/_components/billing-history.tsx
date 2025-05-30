"use client";

import { getReceiptUrl } from "@/app/server/stripe/stripe-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { price } from "@/lib/utils";
import { Download, FileText, Loader2 } from "lucide-react";
import { use, useEffect, useTransition } from "react";
import { toast } from "sonner";
import type Stripe from "stripe";
import { BillingTabsProps } from "./billing-tabs";

export function BillingHistory({ billingDataPromise }: BillingTabsProps) {
  const { data, error } = use(billingDataPromise);
  const [pending, startTransition] = useTransition();

  const handleInvoiceDownload = async (chargeId: string | null) => {
    if (!data || !chargeId) return toast.error("Unable to get invoice");
    startTransition(async () => {
      const url = await getReceiptUrl(chargeId);

      if (!url) {
        toast.error("Unable to get invoice");
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    });
  };

  useEffect(() => {
    if (!error) return;
    toast.error(error);
  }, [error]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>View and download your past invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell
                  className="max-w-12 overflow-hidden font-medium text-ellipsis"
                  title={item.id}
                >
                  {item.id}
                </TableCell>
                <TableCell>
                  {item.created
                    ? new Date(item.created * 1000).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {item.amount ? price(item.amount / 100) : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === "succeeded" ? "outline" : "destructive"
                    }
                    className={
                      item.status === "succeeded"
                        ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                        : ""
                    }
                  >
                    {item.status === "succeeded"
                      ? "Paid"
                      : item.status || "Unknown"}
                  </Badge>
                </TableCell>
                <TableCell>{item.description ?? "-"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Download Invoice"
                    disabled={pending}
                    onClick={() =>
                      handleInvoiceDownload(
                        (item.latest_charge as Stripe.Charge)?.id ??
                          item.latest_charge,
                      )
                    }
                  >
                    {pending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Download className="size-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!data?.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="text-muted-foreground mb-4 size-12" />
            <h3 className="text-lg font-medium">No invoices yet</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Your billing history will appear here once you have been charged.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
