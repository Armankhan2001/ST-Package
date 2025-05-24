import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PackageList from "@/pages/package-list";
import PackageDetails from "@/pages/package-details";
import BookPackage from "@/pages/book-package";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCreate from "@/pages/admin/create";
import AdminEdit from "@/pages/admin/edit";
import AdminBookings from "@/pages/admin/bookings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/package-list" component={PackageList} />
      <Route path="/package-details/:id" component={PackageDetails} />
      <Route path="/book-package/:id" component={BookPackage} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/create" component={AdminCreate} />
      <Route path="/admin/edit/:id" component={AdminEdit} />
      <Route path="/admin/bookings" component={AdminBookings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
