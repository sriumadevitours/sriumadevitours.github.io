import { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  LayoutDashboard,
  Map,
  MessageSquare,
  Calendar,
  Star,
  Users,
  LogOut,
  Eye,
  ChevronRight,
  TrendingUp,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import type { Tour, Inquiry, Testimonial, Booking } from "@shared/schema";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "inquiries", label: "Inquiries", icon: MessageSquare },
  { id: "tours", label: "Tours", icon: Map },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "testimonials", label: "Testimonials", icon: Star },
];

export default function AdminDashboard() {
  const { section } = useParams<{ section?: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const activeSection = section || "overview";

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["/api/admin/session"],
    retry: false,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!session,
  });

  const { data: tours } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
    enabled: !!session,
  });

  const { data: inquiries } = useQuery<Inquiry[]>({
    queryKey: ["/api/admin/inquiries"],
    enabled: !!session,
  });

  const { data: testimonials } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
    enabled: !!session,
  });

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/admin/bookings"],
    enabled: !!session,
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/session"] });
      setLocation("/admin/login");
    },
  });

  const updateInquiryStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest("PATCH", `/api/admin/inquiries/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inquiries"] });
      toast({ title: "Status updated successfully" });
    },
  });

  useEffect(() => {
    if (!sessionLoading && !session) {
      setLocation("/admin/login");
    }
  }, [session, sessionLoading, setLocation]);

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "contacted":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <span className="font-serif text-xl font-bold text-primary">
              Sri Umadevi Tours
            </span>
            <Badge variant="secondary">Admin</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            className="gap-2"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.id} href={`/admin/${item.id === "overview" ? "" : item.id}`}>
                  <Button
                    variant={activeSection === item.id ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3"
                    data-testid={`nav-admin-${item.id}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </aside>

          <main className="flex-1 space-y-6">
            {activeSection === "overview" && (
              <>
                <div>
                  <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                  <p className="text-muted-foreground">
                    Welcome back! Here's what's happening with your tours.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Tours</p>
                          <p className="text-3xl font-bold">{tours?.length || 0}</p>
                        </div>
                        <Map className="h-10 w-10 text-primary/20" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">New Inquiries</p>
                          <p className="text-3xl font-bold">
                            {inquiries?.filter((i) => i.status === "new").length || 0}
                          </p>
                        </div>
                        <MessageSquare className="h-10 w-10 text-blue-500/20" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Inquiries</p>
                          <p className="text-3xl font-bold">{inquiries?.length || 0}</p>
                        </div>
                        <TrendingUp className="h-10 w-10 text-green-500/20" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Testimonials</p>
                          <p className="text-3xl font-bold">{testimonials?.length || 0}</p>
                        </div>
                        <Star className="h-10 w-10 text-yellow-500/20" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Inquiries</CardTitle>
                    <CardDescription>Latest tour inquiries from potential customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {inquiries && inquiries.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Tour</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inquiries.slice(0, 5).map((inquiry) => (
                            <TableRow key={inquiry.id}>
                              <TableCell className="font-medium">{inquiry.name}</TableCell>
                              <TableCell>{inquiry.tourName || "-"}</TableCell>
                              <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="capitalize">
                                  {inquiry.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No inquiries yet
                      </p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {activeSection === "inquiries" && (
              <>
                <div>
                  <h1 className="text-2xl font-bold">Inquiries</h1>
                  <p className="text-muted-foreground">
                    Manage customer inquiries and follow up on leads
                  </p>
                </div>

                <Card>
                  <CardContent className="p-0">
                    {inquiries && inquiries.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Tour</TableHead>
                            <TableHead>Travelers</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inquiries.map((inquiry) => (
                            <TableRow key={inquiry.id} data-testid={`row-inquiry-${inquiry.id}`}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{inquiry.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {inquiry.preferredDate || "-"}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <a
                                    href={`tel:${inquiry.phone}`}
                                    className="flex items-center gap-1 text-sm hover:text-primary"
                                  >
                                    <Phone className="h-3 w-3" />
                                    {inquiry.phone}
                                  </a>
                                  <a
                                    href={`mailto:${inquiry.email}`}
                                    className="flex items-center gap-1 text-sm hover:text-primary"
                                  >
                                    <Mail className="h-3 w-3" />
                                    {inquiry.email}
                                  </a>
                                </div>
                              </TableCell>
                              <TableCell>{inquiry.tourName || "-"}</TableCell>
                              <TableCell>{inquiry.numberOfTravelers}</TableCell>
                              <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                              <TableCell>
                                <Select
                                  value={inquiry.status || "new"}
                                  onValueChange={(value) =>
                                    updateInquiryStatus.mutate({ id: inquiry.id, status: value })
                                  }
                                >
                                  <SelectTrigger className="w-[130px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="contacted">Contacted</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No inquiries received yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {activeSection === "tours" && (
              <>
                <div>
                  <h1 className="text-2xl font-bold">Tours</h1>
                  <p className="text-muted-foreground">
                    Manage your tour packages
                  </p>
                </div>

                <Card>
                  <CardContent className="p-0">
                    {tours && tours.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tour Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tours.map((tour) => (
                            <TableRow key={tour.id} data-testid={`row-tour-${tour.id}`}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {tour.imageUrl && (
                                    <img
                                      src={tour.imageUrl}
                                      alt={tour.name}
                                      className="w-12 h-12 rounded object-cover"
                                    />
                                  )}
                                  <div>
                                    <p className="font-medium">{tour.name}</p>
                                    {tour.isPremium && (
                                      <Badge variant="secondary" className="text-xs">
                                        Premium
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="capitalize">{tour.category}</TableCell>
                              <TableCell>{tour.duration}</TableCell>
                              <TableCell>
                                {new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                  maximumFractionDigits: 0,
                                }).format(tour.pricePerPerson)}
                              </TableCell>
                              <TableCell>
                                <Badge variant={tour.isActive ? "default" : "secondary"}>
                                  {tour.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Map className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No tours added yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {activeSection === "testimonials" && (
              <>
                <div>
                  <h1 className="text-2xl font-bold">Testimonials</h1>
                  <p className="text-muted-foreground">
                    Manage customer reviews and testimonials
                  </p>
                </div>

                <Card>
                  <CardContent className="p-0">
                    {testimonials && testimonials.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Tour</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Review</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {testimonials.map((testimonial) => (
                            <TableRow key={testimonial.id}>
                              <TableCell>
                                <p className="font-medium">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {testimonial.year}
                                </p>
                              </TableCell>
                              <TableCell>{testimonial.tourName || "-"}</TableCell>
                              <TableCell>
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < testimonial.rating
                                          ? "text-yellow-500 fill-yellow-500"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="max-w-xs truncate">
                                {testimonial.review}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={testimonial.isApproved ? "default" : "secondary"}
                                >
                                  {testimonial.isApproved ? "Approved" : "Pending"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No testimonials yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {activeSection === "bookings" && (
              <>
                <div>
                  <h1 className="text-2xl font-bold">Bookings</h1>
                  <p className="text-muted-foreground">
                    Manage confirmed bookings and payments
                  </p>
                </div>

                <Card>
                  <CardContent className="p-0">
                    {bookings && bookings.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Travelers</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">
                                {booking.customerName}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <p className="text-sm">{booking.customerPhone}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {booking.customerEmail}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>{booking.numberOfTravelers}</TableCell>
                              <TableCell>
                                {new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                  maximumFractionDigits: 0,
                                }).format(booking.totalAmount)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    booking.paymentStatus === "paid"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {booking.paymentStatus}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    booking.bookingStatus === "confirmed"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {booking.bookingStatus}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No bookings yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
