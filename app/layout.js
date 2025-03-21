import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";
import Provider from "./provider";


export const metadata = {
  title: "Neosite by Unimanage",
  description: "Created by Unimanage",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
      >
        <ConvexClientProvider>
          <Provider>
            {children}
          </Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
