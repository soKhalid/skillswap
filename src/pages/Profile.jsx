import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { FiEdit2, FiPlus, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { SKILL_CATEGORIES, PROFICIENCY_LEVELS } from '../utils/constants';
import { getUserBadge } from '../utils/helpers';

const Profile = () => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    university: '',
    photoURL: ''
  });
  const [newSkillOffered, setNewSkillOffered] = useState({ name: '', category: '', proficiency: '' });
  const [newSkillWanted, setNewSkillWanted] = useState({ name: '', category: '' });
  const [showAddSkillOffered, setShowAddSkillOffered] = useState(false);
  const [showAddSkillWanted, setShowAddSkillWanted] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        bio: userProfile.bio || '',
        university: userProfile.university || '',
        photoURL: userProfile.photoURL || ''
      });
    }
  }, [userProfile]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `profiles/${currentUser.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData({ ...formData, photoURL: url });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(currentUser.uid, formData);
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleAddSkillOffered = async () => {
    if (!newSkillOffered.name || !newSkillOffered.category || !newSkillOffered.proficiency) {
      return;
    }

    const updatedSkills = [...(userProfile.skillsOffered || []), newSkillOffered];
    await updateUserProfile(currentUser.uid, { skillsOffered: updatedSkills });
    setNewSkillOffered({ name: '', category: '', proficiency: '' });
    setShowAddSkillOffered(false);
  };

  const handleRemoveSkillOffered = async (index) => {
    const updatedSkills = userProfile.skillsOffered.filter((_, i) => i !== index);
    await updateUserProfile(currentUser.uid, { skillsOffered: updatedSkills });
  };

  const handleAddSkillWanted = async () => {
    if (!newSkillWanted.name || !newSkillWanted.category) {
      return;
    }

    const updatedSkills = [...(userProfile.skillsWanted || []), newSkillWanted];
    await updateUserProfile(currentUser.uid, { skillsWanted: updatedSkills });
    setNewSkillWanted({ name: '', category: '' });
    setShowAddSkillWanted(false);
  };

  const handleRemoveSkillWanted = async (index) => {
    const updatedSkills = userProfile.skillsWanted.filter((_, i) => i !== index);
    await updateUserProfile(currentUser.uid, { skillsWanted: updatedSkills });
  };

  const badge = getUserBadge(userProfile?.sessionsTeaching || 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Profile Picture */}
          <div className="relative">
            {formData.photoURL ? (
              <img
                src={formData.photoURL}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary-500 flex items-center justify-center text-white text-4xl font-bold">
                {formData.displayName?.charAt(0) || 'U'}
              </div>
            )}
            {editing && (
              <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700">
                <FiEdit2 size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
            {badge && (
              <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg" title={badge.name}>
                <span className="text-2xl">{badge.icon}</span>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            {editing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="input-field"
                  placeholder="Your Name"
                />
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="input-field"
                  placeholder="University/Affiliation"
                />
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-2">{formData.displayName}</h1>
                {formData.university && (
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{formData.university}</p>
                )}
                <p className="text-gray-700 dark:text-gray-300 mb-4">{formData.bio || 'No bio yet'}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 dark:text-gray-400">Skill Points:</span>
                    <span className="font-bold text-accent-600 dark:text-accent-400">{userProfile?.skillPoints || 0} SP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                    <span className="font-bold text-yellow-600">
                      {userProfile?.totalRatings > 0
                        ? (userProfile.rating / userProfile.totalRatings).toFixed(1)
                        : 'N/A'} ⭐
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 dark:text-gray-400">Sessions:</span>
                    <span className="font-bold">{userProfile?.sessionsCompleted || 0}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Edit Button */}
          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
                  <FiSave size={16} />
                  <span>Save</span>
                </button>
                <button onClick={() => setEditing(false)} className="btn-secondary flex items-center space-x-2">
                  <FiX size={16} />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-primary flex items-center space-x-2">
                <FiEdit2 size={16} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Skills I Can Teach */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Skills I Can Teach</h2>
          <button
            onClick={() => setShowAddSkillOffered(!showAddSkillOffered)}
            className="btn-primary flex items-center space-x-2"
          >
            <FiPlus size={16} />
            <span>Add Skill</span>
          </button>
        </div>

        {showAddSkillOffered && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
            <input
              type="text"
              value={newSkillOffered.name}
              onChange={(e) => setNewSkillOffered({ ...newSkillOffered, name: e.target.value })}
              className="input-field"
              placeholder="Skill name (e.g., Python Programming)"
            />
            <select
              value={newSkillOffered.category}
              onChange={(e) => setNewSkillOffered({ ...newSkillOffered, category: e.target.value })}
              className="input-field"
            >
              <option value="">Select Category</option>
              {SKILL_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            <select
              value={newSkillOffered.proficiency}
              onChange={(e) => setNewSkillOffered({ ...newSkillOffered, proficiency: e.target.value })}
              className="input-field"
            >
              <option value="">Select Proficiency</option>
              {PROFICIENCY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            <button onClick={handleAddSkillOffered} className="btn-accent w-full">
              Add Skill
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-3">
          {userProfile?.skillsOffered?.length > 0 ? (
            userProfile.skillsOffered.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div>
                  <div className="font-semibold">{skill.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {SKILL_CATEGORIES.find(c => c.value === skill.category)?.label} • {skill.proficiency}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSkillOffered(index)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-2">No skills added yet. Add skills you can teach!</p>
          )}
        </div>
      </div>

      {/* Skills I Want to Learn */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Skills I Want to Learn</h2>
          <button
            onClick={() => setShowAddSkillWanted(!showAddSkillWanted)}
            className="btn-primary flex items-center space-x-2"
          >
            <FiPlus size={16} />
            <span>Add Skill</span>
          </button>
        </div>

        {showAddSkillWanted && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
            <input
              type="text"
              value={newSkillWanted.name}
              onChange={(e) => setNewSkillWanted({ ...newSkillWanted, name: e.target.value })}
              className="input-field"
              placeholder="Skill name (e.g., Guitar Playing)"
            />
            <select
              value={newSkillWanted.category}
              onChange={(e) => setNewSkillWanted({ ...newSkillWanted, category: e.target.value })}
              className="input-field"
            >
              <option value="">Select Category</option>
              {SKILL_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            <button onClick={handleAddSkillWanted} className="btn-accent w-full">
              Add Skill
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-3">
          {userProfile?.skillsWanted?.length > 0 ? (
            userProfile.skillsWanted.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
                <div>
                  <div className="font-semibold">{skill.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {SKILL_CATEGORIES.find(c => c.value === skill.category)?.label}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSkillWanted(index)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-2">No skills added yet. Add skills you want to learn!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
