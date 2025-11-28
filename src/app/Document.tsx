import "./globals.css";

export const Document: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <html lang="de">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Abfallkalender Lyss</title>
      <meta name="description" content="Papier- und Kartonsammlung in Lyss und Busswil" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
      <link rel="modulepreload" href="/src/client.tsx" />
    </head>
    <body className="min-h-screen bg-background antialiased">
      <div id="root">{children}</div>
      <script>import("/src/client.tsx")</script>
    </body>
  </html>
);
