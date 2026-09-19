function PlaceCardSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="aspect-[4/3] animate-pulse bg-slate-200 motion-reduce:animate-none" />

      <div className="space-y-5 p-6">
        <div className="h-6 w-3/4 animate-pulse rounded-full bg-slate-200 motion-reduce:animate-none" />

        <div className="flex gap-3">
          <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100 motion-reduce:animate-none" />
          <div className="h-4 w-20 animate-pulse rounded-full bg-slate-100 motion-reduce:animate-none" />
        </div>

        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded-full bg-slate-100 motion-reduce:animate-none" />
          <div className="h-4 w-full animate-pulse rounded-full bg-slate-100 motion-reduce:animate-none" />
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-100 motion-reduce:animate-none" />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="h-11 w-36 animate-pulse rounded-full bg-slate-200 motion-reduce:animate-none" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-slate-100 motion-reduce:animate-none" />
        </div>
      </div>
    </article>
  );
}

export default PlaceCardSkeleton;