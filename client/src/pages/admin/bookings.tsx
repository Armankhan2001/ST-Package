import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { checkAdminAuth } from "@/lib/auth";
import { Booking } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

export default function AdminBookings() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await checkAdminAuth();
      if (!isAuthenticated) {
        navigate("/admin/login");
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Fetch all bookings
  const { data: bookings, isLoading, error, refetch } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
    retry: 1
  });
  
  // Handle status update
  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }
      
      toast({
        title: "Status Updated",
        description: `Booking #${bookingId} status changed to ${newStatus}`,
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };
  
  // Filter bookings by status
  const filteredBookings = bookings?.filter(booking => 
    statusFilter === "all" ? true : booking.status === statusFilter
  );
  
  // State for booking details modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [packageDetails, setPackageDetails] = useState<any>(null);
  
  // Handle view booking details
  const handleViewDetails = async (bookingId: number) => {
    const booking = bookings?.find(b => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      
      // Fetch package details
      try {
        const response = await fetch(`/api/packages/${booking.packageId}`);
        if (response.ok) {
          const packageData = await response.json();
          setPackageDetails(packageData);
        } else {
          setPackageDetails(null);
        }
      } catch (error) {
        console.error("Error fetching package details:", error);
        setPackageDetails(null);
      }
      
      setShowDetailsModal(true);
    }
  };
  
  // Close modal
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedBooking(null);
    setPackageDetails(null);
  };

  // Calculate price based on package and number of travelers
  const getPriceDisplay = (booking: Booking) => {
    if (booking.packageId) {
      return `₹${booking.numberOfTravelers * 1000}`; // Placeholder calculation
    }
    return "N/A";
  };

  // Function to export bookings to CSV
  const exportToCSV = () => {
    if (!bookings || bookings.length === 0) {
      toast({
        title: "No Data",
        description: "There are no bookings to export",
        variant: "destructive",
      });
      return;
    }
    
    // Create CSV headers
    const headers = [
      'Booking ID',
      'Customer Name',
      'Email',
      'Phone',
      'Package ID',
      'Travel Date',
      'Number of Travelers',
      'Special Requirements',
      'Status',
      'Booking Date'
    ].join(',');
    
    // Create CSV rows
    const rows = bookings.map(booking => [
      booking.id,
      `"${booking.name}"`,
      `"${booking.email}"`,
      `"${booking.phone}"`,
      booking.packageId,
      `"${booking.travelDate}"`,
      booking.numberOfTravelers,
      `"${booking.specialRequirements || ''}"`,
      `"${booking.status || 'pending'}"`,
      booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'
    ].join(','));
    
    // Combine headers and rows
    const csvContent = [headers, ...rows].join('\n');
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `${bookings.length} bookings exported to CSV`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <div className="flex space-x-2">
          <button 
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded"
          >
            Export to CSV
          </button>
          <button 
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
      
      {/* Filter options */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <span className="font-medium">Filter by Status:</span>
          <select 
            className="border rounded px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      {/* Bookings table */}
      {isLoading ? (
        <div className="text-center py-10">Loading bookings...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">
          Error loading bookings. Please try again.
        </div>
      ) : filteredBookings?.length === 0 ? (
        <div className="text-center py-10">
          No bookings found. {statusFilter !== "all" && "Try changing the filter."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left">ID</th>
                <th className="py-3 px-4 border-b text-left">Customer</th>
                <th className="py-3 px-4 border-b text-left">Package</th>
                <th className="py-3 px-4 border-b text-left">Travel Date</th>
                <th className="py-3 px-4 border-b text-left">Travelers</th>
                <th className="py-3 px-4 border-b text-left">Booking Date</th>
                <th className="py-3 px-4 border-b text-left">Status</th>
                <th className="py-3 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings?.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{booking.id}</td>
                  <td className="py-3 px-4 border-b">
                    <div>{booking.name}</div>
                    <div className="text-sm text-gray-500">{booking.email}</div>
                    <div className="text-sm text-gray-500">{booking.phone}</div>
                  </td>
                  <td className="py-3 px-4 border-b">
                    Package #{booking.packageId}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {booking.travelDate}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {booking.numberOfTravelers} Travelers
                  </td>
                  <td className="py-3 px-4 border-b">
                    {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs 
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''} 
                      ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                      ${booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                    `}>
                      {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(booking.id)}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        View
                      </button>
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={booking.status || 'pending'}
                        onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="cancelled">Cancel</option>
                        <option value="completed">Complete</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#000080]">Booking Details</h2>
                <button 
                  onClick={closeDetailsModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Package Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-[#000080]">Package Information</h3>
                  {packageDetails ? (
                    <div>
                      <div className="mb-3">
                        <img 
                          src={packageDetails.imageUrl} 
                          alt={packageDetails.title}
                          className="w-full h-48 object-cover rounded-lg mb-2"
                        />
                        <h4 className="text-lg font-semibold">{packageDetails.title}</h4>
                        <p className="text-gray-600">{packageDetails.destinations}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <span className="text-gray-500 text-sm">Duration:</span>
                          <p>{packageDetails.duration}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Price:</span>
                          <p>{formatCurrency(packageDetails.price)}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">Description:</span>
                        <p className="text-sm mt-1">{packageDetails.description}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Package details not available</p>
                  )}
                </div>
                
                {/* Customer & Booking Details */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-[#000080]">Customer Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500 text-sm">Name:</span>
                        <p className="font-medium">{selectedBooking.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">Email:</span>
                        <p>{selectedBooking.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">Phone:</span>
                        <p>{selectedBooking.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">WhatsApp Contact:</span>
                        <p>{selectedBooking.whatsappConsent ? 'Allowed' : 'Not allowed'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-[#000080]">Booking Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500 text-sm">Booking ID:</span>
                        <p className="font-medium">#{selectedBooking.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">Travel Date:</span>
                        <p>{selectedBooking.travelDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">Number of Travelers:</span>
                        <p>{selectedBooking.numberOfTravelers}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">Booking Date:</span>
                        <p>{selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">Status:</span>
                        <p>
                          <span className={`px-2 py-1 rounded-full text-xs 
                            ${selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''} 
                            ${selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                            ${selectedBooking.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                          `}>
                            {selectedBooking.status ? selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1) : 'Pending'}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    {selectedBooking.specialRequirements && (
                      <div className="mt-4">
                        <span className="text-gray-500 text-sm">Special Requirements:</span>
                        <p className="p-2 bg-gray-50 rounded mt-1 text-sm">
                          {selectedBooking.specialRequirements}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="mt-8 pt-4 border-t flex justify-between">
                    <div>
                      <span className="text-gray-500 text-sm">Change Status:</span>
                      <select
                        className="ml-2 border rounded px-2 py-1"
                        value={selectedBooking.status || 'pending'}
                        onChange={(e) => {
                          handleStatusUpdate(selectedBooking.id, e.target.value);
                          closeDetailsModal();
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <button
                        onClick={closeDetailsModal}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}