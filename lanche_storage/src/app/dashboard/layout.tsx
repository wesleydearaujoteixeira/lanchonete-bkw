'use client'

import Header from "./components/header/Header";
import { ProviderContext } from "../providers/order";

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div>
            <Header/>
            <ProviderContext> 
                {children}
            </ProviderContext>
        </div>
    );
  }
  