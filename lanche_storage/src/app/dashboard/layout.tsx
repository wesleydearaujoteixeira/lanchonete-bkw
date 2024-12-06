import Header from "./components/header/Header";

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div>
            <Header/>
            {children}
        </div>
    );
  }
  