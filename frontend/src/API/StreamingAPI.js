export const startCapture = async () => {
    try {
      // Request screen capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      videoStreamRef.current = stream;
      videoRef.current.srcObject = stream;
      setIsCapturing(true);

      // Create MediaRecorder to record the stream
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoBlob(blob);
      };

      // Start recording
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing screen media:", err);
    }
  };

  // Stop screen capture
  export const stopCapture = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    mediaRecorderRef.current.stop();
    setIsCapturing(false);
  };

  export const sendVideoToBackend = async () => {
    if (videoBlob) {
      const formData = new FormData();
      formData.append("file", videoBlob, "capture.webm");

      try {
        const response = await fetch("http://localhost:8080/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log("Video uploaded successfully");
        } else {
          console.error("Video upload failed");
        }
      } catch (err) {
        console.error("Error uploading video:", err);
      }
    }
  };
