import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const PostForm: React.FC<{
  editingPost?: Post;
  onSuccess?: () => void;
  onClose?: () => void;
}> = ({ editingPost, onSuccess, onClose }) => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>([1]);
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Inhalt ein",
        variant: "destructive",
      });
      return;
    }

    if (!selectedAccountIds || selectedAccountIds.length === 0) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie mindestens ein Konto aus",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // FormData für den Post erstellen
      const formData = new FormData();
      formData.append("content", content);
      formData.append("scheduledDate", scheduledDate.toISOString());
      
      // Account IDs hinzufügen
      if (selectedAccountIds.length === 1) {
        formData.append("accountIds", selectedAccountIds[0].toString());
      } else {
        formData.append("accountIds", JSON.stringify(selectedAccountIds));
      }
      
      // Bild hinzufügen, falls vorhanden
      if (imageFile) {
        formData.append("image", imageFile);
        console.log("Bild zum FormData hinzugefügt:", imageFile.name);
      }
      
      console.log("Sende Post-Daten:", {
        content,
        scheduledDate: scheduledDate.toISOString(),
        accountIds: selectedAccountIds,
        hasImage: !!imageFile
      });
      
      // API-Endpunkt wählen basierend auf Edit-Modus
      const endpoint = editingPost
        ? `/api/posts/${editingPost.id}`
        : "/api/posts";
      
      const method = editingPost ? "PATCH" : "POST";
      
      // Anfrage senden mit Timeout von 15 Sekunden
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(endpoint, {
        method,
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error("Fehler beim Speichern des Posts:", response.status, response.statusText);
        
        // Versuche, den Fehler zu analysieren
        let errorMessage = "Unbekannter Fehler beim Speichern des Posts";
        try {
          const errorData = await response.json();
          console.error("Fehlerdetails:", errorData);
          errorMessage = errorData.message || errorMessage;
          
          if (errorData.error) {
            console.error("Server-Fehler:", errorData.error);
            errorMessage += `: ${errorData.error}`;
          }
          
          if (errorData.details) {
            console.error("Zusätzliche Details:", errorData.details);
          }
        } catch (parseError) {
          console.error("Konnte Fehlerantwort nicht parsen:", parseError);
        }
        
        throw new Error(errorMessage);
      }
      
      const savedPost = await response.json();
      console.log("Post erfolgreich gespeichert:", savedPost);
      
      // Form zurücksetzen
      setContent("");
      setImageFile(null);
      setPreviewUrl("");
      setSelectedAccountIds([1]); // Zurück zum Standardkonto
      setScheduledDate(new Date());
      
      // Erfolgsmeldung anzeigen
      toast({
        title: editingPost ? "Post aktualisiert" : "Post erstellt",
        description: editingPost
          ? "Der Post wurde erfolgreich aktualisiert."
          : "Der Post wurde erfolgreich erstellt und eingeplant.",
      });
      
      // Callback aufrufen, um die UI zu aktualisieren
      onSuccess?.();
      
      // Dialog schließen, wenn im Edit-Modus
      if (editingPost && onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Fehler beim Speichern des Posts:", error);
      
      // Benutzerfreundliche Fehlermeldung anzeigen
      toast({
        title: "Fehler",
        description: error instanceof Error ? error.message : "Der Post konnte nicht gespeichert werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Formular-Teil */}
    </div>
  );
};

export default PostForm; 