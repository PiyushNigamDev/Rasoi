import { Search, Users, UserRoundPlus } from "lucide-react";
import { useState } from "react";

const Customers = () => {
  const [search, setSearch] = useState("");

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">People</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Customers</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Keep track of the people ordering from your kitchen.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"><UserRoundPlus size={17} />Add customer</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">{[["Total customers", "0"], ["Active this month", "0"], ["New customers", "0"]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"><p className="text-sm text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p></div>)}</div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700"><div><h2 className="font-semibold text-slate-900 dark:text-white">Customer directory</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Search customer profiles and order history.</p></div><div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" /></div></div>
        <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"><Users size={26} /></div><h3 className="mt-4 font-semibold text-slate-900 dark:text-white">No customers yet</h3><p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{search ? `No customers match “${search}”.` : "Customer accounts will appear here after the first registration."}</p></div>
      </div>
    </section>
  );
};

export default Customers;