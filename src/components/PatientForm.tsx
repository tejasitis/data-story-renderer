
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export interface PatientData {
  subjectId: string;
  patientId: string;
  patientName: string;
  age: string;
  gender: string;
  admitDate: Date | undefined;
  dischargeDate: Date | undefined;
  dischargeLocation: string;
}

const PatientForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PatientData>({
    subjectId: '',
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    admitDate: undefined,
    dischargeDate: undefined,
    dischargeLocation: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subjectId) newErrors.subjectId = 'Subject ID is required';
    if (!formData.patientId) newErrors.patientId = 'Patient ID is required';
    if (!formData.patientName) newErrors.patientName = 'Patient name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.admitDate) newErrors.admitDate = 'Admit date is required';
    if (!formData.dischargeDate) newErrors.dischargeDate = 'Discharge date is required';
    if (!formData.dischargeLocation) newErrors.dischargeLocation = 'Discharge location is required';

    if (formData.age && (isNaN(Number(formData.age)) || Number(formData.age) < 0 || Number(formData.age) > 150)) {
      newErrors.age = 'Please enter a valid age';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Store form data in localStorage for the report page
      localStorage.setItem('patientData', JSON.stringify(formData));
      
      toast({
        title: "Form submitted successfully",
        description: "Redirecting to report page...",
      });
      
      // Navigate to report page
      navigate('/report');
    } else {
      toast({
        title: "Please correct the errors",
        description: "Fill in all required fields correctly.",
        variant: "destructive"
      });
    }
  };

  const updateFormData = (field: keyof PatientData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Patient Information Form
            </CardTitle>
            <p className="text-center text-gray-600">Please fill in all required fields</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subject ID and Patient ID Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="subjectId">Subject ID</Label>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">numeric</span>
                  </div>
                  <Input
                    id="subjectId"
                    placeholder="Enter subject ID"
                    value={formData.subjectId}
                    onChange={(e) => updateFormData('subjectId', e.target.value)}
                    className={errors.subjectId ? 'border-red-500' : ''}
                  />
                  {errors.subjectId && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle size={14} />
                      {errors.subjectId}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Unique identifier for the patient</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">numeric</span>
                  </div>
                  <Input
                    id="patientId"
                    placeholder="Enter patient ID"
                    value={formData.patientId}
                    onChange={(e) => updateFormData('patientId', e.target.value)}
                    className={errors.patientId ? 'border-red-500' : ''}
                  />
                  {errors.patientId && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle size={14} />
                      {errors.patientId}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Unique identifier for the patient</p>
                </div>
              </div>

              {/* Patient Name, Age, Gender Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">string</span>
                  </div>
                  <Input
                    id="patientName"
                    placeholder="Enter patient name"
                    value={formData.patientName}
                    onChange={(e) => updateFormData('patientName', e.target.value)}
                    className={errors.patientName ? 'border-red-500' : ''}
                  />
                  {errors.patientName && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle size={14} />
                      {errors.patientName}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Full name of the patient for identification</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="age">Age (years)</Label>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Numeric</span>
                  </div>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter patient age"
                    value={formData.age}
                    onChange={(e) => updateFormData('age', e.target.value)}
                    className={errors.age ? 'border-red-500' : ''}
                  />
                  {errors.age && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle size={14} />
                      {errors.age}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Age is a significant risk factor for cardiovascular disease</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">String</span>
                  </div>
                  <Select onValueChange={(value) => updateFormData('gender', value)}>
                    <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle size={14} />
                      {errors.gender}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Gender affects cardiovascular risk patterns</p>
                </div>
              </div>

              {/* Admit Date and Discharge Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Admit Date</Label>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Required</span>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.admitDate && "text-muted-foreground",
                          errors.admitDate && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.admitDate ? format(formData.admitDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.admitDate}
                        onSelect={(date) => updateFormData('admitDate', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.admitDate && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle size={14} />
                      {errors.admitDate}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Enter the date of hospital admission</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Discharge Date</Label>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Required</span>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dischargeDate && "text-muted-foreground",
                          errors.dischargeDate && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dischargeDate ? format(formData.dischargeDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.dischargeDate}
                        onSelect={(date) => updateFormData('dischargeDate', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.dischargeDate && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle size={14} />
                      {errors.dischargeDate}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Enter the date of hospital discharge</p>
                </div>
              </div>

              {/* Discharge Location */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Discharge Location</Label>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Required</span>
                </div>
                <Select onValueChange={(value) => updateFormData('dischargeLocation', value)}>
                  <SelectTrigger className={errors.dischargeLocation ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select the relevant discharge location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="nursing-home">Nursing Home</SelectItem>
                    <SelectItem value="rehabilitation">Rehabilitation Center</SelectItem>
                    <SelectItem value="another-hospital">Another Hospital</SelectItem>
                    <SelectItem value="deceased">Deceased</SelectItem>
                  </SelectContent>
                </Select>
                {errors.dischargeLocation && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle size={14} />
                    {errors.dischargeLocation}
                  </div>
                )}
                <p className="text-sm text-gray-500">Blood sugar level after 8+ hours of fasting</p>
              </div>

              <div className="flex justify-center pt-6">
                <Button type="submit" className="w-full md:w-auto px-8 py-3 text-lg">
                  Generate Report
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientForm;
