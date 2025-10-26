'use client';

import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/useToast';
import { Toast, ToastProvider, ToastViewport } from '@/components/ui/toast';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    avatar_path?: string;
  };
}

interface AccountEditFormProps {
  user: User;
  labels: {
    editProfile: string;
    personalInfo: string;
    fullName: string;
    email: string;
    avatar: string;
    changeAvatar: string;
    removeAvatar: string;
    saving: string;
    confirm: string;
    cancel: string;
    profileUpdated: string;
    errorUpdatingProfile: string;
    uploading: string;
    uploadError: string;
  };
}

export function AccountEditForm({ user, labels }: AccountEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    fullName: user.user_metadata?.full_name || '',
    email: user.email || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createSupabaseBrowserClient();
  const { toast, showToast, hideToast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = async (field: string) => {
    if (field === 'fullName') {
      await saveFullName();
    }
  };

  const saveFullName = async () => {
    if (formData.fullName === (user.user_metadata?.full_name || '')) {
      return; // No changes
    }

    setIsSaving(true);
    setErrors({});

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: formData.fullName }
      });

      if (error) {
        throw error;
      }

      showToast(labels.profileUpdated, undefined, 'success');
    } catch (error) {
      console.error('Error updating full name:', error);
      showToast(labels.errorUpdatingProfile, undefined, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarFileChosen = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast(labels.uploadError, undefined, 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be less than 10MB', undefined, 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreviewUrl(reader.result as string);
      setIsEditingAvatar(true);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleAvatarFileChosen(file);
  };

  const handleAvatarDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleAvatarFileChosen(file);
  };

  const handleAvatarDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleAvatarDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  async function cropAndCompressToSquare(dataUrl: string, outputSize = 512): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = outputSize;
        canvas.height = outputSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        const srcW = img.width;
        const srcH = img.height;
        const side = Math.min(srcW, srcH);
        const sx = (srcW - side) / 2;
        const sy = (srcH - side) / 2;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, sx, sy, side, side, 0, 0, outputSize, outputSize);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create image blob'));
            return;
          }
          resolve(blob);
        }, 'image/jpeg', 0.9);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  }

  const handleConfirmAvatar = async () => {
    if (!avatarPreviewUrl) return;
    setIsUploading(true);
    try {
      const blob = await cropAndCompressToSquare(avatarPreviewUrl, 512);
      const fileName = `${Date.now()}.jpg`;
      const path = `${user.id}/${fileName}`; // inside bucket 'avatars'

      // Remove previous avatar if we have a stored path
      const previousPath = (user.user_metadata?.avatar_path as string | undefined) ?? undefined;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, blob, { upsert: true, contentType: 'image/jpeg' });
      if (uploadError) throw uploadError;

      if (previousPath) {
        // best-effort removal, ignore error
        await supabase.storage.from('avatars').remove([previousPath]).catch(() => { });
      }

      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
      const publicUrl = pub.publicUrl;

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl, avatar_path: path }
      });
      if (updateError) throw updateError;

      showToast(labels.profileUpdated, undefined, 'success');
      setIsEditingAvatar(false);
      setAvatarPreviewUrl(null);
    } catch (err) {
      console.error('Error saving avatar:', err);
      showToast(labels.uploadError, undefined, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelAvatar = () => {
    setIsEditingAvatar(false);
    setAvatarPreviewUrl(null);
  };

  const handleRemoveAvatar = async () => {
    setIsLoading(true);

    try {
      const previousPath = (user.user_metadata?.avatar_path as string | undefined) ?? undefined;
      if (previousPath) {
        await supabase.storage.from('avatars').remove([previousPath]).catch(() => { });
      }
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: null, avatar_path: null as unknown as undefined }
      });

      if (error) {
        throw error;
      }

      showToast(labels.profileUpdated, undefined, 'success');
    } catch (error) {
      console.error('Error removing avatar:', error);
      showToast(labels.errorUpdatingProfile, undefined, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // email editing flow removed

  return (
    <>
      <ToastProvider>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {labels.personalInfo}
              {isSaving && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {labels.saving}
                </div>
              )}
            </CardTitle>
            <CardDescription>
              {labels.editProfile}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div
                  className={`relative w-20 h-20 rounded-full overflow-hidden border ${isDragActive ? 'ring-2 ring-primary' : ''}`}
                  onDragOver={handleAvatarDragOver}
                  onDragLeave={handleAvatarDragLeave}
                  onDrop={handleAvatarDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  aria-label={labels.changeAvatar}
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl font-semibold text-gray-500">
                        {(user.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarInputChange}
                    className="hidden"
                    id="avatar-upload"
                    disabled={isUploading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{labels.avatar}</p>
                {user.user_metadata?.avatar_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    disabled={isLoading}
                  >
                    {labels.removeAvatar}
                  </Button>
                )}
              </div>
            </div>

            {isEditingAvatar && (
              <div className="p-3 rounded-md border bg-accent/10">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border">
                    {avatarPreviewUrl ? (
                      <img src={avatarPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleConfirmAvatar} disabled={isUploading}>
                      {isUploading ? labels.saving : labels.confirm}
                    </Button>
                    <Button variant="outline" onClick={handleCancelAvatar} disabled={isUploading}>
                      {labels.cancel}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{labels.fullName}</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{labels.email}</Label>
                <Input
                  id="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

          </CardContent>
        </Card>
        <Toast
          title={toast.title}
          description={toast.description}
          open={toast.open}
          onOpenChange={hideToast}
        />
        <ToastViewport />
      </ToastProvider>
    </>
  );
}
