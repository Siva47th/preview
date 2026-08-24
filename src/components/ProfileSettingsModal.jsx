import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Key,
  Lock,
  CheckCircle2,
  X,
  Camera,
  Briefcase,
  IndianRupee,
  Layers,
  Save,
  Upload,
  Crop,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ImageAdjusterModal } from './ImageAdjusterModal';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=85'
];

export const ProfileSettingsModal = ({ isOpen, onClose }) => {
  const { currentUser, updateUser, servicesCatalog } = useApp();

  const subRoleLayers = [...new Set(servicesCatalog.flatMap(s => s.layers))];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [subRole, setSubRole] = useState('Frontend');
  const [hourlyRate, setHourlyRate] = useState(10500);
  const [avatar, setAvatar] = useState('');
  const [showCustomAvatarInput, setShowCustomAvatarInput] = useState(false);
  const [showAdjusterModal, setShowAdjusterModal] = useState(false);
  const [adjustingImageSrc, setAdjustingImageSrc] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (currentUser && isOpen) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setTitle(currentUser.title || '');
      setSubRole(currentUser.subRole || 'Frontend');
      setHourlyRate(currentUser.hourlyRate || 10500);
      setAvatar(currentUser.avatar || '');
      setShowCustomAvatarInput(false);
      setNewPassword('');
      setConfirmPassword('');
      setStatusMessage(null);
    }
  }, [currentUser, isOpen]);

  const avatarFileInputRef = useRef(null);

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: 'Please select a valid image file (.jpg, .png, .webp).' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAdjustingImageSrc(event.target.result);
        setShowAdjusterModal(true);
        if (avatarFileInputRef.current) avatarFileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAdjustedAvatar = (croppedDataUrl) => {
    setAvatar(croppedDataUrl);
    setShowAdjusterModal(false);
    setStatusMessage({ type: 'success', text: 'Ultra-HD photo cropped! Click "Save Custom Profile" to apply.' });
  };

  if (!isOpen || !currentUser) return null;

  const isAdmin = currentUser?.role === 'admin';

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New passwords do not match. Please verify.' });
      return;
    }

    const updatedFields = {
      name,
      email,
      title,
      subRole,
      hourlyRate: isAdmin ? Number(hourlyRate) : (currentUser.hourlyRate || 10500),
      avatar
    };

    if (newPassword) {
      updatedFields.password = newPassword;
      updatedFields.password_hash = newPassword;
    }

    updateUser(currentUser.id, updatedFields);
    setStatusMessage({ type: 'success', text: 'Profile & credentials updated and saved successfully!' });

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col my-6">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Custom Profile & Identity
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono font-semibold uppercase">
                  {currentUser.role === 'admin' ? 'Agency Admin' : `${currentUser.subRole || 'Developer'}`}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Adjust your profile picture, job title, layer specialization, and credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[82vh]">
          
          {/* Status Alert Banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between animate-fade-in ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            </div>
          )}

          {/* Optimized Profile Picture Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Profile Avatar & Appearance</span>
              </label>
              <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-bold">
                Ultra-HD 800px
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              
              {/* Large Crisp Avatar Preview */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-600 shadow-md bg-slate-950 flex items-center justify-center">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAdjustingImageSrc(avatar);
                    setShowAdjusterModal(true);
                  }}
                  className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                  title="Click to Crop & Re-frame"
                >
                  <Crop className="w-5 h-5 text-indigo-400" />
                  <span className="text-[9px] font-bold mt-0.5">Crop/Zoom</span>
                </button>
              </div>

              {/* Action Buttons & Presets */}
              <div className="space-y-2.5 flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={avatarFileInputRef}
                    onChange={handleAvatarFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="px-3 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shrink-0 flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdjustingImageSrc(avatar);
                      setShowAdjusterModal(true);
                    }}
                    className="px-3 py-2 text-xs bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 shrink-0 flex items-center gap-1.5 shadow-sm transition"
                    title="Crop, zoom or reposition current photo"
                  >
                    <Crop className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Adjust & Crop</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCustomAvatarInput(!showCustomAvatarInput)}
                    className="px-2.5 py-2 text-xs bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-300 shrink-0 flex items-center gap-1 transition"
                  >
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    <span>URL</span>
                  </button>
                </div>

                {/* Preset Avatars Row */}
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  <span className="text-[10px] text-slate-400 font-semibold shrink-0 uppercase tracking-wider">Presets:</span>
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(url)}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 transition shrink-0 ${
                        avatar === url ? 'border-indigo-600 ring-2 ring-indigo-600/30' : 'border-slate-300 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {showCustomAvatarInput && (
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/your-photo.jpg"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:border-indigo-600"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sivasankaran E"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sivasankaranelu2006@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Job Title & Sub-Role Layer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Professional Job Title</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. QA & Testing Engineer"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Sub-Role Layer Assignment</label>
              <div className="relative">
                <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={subRole}
                  onChange={(e) => setSubRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                >
                  {subRoleLayers.map(sr => (
                    <option key={sr} value={sr}>{sr}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Hourly Rate */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-900">Hourly Compensation Rate (₹/hr)</label>
              {!isAdmin && (
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" /> Admin Managed Only
                </span>
              )}
            </div>
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="number"
                disabled={!isAdmin}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="10500"
                className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs font-mono font-bold transition ${
                  isAdmin
                    ? 'bg-slate-50 border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white'
                    : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed select-none'
                }`}
              />
            </div>
            {!isAdmin && (
              <p className="text-[10px] text-slate-400 mt-1">
                Your hourly compensation rate is locked and can only be modified by the Agency Manager (Krishna Hari I).
              </p>
            )}
          </div>

          {/* Security Credentials / Change Password */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" /> Change Password (Optional)
              </h4>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide Password' : 'Show Password'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Custom Profile</span>
            </button>
          </div>

        </form>

      </div>

      {/* Interactive Photo Cropper & Adjuster Modal */}
      <ImageAdjusterModal
        imageSrc={adjustingImageSrc}
        isOpen={showAdjusterModal}
        onCancel={() => {
          setShowAdjusterModal(false);
          setAdjustingImageSrc(null);
        }}
        onSave={handleSaveAdjustedAvatar}
      />
    </div>
  );
};

export default ProfileSettingsModal;
