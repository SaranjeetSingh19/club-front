import { useState } from 'react';
import "./App.css";

function App() {
  // State for form data
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    college: '',
    yearOfStudy: '',
    branch: '',
    cgpa: '',
    alternateContact: '',
    
    // Position Application
    position: '',
    openToOtherPositions: '',
    whyJoin: '',
    uniqueSkills: '',
    
    // Technical Background
    programmingLanguages: [],
    hardwareExperience: [],
    softwareTools: [],
    areasOfInterest: [],
    skillLevel: '',
    
    // Project Experience
    technicalProjects: '',
    competitions: '',
    
    // Commitment & Availability
    timeCommitment: '',
    weekendAvailability: '',
    yearCommitment: '',
    
    // Motivation & Goals
    learnAchieve: '',
    teamContribution: '',
    problemSolving: '',
    
    // Additional Information
    questions: '',
    additionalInfo: '',
    hearAbout: '',
    
    // Declaration
    declaration1: false,
    declaration2: false,
  });

  // State for form submission
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle array checkboxes (programming languages, hardware, etc.)
      if (['programmingLanguages', 'hardwareExperience', 'softwareTools', 'areasOfInterest'].includes(name)) {
        if (checked) {
          setFormData(prev => ({
            ...prev,
            [name]: [...prev[name], value]
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            [name]: prev[name].filter(item => item !== value)
          }));
        }
      } 
      // Handle boolean checkboxes (declaration)
      else if (name === 'declaration1' || name === 'declaration2') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else if (type === 'radio' || type === 'select-one') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = [
      'fullName', 'email', 'phone', 'college', 'yearOfStudy', 'branch',
      'position', 'openToOtherPositions', 'whyJoin', 'uniqueSkills',
      'skillLevel', 'technicalProjects', 'competitions',
      'timeCommitment', 'weekendAvailability', 'yearCommitment',
      'learnAchieve', 'teamContribution', 'problemSolving', 'hearAbout'
    ];

    requiredFields.forEach(field => {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        newErrors[field] = 'This field is required';
      }
    });

    // Areas of interest validation
    if (formData.areasOfInterest.length === 0) {
      newErrors.areasOfInterest = 'Please select at least one area of interest';
    }

    // Declaration validation
    if (!formData.declaration1) {
      newErrors.declaration1 = 'You must confirm the accuracy of your information';
    }
    
    if (!formData.declaration2) {
      newErrors.declaration2 = 'You must commit to active participation';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus({ type: 'error', message: 'Please fix the errors in the form' });
      return;
    }

    setLoading(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://club-back.onrender.com/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Application submitted successfully!',
          applicationId: data.applicationId 
        });
        // Reset form on successful submission
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          college: '',
          yearOfStudy: '',
          branch: '',
          cgpa: '',
          alternateContact: '',
          position: '',
          openToOtherPositions: '',
          whyJoin: '',
          uniqueSkills: '',
          programmingLanguages: [],
          hardwareExperience: [],
          softwareTools: [],
          areasOfInterest: [],
          skillLevel: '',
          technicalProjects: '',
          competitions: '',
          timeCommitment: '',
          weekendAvailability: '',
          yearCommitment: '',
          learnAchieve: '',
          teamContribution: '',
          problemSolving: '',
          questions: '',
          additionalInfo: '',
          hearAbout: '',
          declaration1: false,
          declaration2: false,
        });
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: data.message || 'Failed to submit application' 
        });
        if (data.missingFields) {
          setErrors(prev => {
            const newErrors = { ...prev };
            data.missingFields.forEach(field => {
              newErrors[field] = 'This field is required';
            });
            return newErrors;
          });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-200 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Electrosapean Club</h1>
          <p className="mt-2 text-blue-100">Member Recruitment Application 2025</p>
          <p className="mt-4">
            Where Electronics & Communication Engineering meets Robotics and AI innovation!
          </p>
        </div>

        {/* Status Message */}
        {submitStatus && (
          <div className={`p-4 mx-6 mt-6 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {submitStatus.message}
            {submitStatus.applicationId && (
              <div className="mt-2">
                Your application ID: <strong>{submitStatus.applicationId}</strong>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-gray-300 dark:border-gray-600 pb-2">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">College/University *</label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                    errors.college ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.college && <p className="text-red-500 text-xs mt-1">{errors.college}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Year of Study *</label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                    errors.yearOfStudy ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
                {errors.yearOfStudy && <p className="text-red-500 text-xs mt-1">{errors.yearOfStudy}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Branch/Department *</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                    errors.branch ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Current CGPA/Percentage</label>
                <input
                  type="text"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Alternative Contact</label>
                <input
                  type="text"
                  name="alternateContact"
                  value={formData.alternateContact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Position Application Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-gray-300 dark:border-gray-600 pb-2">
              Position Application
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Which position are you most interested in? *
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                    errors.position ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select Position</option>
                  <option value="President/Vice President">President/Vice President</option>
                  <option value="Overall Coordinator">Overall Coordinator</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Core Member">Core Member</option>
                </select>
                {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Are you open to other positions if your first choice isn't available? *
                </label>
                <select
                  name="openToOtherPositions"
                  value={formData.openToOtherPositions}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                    errors.openToOtherPositions ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.openToOtherPositions && <p className="text-red-500 text-xs mt-1">{errors.openToOtherPositions}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Why do you want to join Electrosapean Club? *
              </label>
              <textarea
                name="whyJoin"
                value={formData.whyJoin}
                onChange={handleInputChange}
                rows={4}
                maxLength={500}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                    errors.whyJoin ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                placeholder="Share your motivation for joining the club (max 500 characters)"
              ></textarea>
              <div className="flex justify-between">
                {errors.whyJoin && <p className="text-red-500 text-xs mt-1">{errors.whyJoin}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                  {formData.whyJoin.length}/500
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                What unique skills/perspective do you bring? *
              </label>
              <textarea
                name="uniqueSkills"
                value={formData.uniqueSkills}
                onChange={handleInputChange}
                rows={4}
                maxLength={500}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                    errors.uniqueSkills ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                placeholder="Describe your unique skills and perspective (max 500 characters)"
              ></textarea>
              <div className="flex justify-between">
                {errors.uniqueSkills && <p className="text-red-500 text-xs mt-1">{errors.uniqueSkills}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                  {formData.uniqueSkills.length}/500
                </p>
              </div>
            </div>
          </div>

          {/* Technical Background Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-gray-300 dark:border-gray-600 pb-2">
              Technical Background
            </h2>
            
            <div>
              <label className="block text-sm font-medium mb-3">Programming Languages Known</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Python', 'C++', 'Java', 'MATLAB', 'JavaScript', 'R', 'Assembly', 'Other'].map(lang => (
                  <label key={lang} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="programmingLanguages"
                      value={lang}
                      checked={formData.programmingLanguages.includes(lang)}
                      onChange={handleInputChange}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{lang}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Hardware Experience</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Arduino', 'Raspberry Pi', 'PCB Design', 'Microcontrollers', 'Sensors', 'FPGA', 'DSP', 'Other'].map(hw => (
                  <label key={hw} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="hardwareExperience"
                      value={hw}
                      checked={formData.hardwareExperience.includes(hw)}
                      onChange={handleInputChange}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{hw}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Software Tools</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['AutoCAD', 'SolidWorks', 'Proteus', 'KiCAD', 'ROS', 'TensorFlow', 'OpenCV', 'Other'].map(sw => (
                  <label key={sw} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="softwareTools"
                      value={sw}
                      checked={formData.softwareTools.includes(sw)}
                      onChange={handleInputChange}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{sw}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Areas of Interest *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Robotics', 'AI/ML', 'IoT', 'Embedded Systems', 'Signal Processing', 'Communication Systems', 'Computer Vision', 'Other'].map(area => (
                  <label key={area} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="areasOfInterest"
                      value={area}
                      checked={formData.areasOfInterest.includes(area)}
                      onChange={handleInputChange}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{area}</span>
                  </label>
                ))}
              </div>
              {errors.areasOfInterest && <p className="text-red-500 text-xs mt-1">{errors.areasOfInterest}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Rate your technical skill level *</label>
              <select
                name="skillLevel"
                value={formData.skillLevel}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                  errors.skillLevel ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Select Skill Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {errors.skillLevel && <p className="text-red-500 text-xs mt-1">{errors.skillLevel}</p>}
            </div>
          </div>

          {/* Project Experience Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-gray-300 dark:border-gray-600 pb-2">
              Project Experience
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Have you worked on any technical projects? *
                </label>
                <div className="flex space-x-4">
                  {['Yes', 'No'].map(option => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="technicalProjects"
                        value={option}
                        checked={formData.technicalProjects === option}
                        onChange={handleInputChange}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {errors.technicalProjects && <p className="text-red-500 text-xs mt-1">{errors.technicalProjects}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Have you participated in any competitions/hackathons? *
                </label>
                <div className="flex space-x-4">
                  {['Yes', 'No'].map(option => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="competitions"
                        value={option}
                        checked={formData.competitions === option}
                        onChange={handleInputChange}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {errors.competitions && <p className="text-red-500 text-xs mt-1">{errors.competitions}</p>}
              </div>
            </div>
          </div>

          {/* Commitment & Availability Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-gray-300 dark:border-gray-600 pb-2">
              Commitment & Availability
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  How many hours per week can you dedicate to club activities? *
                </label>
                <select
                  name="timeCommitment"
                  value={formData.timeCommitment}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                    errors.timeCommitment ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select Time Commitment</option>
                  <option value="2-4 hours/week">2-4 hours/week</option>
                  <option value="5-8 hours/week">5-8 hours/week</option>
                  <option value="9-12 hours/week">9-12 hours/week</option>
                  <option value="12+ hours/week">12+ hours/week</option>
                </select>
                {errors.timeCommitment && <p className="text-red-500 text-xs mt-1">{errors.timeCommitment}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Are you available for weekend workshops/events? *
                </label>
                <select
                  name="weekendAvailability"
                  value={formData.weekendAvailability}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                    errors.weekendAvailability ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Sometimes">Sometimes</option>
                </select>
                {errors.weekendAvailability && <p className="text-red-500 text-xs mt-1">{errors.weekendAvailability}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Can you commit for the entire academic year? *
                </label>
                <select
                  name="yearCommitment"
                  value={formData.yearCommitment}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                    errors.yearCommitment ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.yearCommitment && <p className="text-red-500 text-xs mt-1">{errors.yearCommitment}</p>}
              </div>
            </div>
          </div>

          {/* Motivation & Goals Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-gray-300 dark:border-gray-600 pb-2">
              Motivation & Goals
            </h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                What do you hope to learn/achieve through this club? *
              </label>
              <textarea
                name="learnAchieve"
                value={formData.learnAchieve}
                onChange={handleInputChange}
                rows={4}
                maxLength={500}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                  errors.learnAchieve ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Share your goals and what you hope to achieve (max 500 characters)"
              ></textarea>
              <div className="flex justify-between">
                {errors.learnAchieve && <p className="text-red-500 text-xs mt-1">{errors.learnAchieve}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                  {formData.learnAchieve.length}/500
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                How do you see yourself contributing to team projects? *
              </label>
              <textarea
                name="teamContribution"
                value={formData.teamContribution}
                onChange={handleInputChange}
                rows={4}
                maxLength={500}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                  errors.teamContribution ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Describe how you can contribute to team projects (max 500 characters)"
              ></textarea>
              <div className="flex justify-between">
                {errors.teamContribution && <p className="text-red-500 text-xs mt-1">{errors.teamContribution}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                  {formData.teamContribution.length}/500
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Describe a time when you solved a technical problem creatively *
              </label>
              <textarea
                name="problemSolving"
                value={formData.problemSolving}
                onChange={handleInputChange}
                rows={4}
                maxLength={500}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                  errors.problemSolving ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Share an example of creative problem solving (max 500 characters)"
              ></textarea>
              <div className="flex justify-between">
                {errors.problemSolving && <p className="text-red-500 text-xs mt-1">{errors.problemSolving}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                  {formData.problemSolving.length}/500
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-gray-300 dark:border-gray-600 pb-2">
              Additional Information
            </h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Do you have any questions about the club or positions?
              </label>
              <textarea
                name="questions"
                value={formData.questions}
                onChange={handleInputChange}
                rows={3}
                maxLength={300}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600"
                placeholder="Any questions you'd like to ask (max 300 characters)"
              ></textarea>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                {formData.questions.length}/300
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Is there anything else you'd like us to know?
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={3}
                maxLength={300}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600"
                placeholder="Any additional information you want to share (max 300 characters)"
              ></textarea>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                {formData.additionalInfo.length}/300
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                How did you hear about our club? *
              </label>
              <select
                name="hearAbout"
                value={formData.hearAbout}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 ${
                  errors.hearAbout ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Select Option</option>
                <option value="Friends">Friends</option>
                <option value="Social Media">Social Media</option>
                <option value="Poster">Poster</option>
                <option value="Faculty">Faculty</option>
                <option value="Website">Website</option>
                <option value="College Notice Board">College Notice Board</option>
                <option value="Other">Other</option>
                </select>
                {errors.hearAbout && <p className="text-red-500 text-xs mt-1">{errors.hearAbout}</p>}
            </div>
          </div>

          {/* Declaration Section */}
          <div className="space-y-4 p-4 bg-gray-100 dark:bg-gray-600 rounded-lg">
            <h2 className="text-xl font-semibold">Declaration</h2>
            
            <div className="space-y-3">
              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  name="declaration1"
                  checked={formData.declaration1}
                  onChange={handleInputChange}
                  className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>I confirm that all information provided is accurate and complete *</span>
              </label>
              {errors.declaration1 && <p className="text-red-500 text-xs mt-1">{errors.declaration1}</p>}
              
              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  name="declaration2"
                  checked={formData.declaration2}
                  onChange={handleInputChange}
                  className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>I understand the commitment required and am willing to actively participate *</span>
              </label>
              {errors.declaration2 && <p className="text-red-500 text-xs mt-1">{errors.declaration2}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 text-white font-medium rounded-lg shadow-md transition-colors duration-300 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;