import { InternalSidebar } from './InternalSidebar';

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <InternalSidebar />
      <main className="zellige-light flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
