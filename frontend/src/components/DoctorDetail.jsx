import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Calendar, 
  Clock, 
  Award, 
  BookOpen,
  MessageSquare,
  Video,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const schedule = [
  { day: 'Monday', hours: '09:00 AM - 05:00 PM', status: 'Available' },
  { day: 'Tuesday', hours: '09:00 AM - 05:00 PM', status: 'Available' },
  { day: 'Wednesday', hours: '09:00 AM - 01:00 PM', status: 'Morning Only' },
  { day: 'Thursday', hours: '09:00 AM - 05:00 PM', status: 'Available' },
  { day: 'Friday', hours: '09:00 AM - 05:00 PM', status: 'Available' },
];

const reviews = [
  { user: 'Alice M.', rating: 5, date: '2 days ago', comment: 'Dr. Jenkins was extremely thorough and took the time to explain everything clearly.' },
  { user: 'James K.', rating: 4, date: '1 week ago', comment: 'Great bedside manner. The wait time was a bit long but the care was excellent.' },
];

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock doctor data
  const doctor = {
    id: id || 'DOC-001',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Senior Cardiologist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=300&h=300',
    rating: 4.9,
    reviews: 128,
    experience: '12 years',
    education: 'Harvard Medical School',
    bio: 'Dr. Sarah Jenkins is a board-certified cardiologist with over 12 years of experience in treating complex cardiovascular conditions. She specializes in non-invasive cardiology and preventive heart care.',
    email: 's.jenkins@sanctuary.health',
    phone: '+1 (555) 987-6543',
    location: 'Building A, Floor 3, Room 302',
    status: 'Active'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate('/doctors')}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Directory</span>
        </button>
        
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-6">
            <img 
              src={doctor.image} 
              alt={doctor.name} 
              className="w-24 h-24 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold font-headline text-blue-900 dark:text-blue-400">{doctor.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={10} /> {doctor.status}
                </span>
              </div>
              <p className="text-lg font-bold text-primary mb-2">{doctor.specialty}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold">{doctor.rating}</span>
                  <span className="text-slate-400">({doctor.reviews} reviews)</span>
                </div>
                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                <span>{doctor.experience} experience</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
              <MessageSquare size={20} />
            </button>
            <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
              <Video size={20} />
            </button>
            <button className="bg-primary text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95">
              <Calendar size={18} />
              <span className="text-sm">Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold font-headline mb-4 text-slate-900 dark:text-slate-100">About</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">{doctor.bio}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Education</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{doctor.education}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary shrink-0">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Specialization</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Cardiovascular Disease, Heart Failure</p>
                </div>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold font-headline text-slate-900 dark:text-slate-100">Patient Reviews</h2>
              <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Write a Review</button>
            </div>
            <div className="space-y-6">
              {reviews.map((review, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
                        {review.user[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{review.user}</p>
                        <p className="text-[10px] text-slate-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={12} fill={j < review.rating ? "currentColor" : "none"} className={j < review.rating ? "" : "text-slate-200 dark:text-slate-700"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{review.comment}</p>
                  {i < reviews.length - 1 && <div className="h-px bg-slate-50 dark:bg-slate-800 pt-6"></div>}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Contact Info */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold font-headline mb-6 text-slate-900 dark:text-slate-100">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400"><Mail size={16} /></div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{doctor.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400"><Phone size={16} /></div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{doctor.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400"><MapPin size={16} /></div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{doctor.location}</p>
              </div>
            </div>
          </section>

          {/* Availability */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold font-headline mb-6 text-slate-900 dark:text-slate-100">Working Hours</h3>
            <div className="space-y-3">
              {schedule.map((item) => (
                <div key={item.day} className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.day}</span>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-900 dark:text-slate-100">{item.hours}</p>
                    <p className={cn(
                      "text-[8px] font-bold uppercase tracking-widest",
                      item.status === 'Available' ? 'text-emerald-500' : 'text-amber-500'
                    )}>{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-900 p-4 rounded-2xl text-white">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Patients</p>
              <p className="text-xl font-extrabold">1.2k+</p>
            </div>
            <div className="bg-primary p-4 rounded-2xl text-white">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Success</p>
              <p className="text-xl font-extrabold">98%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
