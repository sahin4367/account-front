export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      {children}
    </div>
  );
}