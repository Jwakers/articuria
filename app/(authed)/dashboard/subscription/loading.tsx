export default function Loading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Page Header Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-5 w-full max-w-md animate-pulse rounded bg-gray-200" />
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-8">
        <div className="mb-8 grid w-full grid-cols-3 overflow-hidden rounded-lg border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-center px-4 py-2">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Subscription Tab Content Skeleton */}
        <div className="grid gap-8">
          {/* Current Subscription Card */}
          <div className="rounded-lg border p-6">
            <div className="border-b pb-6">
              <div className="flex items-center justify-between">
                <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
              </div>
              <div className="mt-1 h-4 w-64 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="grid gap-6 py-6">
              {/* Subscription Details */}
              <div className="grid gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>

              {/* Plan Features */}
              <div>
                <div className="mb-2 h-5 w-32 animate-pulse rounded bg-gray-200" />
                <div className="grid gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-pulse rounded-full bg-gray-200" />
                      <div className="h-4 w-full max-w-xs animate-pulse rounded bg-gray-200" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage */}
              <div>
                <div className="mb-2 h-5 w-16 animate-pulse rounded bg-gray-200" />
                <div className="grid gap-4">
                  {[1, 2].map((i) => (
                    <div key={i}>
                      <div className="mb-1 flex justify-between">
                        <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                      </div>
                      <div className="h-2 w-full animate-pulse rounded-full bg-gray-200" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between border-t pt-6">
              <div className="h-9 w-40 animate-pulse rounded bg-gray-200" />
              <div className="h-9 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          {/* Need Help Card */}
          <div className="rounded-lg border p-6">
            <div className="pb-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
            <div className="pb-4">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="pt-2">
              <div className="h-9 w-full animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
