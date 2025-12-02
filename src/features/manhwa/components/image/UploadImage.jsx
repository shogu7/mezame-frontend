import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  CardMedia
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const API_BASE = process.env.REACT_APP_API_BASE
  ? `${process.env.REACT_APP_API_BASE}/api/`
  : 'http://localhost:4000/api/';

export default function ImageUploader({ onUploadSuccess, currentImageUrl }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(currentImageUrl || null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérification de la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    // Vérification du type
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    // Créer un aperçu local
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload vers le serveur
    const formData = new FormData();
    formData.append('cover', file);

    setUploading(true);
    setError(null);

    try {
      // --- Utilisation de l'API_BASE corrigée ---
      const url = `${API_BASE}upload/cover`;

      const res = await fetch(url, {
        method: 'POST',
        body: formData
      });
      // ------------------------------------------

      const data = await res.json();

      if (data.ok) {
        console.log('✅ Upload success:', data.url);
        setPreview(data.url);

        // Callback pour le parent avec l'URL
        if (onUploadSuccess) {
          onUploadSuccess(data.url, data.public_id);
        }
      } else {
        setError(data.error || 'Erreur lors de l\'upload');
        setPreview(currentImageUrl);
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
      setError('Erreur de connexion au serveur');
      setPreview(currentImageUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      {/* Aperçu de l'image */}
      {preview && (
        <Box mb={2}>
          <CardMedia
            component="img"
            image={preview}
            alt="Aperçu"
            sx={{
              width: '100%',
              maxWidth: 300,
              height: 'auto',
              borderRadius: 2,
              boxShadow: 2
            }}
          />
        </Box>
      )}

      {/* Bouton d'upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="cover-upload-input"
        disabled={uploading}
      />
      <label htmlFor="cover-upload-input">
        <Button
          variant="contained"
          component="span"
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        >
          {uploading ? 'Upload en cours...' : preview ? 'Changer l\'image' : 'Choisir une image'}
        </Button>
      </label>

      {/* Message d'aide */}
      {!preview && (
        <Typography variant="caption" display="block" mt={1} color="text.secondary">
          JPG, PNG, GIF ou WEBP - Max 5MB
        </Typography>
      )}

      {/* Message d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}