package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/rs/cors"
)

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	// Ensure the method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse the incoming form data (for file uploads)
	err := r.ParseMultipartForm(10 << 20) // Limit upload size to 10 MB
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to parse form: %v", err), http.StatusBadRequest)
		return
	}

	// Get the username from the form data
	username := r.FormValue("username") // Retrieve the username
	log.Println("Received username:", username)
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	// Get the file from the form data
	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to get file: %v", err), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Create a directory for uploads if it doesn't exist
	if err := os.MkdirAll("uploads", os.ModePerm); err != nil {
		http.Error(w, fmt.Sprintf("Unable to create upload directory: %v", err), http.StatusInternalServerError)
		return
	}

	// Define the file path and create the file on the server
	videoPath := fmt.Sprintf("uploads/%s.webm", username)
	outFile, err := os.Create(videoPath)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to create file: %v", err), http.StatusInternalServerError)
		return
	}
	defer outFile.Close()

	// Copy the uploaded file to the new file
	_, err = outFile.Write([]byte{}) // Fix this line: Use Write() to save the content
	if err != nil {
		http.Error(w, fmt.Sprintf("Error saving the file: %v", err), http.StatusInternalServerError)
		return
	}

	// Respond with success
	fmt.Fprintf(w, "File uploaded successfully for user: %s", username)
}

func main() {
	// Set up the routes
	http.HandleFunc("/upload", uploadHandler)

	// Set up CORS to allow all origins (for development purposes)
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"*"}, // Allows all origins (use specific URLs in production)
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type"},
	})

	// Wrap the router with CORS middleware
	handler := corsHandler.Handler(http.DefaultServeMux)

	// Start the server
	log.Println("Starting server on :8080...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
