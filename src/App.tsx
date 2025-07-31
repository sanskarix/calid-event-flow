import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Settings } from "./pages/Settings";
import PublicBooking from "./pages/PublicBooking";
import { Profile } from "./pages/settings/Profile";
import { General } from "./pages/settings/General";
import { Calendars } from "./pages/settings/Calendars";
import { Conferencing } from "./pages/settings/Conferencing";
import { Appearance } from "./pages/settings/Appearance";
import { OutOfOffice } from "./pages/settings/OutOfOffice";
import { Import} from "./pages/settings/Import";
import { Webhooks } from "./pages/settings/Webhooks";
import { ApiKeys } from "./pages/settings/ApiKeys";
import { EventTypes } from "./pages/EventTypes";
import { EditEvent } from "./pages/EditEvent";
import { Availability } from "./pages/Availability";
import { EditAvailability } from "./pages/EditAvailability";
import NotFound from "./pages/NotFound";
import Bookings from "./pages/Bookings";
import { Password } from "./pages/settings/Password";
import { Impersonation } from "./pages/settings/Impersonation";
import { TeamNew } from "./pages/settings/TeamNew";
import { TeamDetail } from "./pages/settings/TeamDetail";
import { EditTeams } from "./pages/settings/EditTeams";
import { TeamProfile } from "./pages/settings/teams/TeamProfile";
import { TeamMembers } from "./pages/settings/teams/TeamMembers";
import { TeamEventTypes } from "./pages/settings/teams/TeamEventTypes";
import { TeamAppearance } from "./pages/settings/teams/TeamAppearance";
import { TeamBookingLimits } from "./pages/settings/teams/TeamBookingLimits";
import SchedulingComingSoon from "./pages/SchedulingComingSoon";
import { Teams } from "./pages/Teams";
import { RoutingForms } from "./pages/RoutingForms";
import { EditRoutingForm } from "./pages/EditRoutingForm";
import { Workflows } from "./pages/Workflows";
import { WorkflowTemplates } from "./pages/WorkflowTemplates";
import { WorkflowBuilder } from "./pages/WorkflowBuilder";
import { Apps } from "./pages/Apps";
import Home from "./pages/Home";
import { Insights } from "./pages/Insights";
import { HeaderProvider } from "./contexts/HeaderContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HeaderProvider>
        <BrowserRouter>
          <Routes>
            {/* Public booking page */}
            <Route path="/cal/:username" element={<PublicBooking />} />
            
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="event-types" element={<EventTypes />} />
              <Route path="event/:eventId/:tab" element={<EditEvent />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="availability" element={<Availability />} />
              <Route path="availability/:scheduleId" element={<EditAvailability />} />
              <Route path="scheduling-coming-soon" element={<SchedulingComingSoon />} />
              <Route path="teams" element={<Teams />} />
              <Route path="apps" element={<Apps />} />
              <Route path="routing-forms" element={<RoutingForms />} />
              <Route path="routing-forms/:formId/edit" element={<EditRoutingForm />} />
              <Route path="workflows" element={<Workflows />} />
              <Route path="workflows/templates" element={<WorkflowTemplates />} />
              <Route path="workflows/new" element={<WorkflowBuilder />} />
              <Route path="workflows/:workflowId/edit" element={<WorkflowBuilder />} />
              <Route path="insights" element={<Insights />} />
            </Route>
            
            <Route path="/settings" element={<Settings />}>
              <Route path="profile" element={<Profile />} />
              <Route path="general" element={<General />} />
              <Route path="calendars" element={<Calendars />} />
              <Route path="conferencing" element={<Conferencing />} />
              <Route path="appearance" element={<Appearance />} />
              <Route path="out-of-office" element={<OutOfOffice />} />
              <Route path="security/password" element={<Password />} />
              <Route path="security/impersonation" element={<Impersonation />} />
              <Route path="others/import" element={<Import />} />
              <Route path="developer/webhooks" element={<Webhooks />} />
              <Route path="developer/api-keys" element={<ApiKeys />} />
              <Route path="teams/new" element={<TeamNew />} />
              <Route path="teams/edit" element={<EditTeams />} />
              <Route path="teams/:teamId" element={<TeamDetail />} />
              <Route path="teams/:teamId/:section" element={<TeamDetail />} />
              <Route path="teams/:teamId/profile" element={<TeamProfile />} />
              <Route path="teams/:teamId/members" element={<TeamMembers />} />
              <Route path="teams/:teamId/event-types" element={<TeamEventTypes />} />
              <Route path="teams/:teamId/appearance" element={<TeamAppearance />} />
              <Route path="teams/:teamId/booking-limits" element={<TeamBookingLimits />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HeaderProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
