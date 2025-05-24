import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Printer, Calendar, User, MapPin, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { PatientData } from './PatientForm';

const PatientReport = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [reportDate] = useState(new Date());

  useEffect(() => {
    const storedData = localStorage.getItem('patientData');
    if (storedData) {
      const data = JSON.parse(storedData);
      // Convert date strings back to Date objects
      if (data.admitDate) data.admitDate = new Date(data.admitDate);
      if (data.dischargeDate) data.dischargeDate = new Date(data.dischargeDate);
      setPatientData(data);
    } else {
      // If no data found, redirect back to form
      navigate('/');
    }
  }, [navigate]);

  const calculateStayDuration = () => {
    if (patientData?.admitDate && patientData?.dischargeDate) {
      const diffTime = Math.abs(patientData.dischargeDate.getTime() - patientData.admitDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real application, you would generate a PDF here
    alert('Download functionality would be implemented here');
  };

  const getGenderColor = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male': return 'bg-blue-100 text-blue-800';
      case 'female': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDischargeLocationColor = (location: string) => {
    switch (location.toLowerCase()) {
      case 'home': return 'bg-green-100 text-green-800';
      case 'nursing-home': return 'bg-yellow-100 text-yellow-800';
      case 'rehabilitation': return 'bg-blue-100 text-blue-800';
      case 'another-hospital': return 'bg-orange-100 text-orange-800';
      case 'deceased': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">No patient data found</p>
          <Button onClick={() => navigate('/')}>Return to Form</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Form
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
              <Printer size={16} />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
              <Download size={16} />
              Download
            </Button>
          </div>
        </div>

        {/* Report Header */}
        <Card className="mb-6">
          <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-3xl font-bold text-gray-800">
              Patient Medical Report
            </CardTitle>
            <p className="text-gray-600">
              Generated on {format(reportDate, 'MMMM dd, yyyy')} at {format(reportDate, 'HH:mm')}
            </p>
          </CardHeader>
        </Card>

        {/* Patient Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="text-blue-600" size={24} />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash size={16} className="text-gray-500" />
                  <label className="text-sm font-medium text-gray-600">Subject ID</label>
                </div>
                <p className="text-lg font-semibold">{patientData.subjectId}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash size={16} className="text-gray-500" />
                  <label className="text-sm font-medium text-gray-600">Patient ID</label>
                </div>
                <p className="text-lg font-semibold">{patientData.patientId}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-500" />
                  <label className="text-sm font-medium text-gray-600">Patient Name</label>
                </div>
                <p className="text-lg font-semibold">{patientData.patientName}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Age</label>
                <p className="text-lg font-semibold">{patientData.age} years</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <Badge className={getGenderColor(patientData.gender)}>
                  {patientData.gender.charAt(0).toUpperCase() + patientData.gender.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hospital Stay Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="text-green-600" size={24} />
              Hospital Stay Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Admission Date</label>
                <p className="text-lg font-semibold">
                  {patientData.admitDate ? format(patientData.admitDate, 'dd/MM/yyyy') : 'N/A'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Discharge Date</label>
                <p className="text-lg font-semibold">
                  {patientData.dischargeDate ? format(patientData.dischargeDate, 'dd/MM/yyyy') : 'N/A'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Length of Stay</label>
                <p className="text-lg font-semibold">
                  {calculateStayDuration()} {calculateStayDuration() === 1 ? 'day' : 'days'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  <label className="text-sm font-medium text-gray-600">Discharge Location</label>
                </div>
                <Badge className={getDischargeLocationColor(patientData.dischargeLocation)}>
                  {patientData.dischargeLocation.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Report Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Age Category</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {Number(patientData.age) < 18 ? 'Pediatric' : 
                   Number(patientData.age) < 65 ? 'Adult' : 'Senior'}
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Stay Duration</h3>
                <p className="text-2xl font-bold text-green-600">
                  {calculateStayDuration() < 3 ? 'Short' : 
                   calculateStayDuration() < 7 ? 'Moderate' : 'Extended'}
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Discharge Status</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {patientData.dischargeLocation === 'home' ? 'Successful' : 
                   patientData.dischargeLocation === 'deceased' ? 'Critical' : 'Transfer'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <Separator className="mb-4" />
          <p>This report was automatically generated from the patient information form.</p>
          <p>Report ID: RPT-{patientData.patientId}-{format(reportDate, 'yyyyMMdd-HHmm')}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientReport;
