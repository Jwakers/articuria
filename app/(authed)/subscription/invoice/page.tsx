import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import Link from "next/link";

export default function InvoicePage() {
  const today = new Date();
  const invoiceDate = today.toLocaleDateString();
  const invoiceNumber = `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href="/subscription/success"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Success Page
          </Link>
        </div>

        <div className="mb-6 rounded-xl border bg-white p-8 shadow-md">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">Invoice</h1>
              <p className="text-sm text-muted-foreground">{invoiceNumber}</p>
            </div>
            <div className="text-right">
              <div className="font-bold">Your App, Inc.</div>
              <p className="text-sm text-muted-foreground">123 App Street</p>
              <p className="text-sm text-muted-foreground">
                San Francisco, CA 94103
              </p>
            </div>
          </div>

          <div className="mb-8 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
                Bill To
              </h2>
              <div className="font-medium">John Doe</div>
              <p className="text-sm text-muted-foreground">
                john.doe@example.com
              </p>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
                    Invoice Date
                  </h2>
                  <p>{invoiceDate}</p>
                </div>
                <div>
                  <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
                    Due Date
                  </h2>
                  <p>{invoiceDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-4 text-sm">
                    Pro Plan Subscription - Monthly
                  </td>
                  <td className="px-4 py-4 text-right text-sm">1</td>
                  <td className="px-4 py-4 text-right text-sm">$9.99</td>
                  <td className="px-4 py-4 text-right text-sm">$9.99</td>
                </tr>
              </tbody>
              <tfoot className="border-t bg-slate-50">
                <tr>
                  <td colSpan={2}></td>
                  <td className="px-4 py-3 text-right text-sm font-semibold">
                    Subtotal
                  </td>
                  <td className="px-4 py-3 text-right text-sm">$9.99</td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td className="px-4 py-3 text-right text-sm font-semibold">
                    Tax
                  </td>
                  <td className="px-4 py-3 text-right text-sm">$0.00</td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td className="px-4 py-3 text-right text-sm font-bold">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold">
                    $9.99
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              Payment processed via Credit Card ending in 4242.
            </p>
            <p>
              If you have any questions about this invoice, please contact
              support@yourapp.com
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" /> Print Invoice
          </Button>

          <Button className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
