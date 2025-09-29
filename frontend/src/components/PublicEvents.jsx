import { useState, useEffect } from "react";
import api from "../lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import { useAuth } from "../context/AuthContext";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const { userName } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/bookings/my`);
        const bookedEvents = (res.data || []).map((b) => b.eventId).filter(Boolean);
        setEvents(bookedEvents);
      } catch (error) {
        toast.error("Failed to load your events");
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDownloadTicket = (event) => {
    const doc = new jsPDF();
    const bookingDetails = { 
      userName: userName || "Guest User", 
      userEmail: "user@example.com" 
    };

    // Set up colors
    const primaryColor = [37, 99, 235]; 
    const textColor = [31, 41, 55]; 
    const lightGray = [243, 244, 246]; 

    // Page margins
    const margin = 20;
    const pageWidth = 210;
    const pageHeight = 297;

    // Header Background
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 60, 'F');

    // Event Ticketing System Logo/Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('EVENT TICKET', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Event Ticketing System', pageWidth / 2, 35, { align: 'center' });

    // Ticket Number and QR placeholder
    doc.setFontSize(10);
    const ticketNumber = `TKT-${Date.now().toString().slice(-8)}`;
    doc.text(`Ticket #: ${ticketNumber}`, pageWidth - margin, 45, { align: 'right' });

    // Reset text color for content
    doc.setTextColor(...textColor);

    // Event Name - Large and prominent
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(event.name, margin, 85);

    // Decorative line under event name
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(2);
    doc.line(margin, 90, pageWidth - margin, 90);

    // Event Details Section
    let yPosition = 110;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('EVENT DETAILS', margin, yPosition);

    yPosition += 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);

    // Date and Time
    const eventDate = new Date(event.date);
    const dateOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    doc.setFont('helvetica', 'bold');
    doc.text('📅 Date & Time:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(eventDate.toLocaleDateString('en-US', dateOptions), margin + 35, yPosition);

    yPosition += 12;
    doc.setFont('helvetica', 'bold');
    doc.text('📍 Location:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(event.location || "To Be Announced", margin + 35, yPosition);

    yPosition += 12;
    doc.setFont('helvetica', 'bold');
    doc.text('🎫 Price:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(event.price ? `₹${event.price}` : "Free", margin + 35, yPosition);

    if (event.category) {
      yPosition += 12;
      doc.setFont('helvetica', 'bold');
      doc.text('🏷️ Category:', margin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(event.category, margin + 35, yPosition);
    }

    // Event Description
    if (event.description) {
      yPosition += 20;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('DESCRIPTION', margin, yPosition);
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      
      // Split description into lines
      const splitDescription = doc.splitTextToSize(event.description, pageWidth - 2 * margin);
      doc.text(splitDescription, margin, yPosition);
      yPosition += splitDescription.length * 5;
    }

    // Attendee Information Section
    yPosition += 25;
    doc.setFillColor(...lightGray);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 35, 'F');

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('ATTENDEE INFORMATION', margin + 5, yPosition + 5);

    yPosition += 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);

    doc.setFont('helvetica', 'bold');
    doc.text('👤 Name:', margin + 5, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingDetails.userName, margin + 35, yPosition);

    yPosition += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('✉️ Email:', margin + 5, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingDetails.userEmail, margin + 35, yPosition);

    // QR Code placeholder (you can integrate a real QR code library later)
    yPosition += 25;
    doc.setFillColor(255, 255, 255);
    doc.rect(pageWidth - margin - 40, yPosition - 40, 35, 35, 'F');
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1);
    doc.rect(pageWidth - margin - 40, yPosition - 40, 35, 35);
    
    doc.setFontSize(8);
    doc.setTextColor(...primaryColor);
    doc.text('QR CODE', pageWidth - margin - 37, yPosition - 20, { align: 'left' });
    doc.text('(Scan at venue)', pageWidth - margin - 37, yPosition - 15, { align: 'left' });

    // Terms and Conditions
    yPosition += 30;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('IMPORTANT INFORMATION', margin, yPosition);

    yPosition += 10;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    
    const terms = [
      '• Please arrive 30 minutes before the event starts',
      '• Bring a valid ID for verification',
      '• This ticket is non-transferable and non-refundable',
      '• Photography and recording may be restricted',
      '• Follow all venue guidelines and safety protocols'
    ];

    terms.forEach((term, index) => {
      doc.text(term, margin, yPosition + (index * 7));
    });

    // Footer
    yPosition += 50;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);

    yPosition += 10;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Generated on: ' + new Date().toLocaleString(), margin, yPosition);
    doc.text('Event Ticketing System', pageWidth - margin, yPosition, { align: 'right' });

    // Watermark
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');
    doc.text('TICKET', pageWidth / 2, pageHeight / 2, { 
      align: 'center',
      angle: 45
    });

    // Save the PDF
    const fileName = `${event.name.replace(/[^a-zA-Z0-9]/g, '_')}_Ticket_${ticketNumber}.pdf`;
    doc.save(fileName);
    toast.success("Ticket downloaded successfully!");
  };

  const handleCancel = async (eventId) => {
    try {
      await api.delete(`/bookings/${eventId}`);
      toast.success("Booking cancelled successfully!");
      setEvents(events.filter((e) => e._id !== eventId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) > now);
  const pastEvents = events.filter(event => new Date(event.date) <= now);
  const totalSpent = events.reduce((total, event) => total + (event.price || 0), 0);

  const filteredEvents = selectedTab === 'upcoming' ? upcomingEvents : 
                        selectedTab === 'past' ? pastEvents : events;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 rounded-full animate-ping border-t-purple-600 mx-auto mt-2 ml-2"></div>
          </div>
          <p className="text-slate-600 mt-6 text-lg font-medium">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="mt-16"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              My Events
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Manage your booked events, download tickets, and never miss an amazing experience
            </p>
          </div>
        </div>
        
        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 320" className="w-full h-20">
            <path fill="rgb(248, 250, 252)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200/50 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium uppercase tracking-wide mb-2">Total Events</p>
                <p className="text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {events.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200/50 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium uppercase tracking-wide mb-2">Upcoming</p>
                <p className="text-3xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {upcomingEvents.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200/50 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium uppercase tracking-wide mb-2">Completed</p>
                <p className="text-3xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  {pastEvents.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200/50 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium uppercase tracking-wide mb-2">Total Spent</p>
                <p className="text-3xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  ₹{totalSpent.toLocaleString()}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 max-w-md mx-auto">
          <div className="flex space-x-1">
            {[
              { id: 'all', label: 'All Events', count: events.length },
              { id: 'upcoming', label: 'Upcoming', count: upcomingEvents.length },
              { id: 'past', label: 'Past', count: pastEvents.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  selectedTab === tab.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
            {filteredEvents.map((event) => {
              const eventDate = new Date(event.date);
              const isUpcoming = eventDate > now;
              const timeLeft = isUpcoming ? eventDate - now : null;
              const daysLeft = timeLeft ? Math.ceil(timeLeft / (1000 * 60 * 60 * 24)) : null;

              return (
                <div
                  key={event._id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-slate-200/50"
                >
                  {/* Event Image */}
                  <div className="relative h-56 overflow-hidden">
                    {event.image ? (
                      <img
                        src={`http://localhost:5000${event.image.startsWith('/') ? event.image : '/uploads/' + event.image}`}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <svg class="w-16 h-16 text-white opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    )}

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1.5 bg-white/95 backdrop-blur-sm text-slate-900 text-sm font-semibold rounded-full border border-white/20">
                        {event.category || "Event"}
                      </span>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center px-3 py-1.5 text-sm font-bold rounded-full ${
                        event.price 
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      }`}>
                        {event.price ? `₹${event.price.toLocaleString()}` : "Free"}
                      </span>
                    </div>

                    {/* Status Badge */}
                    {isUpcoming && daysLeft && (
                      <div className="absolute bottom-4 left-4">
                        <span className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-full ${
                          daysLeft <= 3 
                            ? 'bg-red-500 text-white shadow-lg animate-pulse' 
                            : 'bg-amber-500 text-white shadow-lg'
                        }`}>
                          {daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days left`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {event.name}
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-slate-600">
                        <div className="w-5 h-5 mr-3 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="font-medium">
                          {eventDate.toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center text-slate-600">
                          <div className="w-5 h-5 mr-3 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className="truncate font-medium">{event.location}</span>
                        </div>
                      )}
                      
                      {event.description && (
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDownloadTicket(event)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Ticket
                      </button>
                      <button
                        onClick={() => handleCancel(event._id)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                {selectedTab === 'upcoming' ? 'No Upcoming Events' : 
                 selectedTab === 'past' ? 'No Past Events' : 'No Events Found'}
              </h3>
              
              <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                {selectedTab === 'upcoming' ? 
                  "You don't have any upcoming events. Explore amazing events happening near you!" :
                  selectedTab === 'past' ? 
                  "You haven't attended any events yet. Start creating memorable experiences!" :
                  "You haven't booked any events yet. Discover incredible events and start your journey!"
                }
              </p>
              
              <button
                onClick={() => window.location.href = '/PublicEvents'}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explore Events
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Feature highlights for empty state */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Digital Tickets</h4>
                <p className="text-slate-600 text-sm">Get instant PDF tickets with QR codes for easy venue entry</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Smart Reminders</h4>
                <p className="text-slate-600 text-sm">Never miss an event with intelligent countdown timers</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Event Analytics</h4>
                <p className="text-slate-600 text-sm">Track your event history and spending insights</p>
              </div>
            </div>
          </div>
        )}
        <div className="fixed bottom-6 right-6 md:hidden">
          <button
            onClick={() => window.location.href = '/PublicEvents'}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center transform hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default MyEvents;