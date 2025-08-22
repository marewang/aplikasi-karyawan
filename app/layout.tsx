export const metadata = {
  title: "ASN CRUD",
  description: "Aplikasi Monitoring ASN - CRUD",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
