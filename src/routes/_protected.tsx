import { authClient } from "@/lib/auth-client";
import { accounts$, transactions$ } from "@/lib/legend-state";
import { useWhen } from "@legendapp/state/react";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { Plus, TrendingUp, Wallet } from "lucide-react";
import { Suspense, use } from "react";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    console.log(session);
    if (!session) {
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const accountsPromise = useWhen(accounts$);
  const transactionsPromise = useWhen(transactions$);

  use(accountsPromise);
  use(transactionsPromise);

  return (
    <>
      <Suspense>
        <Outlet />
      </Suspense>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-3 gap-1 p-2">
          <Link
            to="/"
            activeProps={{ className: "text-primary" }}
            className="flex flex-col items-center py-2 px-2"
          >
            <Wallet className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link
            to="/accounts"
            activeProps={{ className: "text-primary" }}
            className="flex flex-col items-center py-2 px-2"
          >
            <Plus className="h-5 w-5 mb-1" />
            <span className="text-xs">Accounts</span>
          </Link>
          <Link
            to="/transactions"
            activeProps={{ className: "text-primary" }}
            className="flex flex-col items-center py-2 px-2"
          >
            <TrendingUp className="h-5 w-5 mb-1" />
            <span className="text-xs">Transactions</span>
          </Link>
        </div>
      </div>
    </>
  );
}
